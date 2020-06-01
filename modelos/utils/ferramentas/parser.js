const sha256 = require("sha256")

/**
 * @param {Object} dados dados to parse
 * @param {String | Number | Number[]} dados.*
 * @returns {String} string para inserção
 */
const parseDadosParaInsert = dados =>{
    
    let colunas = []
    let valores = []
    for(let key in dados){
        colunas.push(key)
        if(typeof dados[key] == 'object' && typeof dados[key][0] != 'number')
            dados[key] = dados[key].map(item => `"${item}"`)          
        
        let valor = key == "senha" 
        ? `'${sha256(dados[key])}'`      
        : typeof dados[key] == 'object'
        ? `'{${dados[key].join()}}'`
        :  `'${dados[key]}'`
        valores.push(valor)
    }
    return `(${colunas.join()}) values (${valores.join()})`

}

/** 
 * @param {Object} dados dados to parse
 * @param {String | Number} dados.*
 * @returns {String[]} lista de strings com igualdades
 */
const juntaDadosEmIgualdade = dados => {

    let elementos = []

    for(let key in dados){
        if(typeof dados[key] == 'object' && typeof dados[key][0] != 'number')
            dados[key] = dados[key].map(item => `"${item}"`)    
        let sent = key == 'senha'
        ? `senha = '${sha256(dados[key])}'`
        : dados[key] == null
        ? `${key} = NULL`
        : typeof dados[key] == 'object'
        ? `${key} = '{${dados[key].join()}}'`
        : `${key} = '${dados[key]}'`
        elementos.push(sent)
    }
    return elementos
}


    /**
 * @param {Object} dados dados to parse
 * @param {String | Number} dados.*
 * @returns {String} string para condição
 */
const parseDadosParaWhere = dados => {

    let elementos = juntaDadosEmIgualdade(dados)
    return elementos.join(" and ")

}

    /**
 * @param {Object} dados dados to parse
 * @param {String | Number} dados.*
 * @returns {String} string para update
 */
const parseDadosParaUpdate = dados => {
    
    let elementos = juntaDadosEmIgualdade(dados)
    return elementos.join()

}

/**
 * 
 * @param {Object} join
 * @param {String} join.tabela
 * @param {String} join.chave
 * @param {String} join.valor
 */
const parseJoin = join =>

    join.valor === undefined
    ? `join ${join.tabela} using(${join.chave})`
    : `join ${join.tabela} on ${join.chave} = ${join.valor}`



/**
 * 
 * @param {Object[]} joins 
 * @param {String} joins[].tabela
 * @param {String} joins[].chave
 * @param {String} joins[].valor
 */
const parseJoins = joins => {

    let sentenca = []
    for(let join of joins) sentenca.push(parseJoin(join))
    return sentenca.join(" ")


}


module.exports = {
    parseDadosParaInsert,
    parseDadosParaUpdate,
    parseDadosParaWhere,
    parseJoins
}