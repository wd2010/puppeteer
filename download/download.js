import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';
import {sleep} from '../util';
import axios from 'axios';

const get=axios.create({
  responseType:'stream',
  proxy:{host: '127.0.0.1',port: 1080,}
})

const temp=path.join(__dirname,'../temp/');

const downloadImg=async(imgUrl,dirname)=>{
    let i=1;
    let extname=path.extname(imgUrl);
    let filename=path.join(__dirname,`../statics/${dirname}/${dirname}${extname}`)
    let writeStream = fs.createWriteStream(filename);
    try{
      console.log('yyy')
      let res=await axios.get(imgUrl, {
        responseType:'stream',
        proxy:{host: '127.0.0.1',port: 1080,}
      })
      //let res=await get(imgUrl);

      console.log('ggg',res)
      res.pipe(writeStream)
    }catch(e){
      console.log(e)
      if(i<3){
        arguments.callee(imgUrl,dirname);
        i++;
      }
    }





}
const downloadVideo=async (videoUrl, dirname)=>{
  await sleep(2000)
  console.log(videoUrl)
}

const downloadMain=async ()=>{
  let tempList=[];
  do{
    tempList=fs.readdirSync(temp);
    console.log(tempList);
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






