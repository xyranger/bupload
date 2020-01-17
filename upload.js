const config = require("./config");
async function upload(page, count) {
    return new Promise(async (resolve) => {
        // 上传文件
        const inputFileSelector = 'input[name="buploader"]';
        await page.waitForSelector(inputFileSelector);
        const inputFile = await page.$(inputFileSelector);
        await inputFile.uploadFile(config.fileName);
        console.log(`第${count + 1}次执行上传文件...`, new Date());
        await page.waitForSelector(".item-upload-progress-loading");
        // 获取上传进度条总长度
        const boxElement = await page.$('.item-upload-info');
        const boxModel = await boxElement.boxModel();
        const uploadInterval = setInterval(async () => {
            // 获取已上传进度条长度
            const progress = await page.$('.item-upload-progress-loading');
            const progressBox = await progress.boxModel();
            console.log('上传进度：', progressBox.width / boxModel.width)
            // 上传10%时停止上传
            if (progressBox.width / boxModel.width >= config.process / 100) {
                clearInterval(uploadInterval);
                // 点击删除
                await page.$eval('div.item-status-wrp > div > span:nth-child(2)', el => el.click());
                // 点击确认
                await page.$eval('div.item-status-wrp > div > div > div.op-alert-v2-op > span.op-alert-v2-op-confirm', el => el.click());
                console.log(`已上传${config.process}%，停止上传，${config.minute}分钟之后执行上传操作...`)
                resolve(count + 1);
            }
        }, 1000)
    })
}

module.exports = {
    start: upload
}