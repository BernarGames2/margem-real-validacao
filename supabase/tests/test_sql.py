#!/usr/bin/env python3
"""Testa supabase/schema.sql, consultas.sql e limpeza.sql num PostgreSQL que imita os papéis do Supabase.

Precisa do psql e de um servidor PostgreSQL 15 ou mais novo. A conexão vem das variáveis
padrão do psql (PGHOST, PGPORT, PGUSER, PGPASSWORD). Cria e apaga o banco PGTEST_DB
(padrão: pagina_teste). Uso: python3 supabase/tests/test_sql.py
"""
import os
import subprocess
import sys
from pathlib import Path

PASTA = Path(__file__).resolve().parent.parent
BANCO = os.environ.get("PGTEST_DB", "pagina_teste")
PSQL = ["psql", "-X", "-q", "-At", "-v", "ON_ERROR_STOP=1"]


def rodar(sql: str, banco: str = BANCO) -> tuple[int, str]:
    r = subprocess.run(PSQL + ["-d", banco, "-c", sql], capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()


def rodar_arquivo(caminho: Path, banco: str = BANCO) -> tuple[int, str]:
    r = subprocess.run(PSQL + ["-d", banco, "-f", str(caminho)], capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()


def preparar() -> None:
    for sql in (f"drop database if exists {BANCO}", f"create database {BANCO}"):
        codigo, saida = rodar(sql, banco="postgres")
        assert codigo == 0, saida
    # Papéis e privilégios padrão como no Supabase: anon e authenticated recebem tudo por padrão,
    # e o schema.sql precisa retirar isso.
    codigo, saida = rodar(
        """
        do $$ begin
          if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
          if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
        end $$;
        grant usage on schema public to anon, authenticated;
        alter default privileges in schema public grant all on tables to anon, authenticated;
        alter default privileges in schema public grant all on sequences to anon, authenticated;
        """
    )
    assert codigo == 0, saida
    for vez in (1, 2):  # o schema pode ser rodado de novo sem erro
        codigo, saida = rodar_arquivo(PASTA / "schema.sql")
        assert codigo == 0, f"schema.sql falhou na execução {vez}: {saida}"


def lead(v="a", w="5511912345678", m="Mercado Livre", f="R$ 200 a 500 mil", a="Sim", c="true", u="teste", arm="''"):
    return (
        "insert into public.leads (variante, nome, email, whatsapp, marketplace, faturamento, anuncios, "
        "ferramenta, maior_dor, consentimento, utm_source, armadilha) values "
        f"('{v}', 'Ana Teste', 'ana@example.com', '{w}', '{m}', '{f}', '{a}', 'Bling', "
        f"'Custo de anúncio por produto', {c}, '{u}', {arm})"
    )


CASOS = [
    # (descrição, sql como visitante, deve funcionar?, trecho esperado do erro)
    ("lead válido", lead(), True, None),
    ("lead fora do perfil", lead(v="b", f="Menos de R$ 50 mil", u="grupo-x"), True, None),
    ("telefone fixo de 8 dígitos", lead(v="c", w="551133334444", u="grupo-x"), True, None),
    ("armadilha nula", lead(arm="null", u="grupo-x"), True, None),
    ("sem consentimento", lead(c="false"), False, "violates"),
    ("armadilha preenchida (robô)", lead(arm="'http://spam'"), False, "violates"),
    ("versão inexistente", lead(v="d"), False, "violates"),
    ("WhatsApp sem 55", lead(w="11912345678"), False, "violates"),
    ("WhatsApp com DDD 0", lead(w="5501912345678"), False, "violates"),
    ("faturamento fora da lista", lead(f="Não sei"), False, "violates"),
    ("e-mail inválido", lead().replace("ana@example.com", "ana@@example"), False, "violates"),
    ("nome de 1 letra", lead().replace("'Ana Teste'", "'A'"), False, "violates"),
    ("insert pedindo a linha de volta (returning)", lead() + " returning id", False, "permission denied"),
    ("ler leads", "select count(*) from public.leads", False, "permission denied"),
    ("alterar leads", "update public.leads set nome = 'X'", False, "permission denied"),
    ("apagar leads", "delete from public.leads", False, "permission denied"),
    ("evento de visita", "insert into public.eventos (tipo, variante, utm_source) values ('visita', 'a', 'grupo-x')", True, None),
    ("evento de visita b", "insert into public.eventos (tipo, variante, utm_source) values ('visita', 'b', 'grupo-x')", True, None),
    ("evento de clique", "insert into public.eventos (tipo, variante, utm_source) values ('clique_cta', 'a', 'grupo-x')", True, None),
    ("evento de teste", "insert into public.eventos (tipo, variante, utm_source) values ('visita', 'a', 'teste')", True, None),
    ("evento de tipo inválido", "insert into public.eventos (tipo, variante) values ('compra', 'a')", False, "violates"),
    ("ler eventos", "select * from public.eventos", False, "permission denied"),
    ("papel authenticated não insere", "set role authenticated; " + lead(), False, "permission denied"),
]


def main() -> int:
    preparar()
    falhas = 0
    for descricao, sql, deve_funcionar, erro in CASOS:
        completo = sql if sql.startswith("set role") else "set role anon; " + sql
        codigo, saida = rodar(completo)
        ok = codigo == 0 if deve_funcionar else (codigo != 0 and erro in saida)
        print(("OK    " if ok else "FALHA ") + descricao + ("" if ok else f" -> {saida}"))
        falhas += 0 if ok else 1

    _, saida = rodar("select variante, perfil_provavel from public.leads order by id")
    esperado = ["a|t", "b|f", "c|t", "a|t"]
    if saida.split("\n") != esperado:
        print(f"FALHA perfil_provavel: {saida!r} != {esperado!r}")
        falhas += 1

    codigo, saida = rodar_arquivo(PASTA / "consultas.sql")
    esperado_consultas = ["a|2|1|0|2|2|100.0", "b|1|0|0|1|0|100.0", "c|0|0|0|1|1|", "grupo-x|3|2", "teste|1|1"]
    if codigo != 0 or saida.split("\n") != esperado_consultas:
        print(f"FALHA consultas.sql: {saida!r}")
        falhas += 1
    else:
        print("OK    consultas.sql (funil por versão e origem)")

    codigo, saida = rodar_arquivo(PASTA / "limpeza.sql")
    _, restantes = rodar(
        "select (select count(*) from public.leads) || '|' || (select count(*) from public.eventos)"
    )
    if codigo != 0 or restantes != "3|3":
        print(f"FALHA limpeza.sql apagou o que não devia: {saida!r} {restantes!r}")
        falhas += 1
    else:
        print("OK    limpeza.sql (apaga só os testes)")

    rodar(f"drop database if exists {BANCO}", banco="postgres")
    print(f"{len(CASOS) + 3 - falhas} de {len(CASOS) + 3} verificações passaram")
    return 1 if falhas else 0


if __name__ == "__main__":
    sys.exit(main())
