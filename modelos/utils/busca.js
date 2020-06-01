const {executaQuery, parseDadosParaWhere} = require("./ferramentas")

const busca = () => ({

     /**
     * 
     * Realiza uma busca numa tabela
     * 
     * @param {String} tabela tabela investigada
     * @param {Object} condicoes condições a serem satisfeitas
     * @param {String | Number} condicoes.* 
     * @returns {Object[]} resultado da busca
     */
    busca : async(tabela, condicoes) => {
        let dadosParaCondicao = parseDadosParaWhere(condicoes)
        let query = `select * from ${tabela} where ${dadosParaCondicao}`
        let resposta = await executaQuery(query);
        return resposta.rows
    },

    /**
     * 
     * @param {String} tabela 
     * @param {Number} id 
     * @returns {Object} item ou falso
     */
    pegaItemPeloId : async (tabela, id) => {
        let query = `select * from ${tabela} where id_${tabela} = ${id}`
        let resposta = await executaQuery(query)
        if(resposta.rowCount == 0) throw new Error("Id inválido para "+ tabela)
        return resposta.rows[0]
    },
    
    /**
     * 
     * Conta ocorrencias de uma condição numa tabela
     * 
     * @param {String} tabela tabela de busca
     * @param {Object} condicoes condições de ocorrencia
     * @param {String | Number} condicoes.*
     * @returns {Number} numero de ocorrências
     */
    contaOcorrenciasNaTabela : async (tabela, condicoes) => {
        let dadosParaCondicao = parseDadosParaWhere(condicoes)
        let query = `select count(*) from ${tabela} where ${dadosParaCondicao}`
        let resposta = await executaQuery(query)
        return resposta.rows[0].count
    },

    /**
     * 
     * @param {String} tabela 
     * @param {Number} id 
     * @returns {Number} estado do elemento
     */
    buscaEstadoDoElemento : async (tabela, id) => {
        let query = `select estado_${tabela} from ${tabela} where id_${tabela} = ${id};`
        let resultado = await executaQuery(query)
        if(resultado.rowCount == 0) throw new Error("Id inválido para " + tabela)
        else return resultado.rows[0]["estado_"+tabela]
    },

    /**
     * @param {String} chave
     * @returns {Object[]}
     */
    buscaProduto : async chave => {
        let query = `select produto.*, nome_medida from produto 
                    join medida using(id_medida)
                    where (codigo::varchar = '${chave}' )
                    OR (nome_produto ilike '%${chave}%' )`

        return (await executaQuery(query)).rows
    }
})

module.exports = {busca}