const puppeteer = require('puppeteer');
const config = require("./config");
const upload = require('./upload');

// 执行次数
let count = 0;

(async () => {
    const uploadUrl = "https://member.bilibili.com/video/upload.html";
    const browser = await puppeteer.launch({ headless: config.headless });
    const page = await browser.newPage();
    console.log('打开Chromium...');
    await page.setCookie(...config.cookies);
    console.log('传入Cookie...');
    await page.goto(uploadUrl);
    console.log('打开上传页面...');
    count = await upload.start(page, count);
    setInterval(async () => {
        count = await upload.start(page, count);
    }, config.minute * 1000 * 60);
})();

process.on('exit', () => {
    console.log(`运行结束,已上传${count}次`);
});
