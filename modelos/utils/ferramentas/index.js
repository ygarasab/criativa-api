const executor = require("./executor")
const parser = require("./parser")

module.exports = {
    ...executor,
    ...parser
}