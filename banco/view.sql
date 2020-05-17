create view marca_view as 
select id_marca, nome_marca, count(id_produto)
from marca
join produto using(id_marca)
group by id_marca;




create view produto_view as
select produto.*, nome_fornecedor, nome_marca, nome_medida
from produto
join fornecedor using(id_fornecedor)
join marca using(id_marca)
join medida using(id_medida)
order by id_produto;


create view entregador_view as
select entregador.* , count(id_entrada_estoque)
from entregador
left join entrada_estoque using(id_entregador)
group by id_entregador;

create view fornecedor_view as
select fornecedor.* , count(id_produto)
from fornecedor
left join produto using(id_fornecedor)
group by id_fornecedor;


create view entrada_estoque_view as
select entrada_estoque.* , count(id_item_entrada_estoque), nome_funcionario, nome_entregador
from entrada_estoque
join funcionario using(id_funcionario)
join entregador using(id_entregador)
left join item_entrada_estoque using(id_entrada_estoque)
group by id_entrada_estoque, nome_funcionario, nome_entregador
order by id_entrada_estoque;


create view funcionario_view as
select id_funcionario, nome_funcionario, prioridade, count(id_compra)
from funcionario 
left join compra using(id_funcionario)
group by id_funcionario;


create view compra_view as
select compra.* , count(id_item_compra), nome_funcionario, nome_cliente
from compra
join funcionario using(id_funcionario)
join cliente using(id_cliente)
left join item_compra using(id_compra)
group by id_compra, nome_funcionario, nome_cliente
order by id_compra;


create view item_entrada_view as
select id_entrada_estoque, id_produto as id_item_entrada_view,
concat(nome_produto, ' - ', quantidade,' ',nome_medida) as nome_item_entrada_view
from item_entrada_estoque
join produto using(id_produto)
join medida using(id_medida)
order by id_item_entrada_estoque;


create view item_compra_view as
select id_compra, id_produto as id_item_compra_view,
concat(nome_produto, ' - ', quantidade,' ',nome_medida) as nome_item_compra_view
from item_compra
join produto using(id_produto)
join medida using(id_medida)
order by id_item_compra;


create view cliente_view as
select id_cliente, nome_cliente, 
count(id_compra), sum(valor_compra) as gasto
from cliente
left join compra using(id_cliente)
group by (id_cliente);




