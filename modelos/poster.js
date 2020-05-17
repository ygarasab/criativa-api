const { Client } = require('pg');
const sha256 = require('js-sha256');

class Post {

    /**
     * 
     * @param {Client} db 
     */
    constructor(db){

        this.db = db

    }

    /**
     * 
     * @param {Object} data 
     */
    parseData(data){

        let colunas = ''
        let valores = ''

        for(let key in data){

            colunas += key + ','

            if(key != "senha") valores += "'" + data[key] + "'," 
            else valores += "'" + sha256(data[key]) + "'," 
        }

        

        return  `(${colunas.substring(0, colunas.length - 1)}) values (${valores.substring(0, valores.length - 1)})`

    }

    /**
     * 
     * @param {String} item
     * @param {Object} data 
     * @param {Response} res 
     */
    insert(item, data, res){

        let erros = {
            funcionario : {
                23505 : 'Já existe um funcionário usando este nome de usuário'
            },

            cliente : {
                23505 : 'Já existe um cliente registrado com este cpf'
            },

            produto : {
                23505 : 'Já existe um produto registrado com este código'
            },

            fornecedor : {
                23505 : 'Já existe um fornecedor registrado com esse nome'
            }
    
        }


        console.log("[ PST ]  Inserindo " + item);

        this.db.query(

            `insert into ${item} ${this.parseData(data)}`,

            (err, _) => {

                if(err!==null){
                    console.log("[ PST ]  [ ERR ]  Inserção falhou")
                    res.send(erros[item][err.code])
                }
                else{
                    console.log("[ PST ]  [ SCS ]  Inserção bem sucedida")
                    res.send("Ok")
                }
            }

        );
        

    }

    realizaCompra(data, res){

        console.log("[ PST ] Realizando Compra");

    
        if(!data.cpf) this.finalizaCompra(data, 1, res)
            

        else 

            this.db.query(`select id_cliente from cliente where cpf_cliente = '${data.cpf}'`,
            
                (err, resposta) => {


                    if(resposta.rowCount) this.finalizaCompra(data, resposta.rows[0].id_cliente, res)

                    else res.send("Cpf inválido")

                }
            )

    }

    finalizaCompra(data, cliente_id, res){

        this.db.query(

            `insert into compra (id_funcionario, valor_compra, metodo_pagamento, id_cliente) 
                values ('${data.id_funcionario}', '${data.valor_compra}', '${data.metodo_pagamento}', ${cliente_id}) 
                returning id_compra`,

            (_, returned) =>  {

                let entradaId = returned.rows[0].id_compra

                let queries = ''

                for(let item of data.itens)

                    queries += 
                        `insert into item_compra (quantidade, id_produto, id_compra)
                            values(${item.quantidade},${item.id_produto}, ${entradaId});
                        update produto set estoque = estoque - ${item.quantidade} where id_produto = ${item.id_produto};`                  
                        
                this.db.query(queries, _ => {

                    res.send("Ok")

                })

            }

        );



    }

    executaLogin(dados, res){

        console.log('[ PST ]  Realizando Login')

        this.db.query(
            `select * from funcionario
            where usuario = '${dados.usuario}'
            and senha = '${sha256(dados.senha)}'`,

            (err, resposta) => {

              

                if(resposta.rowCount) res.send(resposta.rows[0])
                else res.send(false)
                
            }
        )

    }

}

module.exports = {loadPoster : db => new Post(db)}