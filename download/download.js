import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';
import {sleep} from '../util';
import request from 'request';
import PostModel from '../models/post.js';
import {Transform  } from 'stream';

let url1='http://60.xtu.edu.cn/upload/20171209/201712091409003548.mp4'
let url2='https://scontent-lax3-1.cdninstagram.com/vp/b9bea99ea571e51293a3adba5a80f212/5BB3196A/t50.2886-16/42582762_172485216975973_5519516507073150976_n.mp4'
let maxChunkLen= 20 * 1024 * 1024;//10M;

const temp=path.join(__dirname,'../temp/');

const get=async ({url,opt={}})=>{
  let baseOpt={
    url,
    proxy: {host: '127.0.0.1', port: 1080}
  };
  Object.assign(baseOpt,opt)
  //let rq=request.defaults({proxy: 'http://127.0.0.1:8899'})
  return await new Promise((resolve,reject)=>{
    request.get(baseOpt).on('response',resolve).on('error',reject);
  })
}

const existFile=(url,dirname)=>{
  let extname=path.extname(url);
  let filename=path.join(__dirname,`../statics/${dirname}/${dirname}${extname}`);
  return {isExist:fs.existsSync(filename),filename};
}

const baseDownloadVideo=async(total , max, filename, url)=>{
  if(total <= max){//直接下载,不分段
    let writeStream = fs.createWriteStream(filename);
    let opt={
      headers:{Ranges: `bytes=0 - ${total}}`}
    };
    let res=await get({url,opt});
    res.pipe(writeStream)
  }else{//分段下载
    let n=Math.ceil(total/max);


    let writeStream= fs.createWriteStream(filename);
    for(let i=0;i<n;i++){
      let opt={headers: { Range: `bytes= ${i*max} - ${(i+1)*max}`},Connection:'keep-alive' };
      let resStream=await get({url,opt,type:'data'});
      if(resStream){
        ds.push(resStream)
      }else{
        ds.push(null)
      }
    }
    ds.pipe(writeStream)
  }
}

const downloadImg=async(imgUrl,dirname)=>{
    let i=1;

    let {isExist,filename}=existFile(imgUrl,dirname)
    if(isExist)return ;
    let writeStream = fs.createWriteStream(filename);
    try{
      await new Promise((resolve,reject)=>{
        request.get({url: imgUrl,proxy: {host: '127.0.0.1', port: 1080}})
          .on('end',resolve)
          .on('error',reject)
          .pipe(writeStream)
        console.log('下载图片成功：', imgUrl)
      }).catch(e=>console.log('下载图片失败---',e))
    }catch(e){
      console.log(e)
      if(i<3){
        downloadImg(imgUrl,dirname);
        i++;
      }
    }
};

const downloadVideo=async (videoUrl, dirname)=>{
  let {isExist,filename}=existFile(videoUrl,dirname);
  if(isExist)return ;

  try{
    let {headers}=await get({url:videoUrl});
    let contentLength=headers['content-length']
    await baseDownloadVideo(contentLength , maxChunkLen, filename, videoUrl)
    console.log('下载视频成功：', videoUrl, filename)
  }catch(e){
    console.log(e)
  }
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
  }while(tempList.length>0);
  console.log('全部下载完成')
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






