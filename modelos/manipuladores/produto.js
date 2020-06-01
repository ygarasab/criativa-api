const {insercao, manipulacao} = require("../utils")

const utils = {
    ...insercao(),
    ...manipulacao()
}

module.exports = {

    /**
     * @param {Object} subproduto
     * @param {Number} subproduto.razao
     * @param {Number} subproduto.id_produto_pai
     * @param {Number} subproduto.id_produto_filho
     */
    novoSubproduto : async subproduto => await utils.insere(subproduto, 'subproduto')

}