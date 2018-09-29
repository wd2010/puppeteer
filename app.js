import cp from 'child_process';
import fs from 'fs';
import path from 'path';
import stream from 'stream';
import url from 'url'
import jsonfile from 'jsonfile';

const spider=cp.fork('./spider/index.js');
const download=cp.fork('./download/index.js')

let start=true
spider.on('message', data=>{
  console.log(data)
  let filename=url.parse(data.url).pathname.split('/')[2];
  jsonfile.writeFileSync(path.join(__dirname,`temp/${filename}.json`),data);
  download.send(filename)
})


