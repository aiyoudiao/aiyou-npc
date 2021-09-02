#!/usr/bin/env node

const Commander = require('commander');
const program = new Commander.Command();
const chalk = require('chalk');
const boxen = require('boxen')
const inquirer = require('inquirer');
const version = require('../package').version;

const out = require('./common/output').out;

const loading = require('./common/loading').init;
const supervisor = require('./supervisor')
const loadingOperator = require('./proxy/loading').loadingOperator

new class AiYouCLI {

    constructor() {
        this.program = program
        this.chalk = chalk
        this.boxen = boxen
        this.inquirer = inquirer
        this.version = version
        this.out = out
        this.loading = loading

        this.init();

    }

    init() {
        this.initCommand();
        this.initEvents();

        if (process.argv.length === 2) {

            setTimeout(() => {
                let help = program.helpInformation()
                help = chalk.green(`${help}`)
                // help = boxen(help, {
                //     borderColor: "#800080", borderStyle: {
                //         topLeft: '★',
                //         topRight: '★',
                //         bottomLeft: '★',
                //         bottomRight: '★',
                //         horizontal: '$',
                //         vertical: '★'
                //     }
                //     , padding: 1 })
                console.log(help)
            }, 160);
            out('aiyou-npc');
        } else {
            program.parse(process.argv);
        }

        // console.log(process.argv)

    }

    initCommand() {
        this.initHelp();
        this.initUsage();
        this.initVersion();
        this.initCommandVisitor()
    }

    initEvents() {
        program.on('command:*', function () {
            console.error(
                '请检查命令: %s 有效性\n使用 --help 查看所有的有效命令。',
                program.args.join(' ')
            );
            process.exit(1);
        });
    }

    getCode({ currentUrl, targetPath, option }) {
        let status = 'loading';

        loading(() => {
            if (status === 'loading') {
                status = 'no';
                aiyouDG
                    .get({
                        currentUrl,
                        targetPath,
                        option
                    })
                    .then(function () {
                        status = 'yes';
                    })
                    .catch(err => {
                        err && console.log('\r\n', err);
                        status = 'bad';
                    });
            }

            switch (status) {
                case 'yes':
                    return 'yes';
                case 'bad':
                    return 'bad';
                default:
                    return false;
            }
        }, 'aiyou-npc');
    }

    // #region 初始化命令 区域 Code Module
    initHelp() {
        program.helpOption('-h, --help', '显示aiyou-npc帮助文档');
        program.on('--help', () => {
            // console.log ('调用了--help');
        });
    }

    initUsage() {
        program.name('npc').usage('<command> [options]');
    }

    initVersion() {
        program.version(
            'aiyou-npc：' + (version || '1.0.0'),
            '-v, --version',
            '打印aiyou-npc版本号'
        );
    }

    initCommandVisitor() {
        supervisor(this)
    }

    initLoading() {
        loadingOperator.setStatus('loading')


        loading(() => {
            if (loadingOperator.getStatus() === 'loading') {

                loadingOperator.setStatus('no')

            }

            switch (loadingOperator.getStatus()) {
                case 'yes': {
                    return 'yes';
                }

                case 'bad':
                    return 'bad';
                default:
                    return false;
            }
        }, 'aiyou-npc');
    }

}();