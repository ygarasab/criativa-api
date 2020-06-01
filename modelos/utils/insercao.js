const {executaQuery, parseDadosParaInsert} = require("./ferramentas")

const insercao = () => ({

    /**
     * @param {String} tabela tabela da inserção
     * @param {Object} dados dados a serem inseridos
     * @param {String | Number} dados.*
     */
    insere : async (dados, tabela) => {
        for(key in dados){
            if(dados[key] === undefined) throw new Error("Há dados faltando")
        }
        let dadosParaInsercao = parseDadosParaInsert(dados)
        let query = `insert into ${tabela} ${dadosParaInsercao}`
        await executaQuery(query);
    },

    /**
     * 
     * Insere numa tabela retornando o id da linha inserida
     * 
     * @param {String} tabela tabela da inserção
     * @param {Object} dados dados a serem inseridos
     * @param {String | Number} dados.*
     * @returns {Number} resposta da requisição
     */
    insereEPegaOId : async (dados, tabela) => {
        for(key in dados){
            if(dados[key] === undefined) throw new Error("Há dados faltando")
        }
        let dadosParaInsercao = parseDadosParaInsert(dados)
        let query = `insert into ${tabela} ${dadosParaInsercao} returning id_${tabela}`
        let resposta = await executaQuery(query);
        return resposta.rows[0]["id_" + tabela]
    }    
})

module.exports = {insercao}