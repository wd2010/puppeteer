import puppeteer from 'puppeteer';
import path from 'path';
const pathToExtension = path.join(__dirname, './chrome/chrome.exe');
import {parseArticle, queryUrl} from './parse';
import postModel from './models/post';
require('./db/index');
let url='https://www.instagram.com/puppy_lovings';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: pathToExtension,
    headless: false,
    args: [ '--proxy-server=127.0.0.1:1080' ]
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1000,height: 1000})
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitFor(2500);
  
  await page.click('.v1Nh3.kIKUG._bz0w')
  await page.waitFor(2500);
  let postUrl=await queryUrl(page,0);

  let NEXT_CLASS='.HBoOv.coreSpriteRightPaginationArrow'
  let nextNode=await page.$(NEXT_CLASS);
  do{
    let article=await parseArticle(page);
    article.post_url=postUrl;
    await postModel(article).save();

    postUrl=await queryUrl(page,1);

    await page.click(NEXT_CLASS);
    await page.waitFor(1000);

    console.log('00000',postUrl)
    nextNode=await page.$(NEXT_CLASS);
  }while(nextNode)





  //await browser.close();

})();