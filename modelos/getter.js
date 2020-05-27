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
     * Gera strings com key = valor
     * 
     * @param {Object} dados dados to parse
     * @param {String | Number} dados.*
     * @returns {String[]} lista de strings com igualdades
     */
    juntaDadosEmIgualdades(dados){

        let elementos = []

        for(let key in dados){

            let sent

            if(key == 'senha') sent = `senha = '${sha256(dados[key])}'`

            else if( typeof dados[key] == 'number') sent = `${key} = ${dados[key]}`

            else sent = `${key} = '${dados[key]}'`

            elementos.push(sent)

        }

        return elementos

    }

       /**
     * 
     * Manipula dados para serem usados em condições
     * 
     * @param {Object} dados dados to parse
     * @param {String | Number} dados.*
     * @returns {String} string para condição
     */
    parseDadosParaWhere(dados){

        let elementos = this.juntaDadosEmIgualdades(dados)

        return elementos.join(" and ")

    }

      /**
     * Executa query :/
     * 
     * @param {String} query query a ser realizado
     * @returns {Object | false} resposta à requisição
     */
    async executaQuery(query){

        let promise = new Promise(
         
        (solve, reject) => {

        this.db.query(query, (erro, resposta) => {

            if(erro){
                console.log("[ ERRO ]  "+erro.message)
                reject(erro)
            }
            else solve(resposta)

        } )

        }
        )

        try {
            const resposta = await promise;
            return resposta;
        }
        catch (_) {
            return false;
        }

    }

    /**
     * 
     * Realiza uma busca numa tabela
     * 
     * @param {String} tabela tabela investigada
     * @param {Object} condicoes condições a serem satisfeitas
     * @param {String | Number} condicoes.* 
     * @returns {Object[] | false} resultado da busca
     */
    async busca(tabela, condicoes){

        let dadosParaCondicao = this.parseDadosParaWhere(condicoes)

        let query = `select * from ${tabela} where ${dadosParaCondicao}`

        let resposta = await this.executaQuery(query);

        return resposta && resposta.rowCount > 0 ? resposta.rows : false;


    }

    /**
     * 
     * Realiza uma busca numa tabela
     * 
     * @param {String} tabela tabela investigada
     * @param {Number} id condições a serem satisfeitas
     * @returns {Object[] | false} resultado da busca
     */
    async buscaItemPorId(tabela, id){

        let query = `select * from ${tabela}_view where id_${tabela} = ${id}`

        let resposta = await this.executaQuery(query);

        return resposta && resposta.rowCount > 0 ? resposta.rows[0] : false;


    }

    async listaTabela(tabela){

        let query = `select * from ${tabela}`

        let resposta = await this.executaQuery(query);

        return resposta ? resposta.rows : false
        
    }

    /**
     * 
     * @param {String} tabela
     * @param {Response} res 
     */
    async executa_lista(tabela){

        console.log("[ GET ]  Listando tabela "+ tabela);

        return await this.listaTabela(tabela)

    }

    async listaRelacional(tabelaA){

        let tabelaB = this.relacoes[tabelaA]

        

        let query = `select ${tabelaA}.*, count(${tabelaB}.*) from ${tabelaA}
                    left join ${tabelaB} using(id_${tabelaA})
                    group by id_${tabelaA}
                    order by id_${tabelaA}`

        let resposta = await this.executaQuery(query)

        return resposta ? resposta.rows : false

    }


    async carregaProduto(id){

        let query = `select produto.*, nome_marca, nome_fornecedor from produto 
        join marca using(id_marca)
        join fornecedor using(id_fornecedor)
        where id_produto = ${id}`

        let resposta = await this.executaQuery(query);

        return resposta ? resposta.rows : false

    }


    /**
     * 
     * @param {Number} id
     */
    async executa_carrega_produto(id){

        console.log("[ GET ]  Reunindo dados de produto");
        
        return await this.carregaProduto(id)

    }

    async buscaProduto(chave){

        let query = `select produto.*, nome_medida from produto 
                    join medida using(id_medida)
                    where (codigo::varchar = '${chave}' )
                    OR (nome_produto ilike '%${chave}%' )`

        let resultado = await this.executaQuery(query)

        return resultado ? resultado.rows : false

    }

    async executa_busca(chave){

        console.log("[ GET ]  Buscando produtos");

        return await this.buscaProduto(chave)  


    }

    async coletaOptionsProdutos(){

        let query =  `select id_produto as value, nome_produto as text, unitario
        from produto join medida using(id_medida)
        order by text`

        let resultado = await this.executaQuery(query)


        return resultado ? resultado.rows : false


    }

    async executa_coleta_options_produtos(){

        console.log("[ GET ]  Coetando opções de produtos para carga")

        return await this.coletaOptionsProdutos()

    }

    async coletaOptions(tabela){

        let add = tabela == 'medida' ? ", unitario " : ""

        let query = `select id_${tabela} as value, nome_${tabela} as text ${add}
        from ${tabela} order by text`

        let resultado = await this.executaQuery(query)

        return resultado ? resultado.rows : false

    }

 
    async executa_coleta_options(tabela){

        console.log("[ GET ]  Coletando opções de "+tabela)

        return await this.coletaOptions(tabela)
    
    }

    

    async executa_relaciona(tabelaA){

        console.log("[ GET ]  Coletando linhas e relações da tabela "+tabelaA)

        return await this.listaRelacional(tabelaA)

    }

    async produtoParaVenda(codigo){

        let query =  `select codigo, id_produto, nome_produto, estoque, valor_produto, nome_medida, unitario
        from produto join medida using(id_medida)
        where codigo = ${codigo}`

        let resultado = await this.executaQuery(query)

        return resultado ? resultado.rows : false        

    }

    async executa_produto_para_venda(codigo){

        console.log("[ GET ]  Verificando produto para venda")
        return await this.produtoParaVenda(codigo)
        
    }



    async executa_carrega_item(tabela, id){

        console.log(`[ GET ]  Carregando item ${id} data tabela ${tabela}`)

        return await this.buscaItemPorId(tabela, id)

    }

    async executa_carrega_subproduto(id_subproduto){

        console.log(`[ GET ] Carregando subproduto ${id_subproduto}`)
      
        let subproduto = (await this.busca('subproduto',{id_subproduto}))[0]
        let pai = (await this.busca('produto_view', {id_produto : subproduto.id_produto_pai}))[0]
        let filho = (await this.busca('produto_view', {id_produto : subproduto.id_produto_filho}))[0]
        return {subproduto, pai, filho}
     
    }

    async listaDependentes(tabela, coluna, valor){

        console.log(`[ GET ]  Carregando itens de ${tabela} baseado em ${coluna}`);

        let pref = ['compra','entrada_estoque'].includes(tabela) ? 'data' : 'nome'

        let query = `select id_${tabela}, ${pref}_${tabela} from ${tabela} where ${coluna} = ${valor}`

        let resposta = await this.executaQuery(query)

        return resposta ? resposta.rows : false
        

    }

    async executa_lista_dependentes(tabela, coluna, valor){

        console.log(`[ GET ]  Carregando itens de ${tabela} baseado em ${coluna}`);

        return this.listaDependentes(tabela, coluna, valor)

    }

    async executa_lista_subprodutos(id_pai){

        console.log(`[ GET ] listando subprodutos de ${id_pai}`)
        let query = `select id_produto, razao,id_subproduto, nome_produto from subproduto join produto on id_produto = id_produto_filho where id_produto_pai = ${id_pai};`
        return (await this.executaQuery(query)).rows

    }

}

module.exports = {loadGetter : db => new Get(db)}

