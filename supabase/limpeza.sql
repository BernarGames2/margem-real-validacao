-- 3. Antes de medir de verdade: apagar os testes, feitos sempre com ?utm_source=teste
delete from public.eventos where utm_source = 'teste';
delete from public.leads   where utm_source = 'teste';

-- 4. Pedido de exclusão de uma pessoa: troque o e-mail, tire o "--" e rode
-- delete from public.leads where email = 'pessoa@exemplo.com';

-- 5. Prazo de guarda da política: só em 31/03/2027, tire o "--" e rode
-- delete from public.leads where criado_em < '2027-04-01';
