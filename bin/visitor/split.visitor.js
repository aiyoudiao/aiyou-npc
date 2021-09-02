const Visitor = require('./visitor')
const split = require('../lib/split')

const loadingOperator = require('../proxy/loading').loadingOperator

module.exports = class extends Visitor {



    constructor(context) {
        super(context)
        this.isAction = false
    }

    accept() {

        this.program
            .command('split [filePath] [dirPath]') /* 定义子命令 */
            .alias('s') /* 子命令缩写 */
            .description('分解 指定文件 到指定目录下面') /* 描述 */
            .option('-a,--action <action>') /* 附加参数 */
            .action((filePath, dirPath) => {

                if (!filePath || !dirPath) {
                    return
                }

                this.isAction = true
                this.actionHandler(filePath, dirPath)

            }); /* 回调函数 */

        this.bindEvent()
    }

    actionHandler (filePath, dirPath) {
        
        this.context.initLoading()
        split(filePath, dirPath, function (index, groupName, log) {
            loadingOperator.setRuning(() => log)
        }, function (index, totalSeconds, log) {
            loadingOperator.setStatus('yes')
            loadingOperator.setEnding(() => log)
        }, function (error) {
            loadingOperator.setStatus('bad')
            loadingOperator.setRuningError(() => error)
        })
    }

    bindEvent() {
        // console.log(this.program)
        this.program.on('command:split', this.splitEventHandler.bind(this));
        this.program.on('command:s', this.splitEventHandler.bind(this));
    }

    splitEventHandler() {
        setTimeout(() => {
            if (this.isAction) return

            this.inquirerHandler().then(param => {

                const { filePath, dirPath, isConfirm } = param;

                console.log('param', param)
                if (!isConfirm) {
                    console.log('路径不对，重新开始')
                    return
                }

                this.actionHandler(filePath, dirPath)

            })
                .catch(err => {
                    console.log(err);
                });
        }, 1000);
    }

    inquirerHandler() {
        const config = [
            {
                type: 'input',
                message: '请输入文件路径(必须正确)',
                name: 'filePath',
                validate: val => {
                    // if (val.match(/\d{11}/g)) {
                    //     return true;
                    // }
                    // return '请输入正确的路径';
                    return true;
                }
            },
            {
                type: 'input',
                message: '请输入目录地址(没有就自动创建)',
                name: 'dirPath',
                validate: val => {
                    //   if (val.match (/\d{11}/g)) {
                    //     return true;
                    //   }
                    //   return '请输入正确的路径';
                    return true;
                }
            },
            {
                type: 'confirm',
                message: '请检查文件路径和输出的目录是否正确？',
                name: 'isConfirm'
            },
        ];
        return this.inquirer.prompt(config)
    }

}