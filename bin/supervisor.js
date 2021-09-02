const SplitVisitor = require('./visitor/split.visitor')
const ConcatVisitor = require('./visitor/concat.visitor')

const list = [
    SplitVisitor,
    ConcatVisitor
]

module.exports = function (context) {
    list.forEach(Visitor => {
        new Visitor(context).accept()
    })
}