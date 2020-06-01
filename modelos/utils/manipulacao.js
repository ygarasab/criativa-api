const {executaQuery, parseDadosParaUpdate, parseDadosParaWhere} = require("./ferramentas")

const manipulacao = () => ({

    /**
     * 
     * @param {String} tabela tabela a ser alterada
     * @param {Object} dados dados a serem inseridos
     * @param {String |Number} dados.*
     * @param {Object} condicoes condições de inserção
     * @param {String | Number} condicoes.* 
     * @returns {Object[] | false} resposta da requisição
     */
    atualiza : async (tabela, dados, condicoes) => {
        for(key in dados){
            if(dados[key] === undefined) throw new Error("Há dados faltando")
        }
        let dadosParaUpdate = parseDadosParaUpdate(dados)
        let dadosParaCondicao = parseDadosParaWhere(condicoes)
        let query = `update ${tabela} set ${dadosParaUpdate} where ${dadosParaCondicao}`
        await executaQuery(query);
    },

    /**
     * 
     * @param {String} tabela tabela a ser alterada
     * @param {Object} condicoes condições de deleção
     * @param {String | Number} condicoes.* 
     */
    deleta : async (tabela, condicoes) => {
        let dadosParaCondicao = parseDadosParaWhere(condicoes)
        let query = `delete from ${tabela} where ${dadosParaCondicao}`
        await executaQuery(query)
    },
 
    /**
     * @param {String} comando,
     * @param {(String | Number)[]} parametros
     */
    executaComando : async (comando, parametros) => {
        let query = `select ${comando}(${parametros.map(parametro => `'${parametro}'`).join()})`
        await executaQuery(query)
    }
})

module.exports = {manipulacao}