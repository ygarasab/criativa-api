const {verificadorDeProduto,manipuladorDeProduto} = require("../modelos")
const log = require("./utils/logger").logger("CRTV", "PROD")

const modelo = {
    ...verificadorDeProduto,
    ...manipuladorDeProduto
}


module.exports = {

    get_produto : async id_produto => {
        log.get("Carregando produto " + id_produto)
        return modelo.carregaProduto(id_produto)
    },

    get_produto_venda : async codigo => {
        log.get("Carregando para venda o produto de código " + codigo)
        return modelo.carregaProdutoParaVenda(codigo)
    },

    get_busca : async chave => {
        log.get("Buscando por produto com chave " + chave)
        return modelo.buscaProduto(chave)
    },

    get_options : async tabela => {
        log.get("Coletando opções de " + tabela)
        return modelo.coletaOpcoes()
    },

    get_subproduto : async id_subproduto => {
        log.get("Carregando subproduto " + id_subproduto)
        return modelo.carregaSubproduto(id_subproduto)
    },

    get_lista_subprodutos : async id_produto => {
        log.get("Listando subprodutos de "+id_produto)
        return modelo.listaSubprodutos(id_produto)
    },

    /**
     * @param {Object} dados
     * @param {Number} dados.razao
     * @param {Number} dados.id_produto_pai
     * @param {Number} dados.id_produto_filho
     */
    post_subproduto : async dados => {
        log.post("Criando subproduto")
        if(dados.id_produto_pai == dados.id_produto_filho) throw new Error("Impossível criar relação com dois produtos iguais")
        await modelo.verificaSeSubprodutoExiste({id_produto_pai, id_produto_filho})
        await modelo.novoSubproduto({razao, id_produto_pai, id_produto_filho})
        return log.sucesso("Subproduto criado com sucesso")
    }

}