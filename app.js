import cp from 'child_process';
import path from 'path';
import url from 'url'
import jsonfile from 'jsonfile';

const spider=cp.fork('./spider/index.js', {execArgv: [ '--inspect='+(process.debugPort+1) ]});
const download=cp.fork('./download/index.js', {execArgv: [ '--inspect='+(process.debugPort+2) ]})

spider.on('message', data=>{

  let filename=url.parse(data.url).pathname.split('/')[2];
  jsonfile.writeFileSync(path.join(__dirname,`temp/${filename}.json`),data);
  download.send(filename)
})


