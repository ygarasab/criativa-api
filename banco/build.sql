
SET client_encoding = 'UTF8';

create table marca(

    id_marca serial primary key,
    nome_marca varchar(50) unique

);

create table medida(
    id_medida serial primary key,
    nome_medida varchar(20),
    unitario boolean default false
);


create table fornecedor(

    id_fornecedor serial primary key,
    nome_fornecedor varchar(50)  unique,
    email_fornecedor varchar(100),
    telefone_fornecedor varchar(20)

);

create table produto(

    id_produto serial primary key,
    codigo integer unique,
    nome_produto varchar(50),
    estoque float default 0 ,
    valor_produto float,

    id_medida int references medida(id_medida),
    id_marca int references marca(id_marca),
    id_fornecedor int references fornecedor(id_fornecedor)


);

create table funcionario(

    id_funcionario serial primary key,
    nome_funcionario varchar(50),
    usuario varchar(20) unique,
    senha varchar(100),
    prioridade varchar(20)

);

create table cliente(

    id_cliente serial primary key,
    nome_cliente varchar(50),
    cpf_cliente varchar(14) unique,
    senha varchar(100)

);



create table compra(

    id_compra serial primary key,
    data_compra timestamp not null default localtimestamp(0),
    valor_compra float,
    metodo_pagamento varchar(20),

    id_funcionario int references funcionario(id_funcionario),
    id_cliente int references cliente(id_cliente) default 1

);

create table item_compra(

    id_item_compra serial primary key,
    quantidade float,

    id_compra int references compra(id_compra),
    id_produto int references produto(id_produto)

);

create table entregador(

    id_entregador serial primary key,
    nome_entregador varchar(50) unique,
    email_entregador varchar(100) unique,
    telefone_entregador varchar(20) unique

);

create table entrada_estoque(

    id_entrada_estoque serial primary key,
    data_entrada_estoque timestamp not null default localtimestamp(0),

    id_funcionario int references funcionario(id_funcionario),
    id_entregador int references entregador(id_entregador)

);

create table item_entrada_estoque(

    id_item_entrada_estoque serial primary key,
    quantidade float,

    id_produto int references produto(id_produto),
    id_entrada_estoque int references entrada_estoque(id_entrada_estoque)

);



insert into cliente (nome_cliente) values ('Cliente Avulso');


insert into medida (nome_medida, unitario) values ('metros', false);
insert into medida (nome_medida, unitario) values ('centímetros', false);
insert into medida (nome_medida, unitario) values ('unidades', true);
insert into medida (nome_medida, unitario) values ('pacotes', true);