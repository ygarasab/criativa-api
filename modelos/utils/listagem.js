const {executaQuery} = require("./ferramentas")

const listagem = () => ({

     /**
     * @param {String} tabela tabela a ser verificada
     * @returns {Boolean} tabela vazia? 
     */
    verificaTabelaVazia : async tabela =>{
        let query = `select count(${tabela}.*) from ${tabela}`
        let resposta = await executaQuery(query);
        return !(resposta.rows[0].count > 0)
    },

    /**
     * @param {String} tabela nome da tabela correspondente à view
     * @returns {Object[]} listagem
     */
    listaView : async tabela =>{
        let query = `select * from ${tabela}_view`
        let resposta = await executaQuery(query);
        return resposta.rows
    },

     /**
     * @param {String} tabela  
     * @returns {Object[]}
     */
    listaTabela : async tabela => {
        let query = `select * from ${tabela}`
        let resposta = await executaQuery(query);
        return resposta.rows
    }
})

module.exports = {listagem}