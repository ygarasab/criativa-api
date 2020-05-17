const { Client } = require('pg');


class Get {

    /**
     * 
     * @param {Client} db 
     */
    constructor(db){

        this.db = db

        this.relacoes = {
            marca : 'produto',
            fornecedor : 'produto',
            entrada_estoque : 'item_entrada_estoque',
            entregador : 'entrada_estoque',
            funcionario : 'compra',
            cliente : 'compra'
        }

    }

    /**
     * 
     * @param {String} tabela
     * @param {Response} res 
     */
    list(tabela, res){

        console.log("[ GET ]  Listando tabela "+ tabela);

        this.db.query("select * from "+tabela, (err, dbRes) => {

        
            

            res.send(dbRes.rows);

        })

    }


    /**
     * 
     * @param {Object} data 
     * @param {Response} res 
     */
    produto(data, res){

        console.log("[ GET ]  Reunindo dados de produto");
        

        let id = data.id

        if("codigo" in data){

    
        } else if ( ! ("id" in data)) res.send('error')

        this.db.query(
            
            `select produto.*, nome_marca, nome_fornecedor from produto 
                join marca using(id_marca)
                join fornecedor using(id_fornecedor)
                where id_produto = ${id}`,

            (error,produto) => {


                res.send(produto.rows[0])
                
            }

        )

    }

    busca(data, res){

        console.log("[ GET ]  Buscando produtos");

        let chave = data.chave

        this.db.query(
            `select produto.*, nome_medida from produto 
            join medida using(id_medida)
            where (codigo::varchar = '${chave}' )
            OR (nome_produto ilike '%${chave}%' )`,
            (error,produtos) => {

                if(error) console.log(error)
                else res.send(produtos.rows)
                
            }
        )

    }

    coletaOptionsProdutos(res){

        console.log("[ GET ]  Coetando opções de produtos para carga")

        this.db.query(
            `select id_produto as value, nome_produto as text, unitario
            from produto join medida using(id_medida)
            order by text`,

            (error,options) => {

                if(error) console.log(error)
                else{
                    
                    res.send(options.rows)
                }
                
            }
        )

    }

 
    coletaOptions(tabela, res){

        console.log("[ GET ]  Coetando opções de "+tabela)

        let add = tabela == 'medida' ? ", unitario " : ""

        this.db.query(
            `select id_${tabela} as value, nome_${tabela} as text ${add}
            from ${tabela} order by text
        `,

            (error,options) => {

                if(error) console.log(error)
                else{

            
                    res.send(options.rows)
                }
                
            }
        )
    
    }

    listaRelacional(tabelaA, res){

        let tabelaB = this.relacoes[tabelaA]

        console.log("[ GET ]  Coletando linhas e relações da tabela "+tabelaA)

        this.db.query(
            `select ${tabelaA}.*, count(${tabelaB}.*) from ${tabelaA}
            left join ${tabelaB} using(id_${tabelaA})
            group by id_${tabelaA}
            order by id_${tabelaA}`, (_, resultado) => {

                res.send(resultado.rows)

            }
        )

    }

    produtoVenda(data, res){

        console.log("[ GET ]  Verificando produto para venda")

        this.db.query(
            `select codigo, id_produto, nome_produto, estoque, valor_produto, nome_medida, unitario
                from produto join medida using(id_medida)
                where codigo = ${data.codigo}` , 
            
            (err, resultado) => {
    
                res.send(resultado.rows)
            }
        )

    }


    carregaItem(tabela, id, res){

        console.log(`[ GET ]  Carregando item ${id} data tabela ${tabela}`)

        this.db.query(
            `select * from ${tabela}_view where id_${tabela} = ${id}`,
            (err, resultado) => {
                if(err)console.log(err)
                res.send(resultado.rows[0])
            }
        )

    }

    listaDependentes(tabela, coluna, valor, res){

        console.log(`[ GET ]  Carregando itens de ${tabela} baseado em ${coluna}`);

        let pref = ['compra','entrada_estoque'].includes(tabela) ? 'data' : 'nome'

        this.db.query(
            `select id_${tabela}, ${pref}_${tabela} from ${tabela} where ${coluna} = ${valor}`,
            (err, resultado) => {

                if(err)console.log(err)
               
                res.send(resultado.rows)
            }
        )
        

    }

}

module.exports = {loadGetter : db => new Get(db)}

