/**
 * 读取一个压缩包，将压缩包转换成二进制后，然后转成buffer，最后转成base64码，之后切割base64码，最终转成n个文件。
 * 2020-01-07 02:23 每2000个文件进行一次分组
 */

 const fs = require('fs');
 const path = require('path')

/**
 * 分割文件
 * @param {string} fileName 文件路径
 * @param {string} saveDir 输出的目录
 * @param {function(index, dirName)} runing 运行中时监听的事件函数
 * @param {function(index, totalSeconds)} ending 结束时监听的事件函数
 */
 module.exports = function (fileName, saveDir, runing, ending, runingError) {
    try {
      // split.apply(...arguments)
      split.apply(null, [fileName, saveDir, runing, ending])
    } catch (error) {
      runingError(error)
    }
 }
 
 function split (fileName, saveDir, runing, ending) {

    if (!fs.existsSync(fileName.trim())) {
        console.log('fileName', fileName)
        throw new Error('主文件不存在，请检查后重试');
      }

    //   if (saveDir.lastIndexOf('/') === saveDir.length - 1) {
    //     saveDir = saveDir + '/'
    //   }
      
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir)
      }
      
      let fr = fs.createReadStream(fileName);
      
      let index = 0;
      let buffers = []
      let startNow = Date.now()
      let endNow = null
      let dirName = ''
      fr.on('data', chunk => {
        const str = Buffer.concat([chunk]).toString("hex")
        dirName = everyWrite(dirName , str)
        // console.log('已写入' + index + '个文件，当前分组为：' + dirName)
        runing(index, dirName, '已写入' + index + '个文件，当前分组为：' + dirName)
      })
      
      fr.on('end', () => {
        fr.close();
        endNow = Date.now()
        // console.log('end, all count', index, '耗时：', (endNow - startNow) / 1000, '秒')
        ending(index, (endNow - startNow) / 1000, 'end, all count  ' + index + ' 耗时：' + ((endNow - startNow) / 1000) + '秒')
      })
      
      let i = 0;
      function getGroupToDir () {
        i ++;
        const subDir = './dir'+ i.toString().padStart(10, 0) + '-dir/'
      
        if (!fs.existsSync(path.join(saveDir,subDir))) {
          fs.mkdirSync(path.join(saveDir,subDir))
        }
      
        return subDir
      }
      
      function repeateWrite(pathName) {
        try {
          fs.writeFileSync(pathName, "")
        } catch (error) {
          console.log(error)
        }
      }
      
      function everyWrite (subDir, content ) {
        const region = 255 - 10 - 1 /* 猜测它是255 */
        for (let i = 0; i < content.length; i += region) {
          const temp = content.slice(i, i + region)
          index++;
          const tempFilePrexfix = index.toString().padStart(10, 0) + '-'
          const newSplitFileName = temp
          
          try {
            if (index % 2000 === 1) {
              subDir = getGroupToDir()
            }
            repeateWrite(path.join(saveDir , path.join(subDir, tempFilePrexfix + newSplitFileName)))
          } catch (error) {
            console.error(error)
          }
        }
        return subDir 
      }
      
 }
 