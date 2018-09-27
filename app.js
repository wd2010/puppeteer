import puppeteer from 'puppeteer';
import path from 'path';
const pathToExtension = path.join(__dirname, './chrome/chrome.exe');
import {parseArticle} from './parse'
let url='https://www.instagram.com/puppy_lovings';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: pathToExtension,
    headless: false,
    args: [ '--proxy-server=127.0.0.1:1080' ]
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1300,height: 1000})
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitFor(1000);

  
  await page.click('.v1Nh3.kIKUG._bz0w')
  await page.waitFor(1000);

  let article=await parseArticle(page)



  console.log(article)
  //await browser.close();

})();