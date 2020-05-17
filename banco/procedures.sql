

create or replace function executa_vend(
    idf integer,valor float,metodo varchar,cpf varchar    
) 
returns integer as
$$
declare

contador integer;
id_c integer := 1;
id_com integer;

begin

       
    select count(id_cliente) into contador from cliente where cpf_cliente = cpf;

    if contador < 1 and cpf != '' then

        insert into cliente (cpf)

    end if;
    
  

    insert into compra (id_funcionario, valor_compra, metodo_pagamento, id_cliente)
    values (idf, valor, metodo, id_c) returning id_compra into  id_com;

    return id_com;

end;

$$
language plpgsql volatile;