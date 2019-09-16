const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const fs = require("fs-extra");
const path = require("path");
const hbs = require("handlebars");
const chromium = require('chrome-aws-lambda');

app.use(express.static(__dirname + '/templates'));
app.listen(3000);

(async function(){
    try{
        const browser = await chromium.puppeteer.launch();
        const page = await browser.newPage();

        const filePath = path.join(process.cwd(),'templates','cook.html')
        const html = await fs.readFile(filePath,'utf-8')
       // const content = hbs.compile(html);
        //console.log(html)

        await page.setContent(html);
        await page.emulateMedia('screen');
        await page.pdf({
            path:'myPdf.pdf',
            format:'A4',
            printBackground:true
        });

        console.log('done');
        await browser.close();
    

    }catch(e){
        console.log('error:',e);
    }
})();

app.get('/converted',(req,res)=>{
 res.sendFile('myPdf.pdf',{root: __dirname})
})