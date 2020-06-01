const {executaQuery, parseDadosParaWhere, parseJoins} = require("./ferramentas")

const selecao = () => ({

    /**
     * 
     * @param {String[]} colunas 
     * @param {String} tabela 
     * @param {Object} condicao 
     */
    selecionaColunasDaTabela : async (colunas, tabela, condicao) => {
        let query = `select ${colunas.join()} from ${tabela} where ${parseDadosParaWhere(condicao)}`
        let resposta = await executaQuery(query);
        return resposta.rows  
    },

     /**
     * 
     * @param {String[]} colunas 
     * @param {String} tabela 
     * @param {Object[]} joins 
     * @param {String} joins[].tabela
     * @param {String} joins[].chave
     * @param {String} joins[].valor
     * @param {Object} condicao 
     */
    selecionaColunasDaTabelaComJoin : async (colunas, tabela, joins, condicao) => {
        let query = `select ${colunas.join()} from ${tabela} ${parseJoins(joins)}`
        if(condicao !== undefined) query += ` where ${parseDadosParaWhere(condicao)}`
        let resposta = await executaQuery(query)
        return resposta.rows  
    },

    /**
     * 
     * @param {String[]} colunas 
     * @param {String} tipo 
     * @param {Object} condicao 
     */
    selecionaColunasComJoinOrdenandoPorColuna : async (colunas, tabela, joins, condicao, ordenador) => {
        let where = condicao ? `where ${parseDadosParaWhere(condicao)}` : ''
        let query = `select ${colunas.join()} from ${tabela} ${parseJoins(joins)}  ${where} order by ${ordenador}`
        let resposta = await executaQuery(query)
        return resposta.rows 
    }
})

module.exports = {selecao}