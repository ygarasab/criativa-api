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
     * Executa query :/
     * 
     * @param {String} query query a ser realizado
     * @returns {Object[] | false} resposta à requisição
     */
    async executaQuery(query){

        console.log(query);
        

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

    async listaTabela(tabela){

        let query = `select * from ${tabela}`

        let resposta = await this.executaQuery(query);

        return resposta ? resposta.rows : false
        
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

        return resposta && resposta.rowCount > 0? resposta.rows : false;


    }

    /**
     * 
     * Realiza uma busca numa tabela
     * 
     * @param {String} tabela tabela investigada
     * @param {Number} id condições a serem satisfeitas
     * @returns {Object | false} objeto buscado ou false
     */
    async buscaItemPorId(tabela, id){

        let query = `select * from ${tabela} where id_${tabela} = ${id}`

        let resposta = await this.executaQuery(query);

        return resposta && resposta.rowCount > 0 ? resposta.rows[0] : false;


    }

     /**
     * 
     * Manipula dados para serem usados em inserção
     * 
     * @param {Object} dados dados to parse
     * @param {String | Number} dados.*
     * @returns {String} string para inserção
     */
    parseDadosParaInsert(dados){

        
        let colunas = ''
        let valores = ''

        for(let key in dados){

            colunas += key + ','

            valores += key == "senha" 
                ? `'${sha256(dados[key])}',`
                : `'${dados[key]}',`

        }

        

        return `(${colunas.substring(0, colunas.length - 1)}) values (${valores.substring(0, valores.length - 1)})`


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
     * Atualiza uma tabela
     * 
     * @param {String} tabela tabela a ser alterada
     * @param {Object} dados dados a serem inseridos
     * @param {String |Number} dados.*
     * @param {Object} condicoes condições de inserção
     * @param {String | Number} condicoes.* 
     * @returns {Object[] | false} resposta da requisição
     */
    async update(tabela, dados, condicoes){

        let dadosParaUpdate = this.parseDadosParaUpdate(dados)
        let dadosParaCondicao = this.parseDadosParaWhere(condicoes)

        let query = `update ${tabela} set ${dadosParaUpdate} where ${dadosParaCondicao}`

        return this.executaQuery(query);


    }


    /**
     * 
     * Manipula dados para serem usados em updates
     * 
     * @param {Object} dados dados to parse
     * @param {String | Number} dados.*
     * @returns {String} string para update
     */
    parseDadosParaUpdate(dados){
        
        let elementos = this.juntaDadosEmIgualdades(dados)

        return elementos.join()

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
     * 
     * Insere numa tabela retornando o id da linha inserida
     * 
     * @param {String} tabela tabela da inserção
     * @param {Object} dados dados a serem inseridos
     * @param {String | Number} dados.*
     * @returns {Number} resposta da requisição
     */
    async insere_get_id(dados, tabela){

        let dadosParaInsercao = this.parseDadosParaInsert(dados)

        let query = `insert into ${tabela} ${dadosParaInsercao} returning id_${tabela}`

        let resposta = await this.executaQuery(query);


        return resposta ? resposta.rows[0]["id_" + tabela] : false

    }
    


    /**
     * 
     * Inserção de dados com um tratamento de erros a mais
     * 
     * @param {Object} dados dados a serem inseridos
     * @param {String | Number} dados.*
     * @param {String} tabela tabela alvo da inserção
     * 
     * @returns {String} output da ação
     */
    async insere(dados, tabela){

        let erros = {

            funcionario : 'Já existe um funcionário usando este nome de usuário',

            cliente : 'Já existe um cliente registrado com este cpf',

            produto :  'Já existe um produto registrado com este código',

            fornecedor :'Já existe um fornecedor registrado com esse nome',
    
        }


        let query = `insert into ${tabela} ${this.parseDadosParaInsert(dados)}`
     
        let resultado = await this.executaQuery(query)

        return resultado ? "Ok" : erros[tabela]

    }

    async executa_insere(dados, tabela){

        console.log("[ PST ]  Inserindo " + tabela);

        return await this.insere(dados, tabela)

    }



    /**
     * 
     * @param {String} cpf cpf do cliente
     * @returns {Number | false} id do cliente
     */
    async pegaIdDoClientePeloCpf(cpf){

        let resultado = await this.busca("cliente", {cpf_cliente : cpf})

        return resultado ? resultado[0].id_cliente :  false

    }
    
    async executa_compra(dados){

        console.log("[ PST ] Realizando Compra");
      
        return !dados.cpf

        ? await this.finalizaCompra(dados, 1)

        : await this.finalizaCompra(dados, await this.pegaIdDoClientePeloCpf(dados.cpf))



    }


    /**
     * 
     * @param {Object[]} itens itens comprados
     * @param {Number} itens[].id_produto id do produto comprado
     * @param {Number} itens[].quantidade quantidade do produto comprado
     * @param {Number} idCompra id da compra
     * 
     * @returns {String} output da ação 
     */
    async insereItensDaCompra(itens, idCompra){

        let queries = ''

        for(let item of itens)

        queries += 
            `insert into item_compra (quantidade, id_produto, id_compra)
                values(${item.quantidade},${item.id_produto}, ${idCompra});
            update produto set estoque = estoque - ${item.quantidade} where id_produto = ${item.id_produto};`                  

        let resposta = await this.executaQuery(queries);

        return resposta ? "Ok" : "Erro na inserção dos itens";
    

    }

    /**
     * 
     * @param {Object} data dados da compra
     * @param {Number} data.id_funcionario id do funcionario que vendeu
     * @param {Number} data.valor_compra valor da compra
     * @param {String} data.metodo_pagamento método de pagamento
     * @param {Object[]} data.itens itens comprados
     * @param {Number} cliente_id id do cliente que comprou
     * 
     * @returns {String} output da ação
     */
    async finalizaCompra(data, cliente_id){

        let dadosInsert = {

            id_funcionario : data.id_funcionario,
            valor_compra : data.valor_compra,
            metodo_pagamento : data.metodo_pagamento,
            id_cliente : cliente_id

        }
        

        let idCompra = await this.insere_get_id(dadosInsert, "compra")

        return idCompra

        ? await this.insereItensDaCompra(data.itens, idCompra)
        : "Erro na criação da compra"


    }
    
    /**
     * 
     * realiza o login do usuario
     * 
     * @param {Object} dadosDoUsuario 
     * @param {String} dadosDoUsuario.*
     * 
     * @returns {Object | false} usuario
     */
    async login(dadosDoUsuario){

        let resultado = await this.busca("funcionario", dadosDoUsuario)

        return resultado ? resultado[0] : false

    }


    async executa_login(dados){

        console.log('[ PST ]  Realizando Login')

        return await this.login(dados)

    }


    /**
     * 
     * @param {Object[]} itens itens addicionados
     * @param {Number} itens[].id_produto id do produto adicionado
     * @param {Number} itens[].quantidade quantidade do produto adicionado
     * @param {Number} idEntrada id da entrada de estoque
     * 
     * @returns {String} output da ação 
     */
    async adicionaItensDeEntradaDeEstoque(itens, idEntrada){

        let queries = ''

        for(let item of itens)

        queries += 
            `insert into item_entrada_estoque (quantidade, id_produto, id_entrada_estoque)
                values(${item.quantidade},${item.id_produto}, ${idEntrada});
            update produto set estoque = estoque + ${item.quantidade} where id_produto = ${item.id_produto};`                  
                    
        let resposta = await this.executaQuery(queries);

        return resposta ? "Ok" : "Erro na inserção dos itens";


    }

    /**
     * 
     * Realiza uma entrada de estoque
     * 
     * @param {Number} funcionario id do funcionário que está realizando a entrada
     * @param {Number} entregador id do entregador do estoque
     * @param {Object{}} itens itens adicionados
     * 
     * @returns {String} output da ação
     */
    async entradaEstoque(funcionario, entregador, itens){

        let dadosParaInsercao = {
            id_funcionario : funcionario,
            id_entregador : entregador
        }

        let idEntrada = await this.insere_get_id(dadosParaInsercao, "entrada_estoque")

        return idEntrada

        ? await this.adicionaItensDeEntradaDeEstoque(itens, idEntrada)
        : "Erro na criação de entrada de estoque"


    }

    async executa_entrada_estoque(dados){

        console.log("[ PST ] Adicionando produtos ao estoque");

        return await this.entradaEstoque(dados.id_funcionario, dados.id_entregador, dados.itens)

    }


    /**
     * 
     * @param {Number} produto id do produto afetado
     * @param {Number} quantidade quantidade retirada
     * 
     * @returns {String} output da ação
     */
    async diminuiQuantidadeDeProduto(produto, quantidade){

        let query = `update produto set estoque = estoque - ${quantidade} where id_produto = ${produto};`

        return await this.executaQuery(query)

        ? "Ok"
        : "Falha ao diminuir quantidade de produto"

    }


    /**
     * 
     * @param {Number} produto id do produto afetado
     * @param {Number} quantidade quantidade adicionada
     * 
     * @returns {String} output da ação
     */

    async aumentaQuantidadeDeProduto(produto, quantidade){

        let query = `update produto set estoque = estoque + ${quantidade} where id_produto = ${produto};`

        return await this.executaQuery(query)

        ? "Ok"
        : "Falha ao aumentar quantidade de produto"

    }


    /**
     * 
     * @param {Number} idItem id do item de compra estornado
     * @returns {String} output da ação
     */
    async estornaItemCompra(idItem){

        let item = await  this.buscaItemPorId("item_compra",idItem)

        return !item 

        ? "Item inválido"

        : item.estornado

        ? "Este item já foi estornado"

        : ! await this.update("item_compra", {estornado : true}, {id_item_compra : idItem})

        ? "Erro ao estornanr Item"
        : await this.aumentaQuantidadeDeProduto(item.id_produto, item.quantidade)

    }

    async executa_estorna_item_compra(dados){

        console.log("[ PST ]   Estornando item "+dados.id);
        
        return await this.estornaItemCompra(dados.id)
        

    }


    /**
     * 
     * @param {Number} idCompra id da compra a ser estornada
     * @returns {String} output da ação
     */
    async estornaCompra(idCompra){

        let itensDaCompra = this.busca("item_compra", {id_compra : idCompra, estornado : false})

        if(itensDaCompra) itensDaCompra.forEach( async item => await this.estornaItemCompra(item.id_item_compra) )

        return itensDaCompra ? "Ok" : "Essa compra não existe ou todos os seus itens ja foram estornados"

    }


    async executa_estorna_compra(dados){

        console.log("[ PST ] Estornando compra")

        return await this.estornaCompra(dados.id_)

    }


    /**
     * 
     * Cria uma relação de de pendencia hierárquica entre dois produtos
     * 
     * @param {Number} idPai id do produto pai
     * @param {Number} idFilho id do produto filho
     * @param {Number} razao relação quantida filho /  quantidade pai
     * @returns {String} output da ação
     */
    async criaSubproduto(idPai, idFilho, razao){

        let dadosInsert = {

            id_produto_pai : idPai,
            id_produto_filho : idFilho,
            razao : razao

        }

        return await this.insere(dadosInsert, "subproduto")

        ? "Ok"
        : "Falha na criação do subproduto"

    }



    async verificaSeSuprodutoJaExiste(id_produto_pai, id_produto_filho){

        return this.busca('subproduto', {id_produto_pai, id_produto_filho})
        

    }


    async executa_cria_subproduto(dados){

        console.log("[ PST ]  Criando subproduto")

        if(dados.id_pai == dados.id_filho) return "Impossível criar relação com dois produtos iguais"
        else if(await this.verificaSeSuprodutoJaExiste(dados.id_pai, dados.id_filho))
            return "Subproduto já existe"
        else return await this.criaSubproduto(dados.id_pai, dados.id_filho, dados.razao)

    }

    /**
     * 
     * Transefere estoque de um produto pai para um produto filho, por meio de um vínculo pré existente
     * 
     * @param {Number} id_subproduto id da relação entre os produtos alvo
     * @param {Number} quantidade quantidade retirada do produto pai
     * @returns {String} output da ação
     */

    async transfereParaSubproduto(id_subproduto, quantidade){

        let subproduto = (await this.busca("subproduto", {id_subproduto}))[0]

        return !subproduto

        ? "Subproduto Inexistente"

        : await this.diminuiQuantidadeDeProduto(subproduto.id_produto_pai, quantidade)

        ? await this.aumentaQuantidadeDeProduto(subproduto.id_produto_filho, quantidade * subproduto.razao)
        : "Produto pai desprovido de estoque"


    }

    async executa_transfere_para_subproduto(dados){

        console.log("[ PST ]  Transferindo para subproduto")

        return await this.transfereParaSubproduto(dados.id_subproduto, dados.quantidade)

    }


}

module.exports = {loadPoster : db => new Post(db)}