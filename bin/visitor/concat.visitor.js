const Visitor = require('./visitor')
const concat = require('../lib/concat')
const eat = require('../lib/eat')

const loadingOperator = require('../proxy/loading').loadingOperator

module.exports = class extends Visitor {
    constructor(context) {
        super(context)
        this.isAction = false
    }

    accept() {

        this.program
            .command('concat [refactor_dir_path] [new_file_path] [is_delete_refactor_dir]') /* 定义子命令 */
            .alias('c') /* 子命令缩写 */
            .description('重组 有碎片文件的目录 生成指定路径文件') /* 描述 */
            .option('-a,--action <action>') /* 附加参数 */
            .action((concatDirPath, outPutFilePath, isDeleteReactorDir) => {

                if (!concatDirPath || !outPutFilePath) {
                    return
                }

                this.isAction = true

                this.actionHandler(concatDirPath, outPutFilePath, isDeleteReactorDir)
            }); /* 回调函数 */

        this.bindEvent()
    }

    actionHandler(concatDirPath, outPutFilePath, isDeleteReactorDir) {

        this.context.initLoading()

        new Promise((resove, reject) => {
            concat(concatDirPath, outPutFilePath, function (index, groupName, log) {
                loadingOperator.setRuning(() => log)
            }, function (index, totalSeconds, log) {

                resove({ index, totalSeconds, log })

            }, function (error) {
                reject(error)
            })
        }).then((one) => {

            const { index, totalSeconds, log } = one

            // 成功之后删除碎片文件目录
            if ([1, '1', 6, '6', true, 'true', 'yes'].includes(isDeleteReactorDir)) {
                return new Promise((resove, reject) => {
                    eat(concatDirPath,
                        function (eatIndex, eatGroupName, eatLog) {
                            loadingOperator.setRuning(() => eatLog)
                        }, function (eatIndex, eatTotalSeconds, eatLog) {

                            resove({ eatIndex, eatTotalSeconds, eatLog, log })

                        }, function (error) {
                            reject(error)
                        })
                }).then(result => result)
            }

            loadingOperator.setStatus('yes')
            loadingOperator.setEnding(() => log)
        }).then(two => {
            if (!two) {
                return
            }

            const { eatIndex, eatTotalSeconds, eatLog, log } = two
            loadingOperator.setStatus('yes')
            loadingOperator.setEnding(() => log + ' || ' + eatLog)
        }).catch(error => {
            loadingOperator.setStatus('bad')
            loadingOperator.setRuningError(() => error)
        })

    }

    bindEvent() {
        // console.log(this.program)
        this.program.on('command:concat', this.concatEventHandler.bind(this));
        this.program.on('command:c', this.concatEventHandler.bind(this));
    }

    concatEventHandler() {
        setTimeout(() => {

            if (this.isAction) return

            this.inquirerHandler().then(param => {

                const { concatDirPath, outPutFilePath, isConfirm, isDeleteConfirm } = param;

                // console.log('param', param)
                if (!isConfirm) {
                    console.log('路径不对，重新开始')
                    return
                }

                this.actionHandler(concatDirPath, outPutFilePath, isDeleteConfirm)

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
                message: '请输入待重组的目录地址(必须正确)',
                name: 'concatDirPath',
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
                message: '请输入输出文件的路径',
                name: 'outPutFilePath',
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
                message: '请检查待重组的目录地址和输出文件的路径是否正确？',
                name: 'isConfirm'
            },
            {
                type: 'confirm',
                message: '请检查待重组的目录地址和输出文件的路径是否正确？',
                name: 'isDeleteConfirm'
            },
        ];
        return this.inquirer.prompt(config)
    }

}