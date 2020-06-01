const {busca, selecao} = require("../utils")

const utils = {
    ...busca(),
    ...selecao()
}

module.exports = {
    
    carregaProduto : async id_produto => {
        let colunas = ['produto.*', 'nome_marca', 'nome_fornecedor']
        let joins = [{tabela:'marca', chave:'id_marca'}, {tabela:'fornecedor', chave:'id_fornecedor'}]
        return (await utils.selecionaColunasDaTabelaComJoin(colunas, 'produto', joins, {id_produto}))[0]
    },

    buscaProduto : async chave => await utils.buscaProduto(chave),

    coletaOpcoes : async () => {
        let colunas = ['id_produto as value', 'nome_produto as text', 'unitario']
        let joins = [{tabela:'medida', chave:'id_medida'}]
        return await utils.selecionaColunasComJoinOrdenandoPorColuna(colunas, 'produto', joins, false,'text')
    },

    carregaProdutoParaVenda : async codigo => {
        
        let colunas = ['codigo', 'id_produto', 'nome_produto', 'estoque', 'valor_produto', 'nome_medida', 'unitario']
        let joins = [{tabela:'medida', chave:'id_medida'}]
        let resposta = (await utils.selecionaColunasDaTabelaComJoin(colunas, 'produto', joins, {codigo}))[0]
        if(resposta===undefined) throw new Error("Código inválido")
        return resposta
            
    },

    carregaSubproduto : async id_subproduto => {
        let subproduto = await utils.pegaItemPeloId('subproduto', id_subproduto)
        let pai = await utils.pegaItemPeloId('produto', subproduto.id_produto_pai)
        let filho = await utils.pegaItemPeloId('produto', subproduto.id_produto_filho)
        return {subproduto, pai, filho}
    },

    listaSubprodutos : async id_produto_pai => {

        let colunas = ['id_produto', 'razao', 'id_subproduto', 'nome_produto']
        let joins = [{tabela:'produto', chave:'id_produto', valor:'id_produto_filho'}]
        return utils.selecionaColunasDaTabelaComJoin(colunas, 'subproduto', joins, {id_produto_pai})

    },

    /**
     * @param {Object} subproduto
     * @param {Number} subproduto.id_produto_pai
     * @param {Number} subproduto.id_produto_filho
     */
    verificaSeSubprodutoExiste : async subproduto => {
        if(await utils.contaOcorrenciasNaTabela('subproduto', {subproduto}) > 0)
            throw new Error("Subproduto já existe!")
    }

}