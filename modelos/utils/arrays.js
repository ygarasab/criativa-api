const {executaQuery} = require("./ferramentas")

const arrays = () => ({

    /**
     * 
     * @param {String} tabela 
     * @param {Number} id 
     * @param {String} lista 
     * @param {String | Number} elemento 
     */
    removeItemDeLista : async (tabela, id, lista, elemento) => {
        let query = `update ${tabela} set ${lista} = array_remove(${lista}, '${elemento}') where id_${tabela} = ${id}`
        await executaQuery(query)
    },

    /**
     * 
     * @param {String} tabela 
     * @param {Number} id 
     * @param {String} lista 
     * @param {String | Number} elemento 
     */
    adicionaItemALista : async (tabela, id, lista, elemento) => {
        let query = `update ${tabela} set ${lista} = array_append(${lista}, '${elemento}') where id_${tabela} = ${id}`
        await executaQuery(query)
    },

     /**
     * 
     * @param {String} tabela 
     * @param {String} array 
     * @param {String | Number} valor 
     */
    buscaPorValorEmArray : async (tabela, valor, array) => {
        valor = isNaN(valor) ? `'${valor}'` : valor
        let query = `select id_${tabela} from ${tabela} where ${valor} = any (${array})`
        return await executaQuery(query)
    },

    /**
     * 
     * @param {String} tabela 
     * @param {Number[]} array 
     * @param {String} chave 
     */
    buscaComBaseEmArray : async (tabela, array, chave) => {
        let parsed_array = `'{${array.join()}}'`
        let query = `select * from ${tabela} where ${chave} = any(${parsed_array})`;
        return (await executaQuery(query)).rows
    }
})

module.exports = {arrays}