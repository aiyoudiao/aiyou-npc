/**
 * 需求：
 * 1. 将碎片目录下的文件全部删除，最后将目录删除
 * 
 * 思路：
 * 1. 先读取碎片目录下的内容，
 * 2. 如果目录非空，就先删除目录下的文件，再删除目录。
 * 3. 如果目录为空，直接删除目录
 */

const { clear } = require('console')
const fs = require('fs')
const path = require('path')

/**
 * 
 * @param {string} refactorDir 待重组的目录
 * @param {function(dirName)} runing 运行中时监听的事件函数
 * @param {function(totalSeconds)} ending 结束时监听的事件函数
 */
module.exports = function (refactorDir, runing, ending, runingError) {

    try {
        eat.apply(null, [refactorDir, runing, ending])
    } catch (error) {
        runingError(error)
    }
}

function eat(refactorDir, runing, ending) {

    if (!fs.existsSync(refactorDir)) {
        throw new Error('该目录不存在，请检查后重试');
    }

    let startNow = Date.now()
    let endNow = null

    fs.readdir(refactorDir, (err, dirs) => {
        if (err) {
            return
        }

        let i = 0
        totalTask = dirs.length
        for (let dir of dirs) {
            i++
            eatFileAndGroup(dir, i)
        }

        endNow = Date.now()
        fs.rmdirSync(refactorDir)
        // console.log('耗时：', (endNow - startNow) / 1000, '秒')
        ending(i, (endNow - startNow) / 1000, '删除碎片目录，耗时：' + ((endNow - startNow) / 1000) + '秒')

    })

    function eatFileAndGroup(dir, index) {
        const groupDir = path.join(refactorDir, './' + dir)
        let files = fs.readdirSync(groupDir)
        runing(index, dir, '当前正在删除第' + index + '个分组目录' + groupDir)

        for (let file of files) {
            const filePath = path.join(groupDir, './' + file)
            fs.unlinkSync(filePath)
        }

        fs.rmdirSync(groupDir)
        //  fs.rmdirSync(groupDir, {recursive: true, force: true})
        //  fs.rmdir(groupDir, {recursive: true, force: true}, function (e) {})
    }

}
