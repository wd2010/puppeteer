import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';
import {sleep} from '../util';
import axios from 'axios';
import request from 'request';

let maxChunkLen= 10 * 1024 * 1024;//20M;

const temp=path.join(__dirname,'../temp/');

const downloadImg=async(imgUrl,dirname)=>{
    let i=1;
    let extname=path.extname(imgUrl);
    let filename=path.join(__dirname,`../statics/${dirname}/${dirname}${extname}`)
    let writeStream = fs.createWriteStream(filename);
    try{
      await new Promise((resolve,reject)=>{
        request.get({url: imgUrl+'y',proxy: {host: '127.0.0.1', port: 1080}})
          .on('end',resolve)
          .on('error',reject)
          .pipe(writeStream)
      })

    }catch(e){
      console.log(e)
      if(i<3){
        downloadImg(imgUrl,dirname);
        i++;
      }
    }
};

const downloadVideo=async (videoUrl, dirname)=>{
  await sleep(2000)
  console.log(videoUrl)
}

const downloadMain=async ()=>{
  let tempList=[];
  do{
    tempList=fs.readdirSync(temp);
    let readCount=3;
    while(!tempList.length && readCount>0){
      await sleep(2000);
      tempList=fs.readdirSync(temp);
      readCount--
    }

    for(let i=0;i<tempList.length;i++){
      let file=tempList[i];
      let {img,video}=jsonfile.readFileSync(temp+file);
      let dirname=path.parse(file).name
      await downloadImg(img, dirname);
      video && (await downloadVideo(video, dirname))
      console.log(file,'下载完成')
      fs.unlinkSync(temp+file);
    }
  }while(tempList.length>0)
}


let start=true;
process.on('message',dirname=>{
  try{
    fs.accessSync(`./statics/${dirname}`)
  }catch(e){
    fs.mkdirSync(`./statics/${dirname}`);
  }

  if(start){
    downloadMain()
    start=false;
  }
})






