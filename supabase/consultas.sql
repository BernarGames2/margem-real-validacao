-- 1. Funil por variante. H5 pede 15% ou mais de visitantes qualificados deixando contato.
--    Para medir só canais de sellers, acrescente "where utm_source in ('grupo-x', 'comunidade-y')" nas duas consultas internas.
with e as (
  select variante,
         count(*) filter (where tipo = 'visita')            as visitas,
         count(*) filter (where tipo = 'clique_cta')        as cliques,
         count(*) filter (where tipo = 'inicio_formulario') as inicios
  from public.eventos
  group by variante
),
l as (
  select variante,
         count(*)                                as leads,
         count(*) filter (where perfil_provavel) as leads_no_perfil
  from public.leads
  group by variante
)
select variante,
       coalesce(e.visitas, 0)         as visitas,
       coalesce(e.cliques, 0)         as cliques,
       coalesce(e.inicios, 0)         as inicios_formulario,
       coalesce(l.leads, 0)           as leads,
       coalesce(l.leads_no_perfil, 0) as leads_no_perfil,
       round(100.0 * coalesce(l.leads, 0) / nullif(e.visitas, 0), 1) as conversao_pct
from e full join l using (variante)
order by variante;

-- 2. De onde vêm os leads
select coalesce(utm_source, '(sem origem)') as origem,
       count(*)                                as leads,
       count(*) filter (where perfil_provavel) as no_perfil
from public.leads
group by 1
order by leads desc;
