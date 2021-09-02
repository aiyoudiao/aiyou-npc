/**
 * 需求：
 * 1. 将多个文件的名称写入到一个文件中
 * 思路：
 * 2. 读取指定文件夹下所有文件，将文件名全部作为内容写入到指定文件中
 * 注意事项：
 * 3. 文件名前十位是序号，记得分割一下
 * 4. 对分组的文件进行重组
 */

const fs = require('fs')
const path = require('path')

/**
 * 
 * @param {string} refactorDir 待重组的目录
 * @param {string} newFilePath 要生成的文件路径
 * @param {function(dirName)} runing 运行中时监听的事件函数
 * @param {function(totalSeconds)} ending 结束时监听的事件函数
 */
module.exports = function (refactorDir, newFilePath, runing, ending, runingError) {

    try {
        concat.apply(null, [refactorDir, newFilePath, runing, ending])
    } catch (error) {
        runingError(error)
    }
}

function concat(refactorDir, newFilePath, runing, ending) {

    if (!fs.existsSync(refactorDir)) {
        throw new Error('该目录不存在，请检查后重试');
    }

    if (!fs.existsSync(path.dirname(newFilePath))) {

        fs.mkdirSync(path.dirname(newFilePath))
    }

    let startNow = Date.now()
    let endNow = null

    let fw = fs.createWriteStream(newFilePath);

    fs.readdir(refactorDir, (err, dirs) => {
        if (err) {
            return
        }
        const buffers = []
        let i = 0
        for (let dir of dirs) {
            i ++
            readFileByGroup(dir, buffers, i)
        }
        const chunk = Buffer.concat(buffers)
        fw.write(chunk, err => {
            if (err) {
                throw new Error(err)
                console.log('err', err)
            }
        })

        // console.log('耗时：', (endNow - startNow) / 1000, '秒')
        ending(i, (endNow - startNow) / 1000, '重组碎片文件，耗时：' + ((endNow - startNow) / 1000) + '秒')
    })

    function readFileByGroup(dir, buffers, index) {
        let files = fs.readdirSync(path.join(refactorDir, './' + dir))
        for (let file of files) {
            // console.log(file.slice(0, 11))
            file = file.slice(11)
            file = Buffer.from(file, 'hex')
            buffers.push(file)
        }
        runing(index, dir, '当前正在组装第' + index + '个分组目录' + dir)
        endNow = Date.now()
    }

}


