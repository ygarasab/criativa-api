drop view item_compra_view;

create view item_compra_view as
select id_compra, estornado, id_item_compra as id_item_compra_view,
concat(nome_produto, ' - ', quantidade,' ',nome_medida) as nome_item_compra_view
from item_compra
join produto using(id_produto)
join medida using(id_medida)
order by id_item_compra;

alter table item_compra add estornado boolean default false;