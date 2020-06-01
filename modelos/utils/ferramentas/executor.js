const {Client} = require('pg')
const {databaseOptions} = require("../../../config")

const db = new Client(databaseOptions)

db.connect()

/**
 * @param {String} query query a ser realizado
 * @returns {{rowCount : Number, rows : Object[]}} resposta à requisição
 */
const executaQuery = async query => {
    
    //console.log(query);
    let promise = new Promise(
        (solve, reject) => {              
            db.query(query, (erro, resposta) => {
                if(erro) reject(erro)
                else solve(resposta)
            } )
        }
    )
    try {
        const resposta = await promise;
        return resposta;
    }
    catch (e) {
        throw e
    }

}

module.exports = {executaQuery}