module.exports = class Visitor {
    constructor(context) {
        this.context = context
        this.program = context.program
        this.chalk = context.chalk
        this.boxen = context.boxen
        this.inquirer = context.inquirer
        this.version = context.version
        this.out = context.out
        this.loading = context.loading
    }
}