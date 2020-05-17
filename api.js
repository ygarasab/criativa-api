const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser')
const { Client } = require('pg');
const getter = require('./modelos/getter');
const poster = require('./modelos/poster');
const {config} = require('./config');

const urlParser = bodyParser.urlencoded({extended:false})



class API {

    constructor(){
  
        this.app = express();
        this.server = http.createServer(this.app);

        this.db = new Client(config)


        this.db.connect();


        this.get = getter.loadGetter(this.db)
        
        this.post = poster.loadPoster(this.db)
        

        this.port = process.env.PORT || 5000;

        this.app
        
        .use(express.urlencoded())

        .use(express.json())

        .use(cors())

        .get("/lista/:tabela", (req, res) => this.get.list(req.params.tabela, res))
        
        .get("/relaciona/:tabela", 
            (req, res) => this.get.listaRelacional(req.params.tabela, res))
        
        .get("/item/:tabela/:id",
            (req, res) => this.get.carregaItem(req.params.tabela, req.params.id, res))

        .get("/dependentes/:tabela/:coluna/:valor",
            (req,res) => this.get.listaDependentes(req.params.tabela, req.params.coluna, req.params.valor, res))

        .get("/busca", (req, res) => this.get.busca(req.query, res) )

        .get("/options", (req, res) => this.get.coletaOptions(req.query.tabela, res))

        .get("/optionsProduto", (req, res) => this.get.coletaOptionsProdutos(res))

        .get("/produto_venda", (req, res) => this.get.produtoVenda(req.query,res))
        
        


        .post("/insere/:tabela", (req, res) => this.post.insert(req.params.tabela,req.body, res))

        .post("/entrada_estoque", (req, res) => this.adicionaEstoque(req.body, res))

        .post("/realiza_compra", (req, res) => this.post.realizaCompra(req.body, res))

        .post("/login", (req, res) => this.post.executaLogin(req.body, res))



        .get("/produto", (req, res) => this.get.produto(req.query, res))
        

        

        this.server.listen(this.port, _ => console.log(`[ CRT ]  Listening on port ${this.port}`))

    }

    


    adicionaEstoque(data, res){

        console.log("[ CRTV ] Adicionando produtos ao estoque");

        this.db.query(

            `insert into entrada_estoque (id_funcionario, id_entregador) 
                values ('${data.id_funcionario}', '${data.id_entregador}') returning id_entrada_estoque`,

            (_, returned) =>  {

                let entradaId = returned.rows[0].id_entrada_estoque

                let queries = ''

                for(let item of data.itens)

                    queries += 
                        `insert into item_entrada_estoque (quantidade, id_produto, id_entrada_estoque)
                            values(${item.quantidade},${item.id_produto}, ${entradaId});
                        update produto set estoque = estoque + ${item.quantidade} where id_produto = ${item.id_produto};`                  
                        
                this.db.query(queries, _ => {

                    res.send("Ok")

                })

                

            }

        );

    }

}

api = new API();
