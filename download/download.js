import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';

const temp=path.join(__dirname,'../temp');
const staticDir=path.join(__dirname,'../static');



const downloadImg=(imgUrl)=>{
  console.log(imgUrl)
}
const downloadVideo=(videoUrl)=>{
  console.log(videoUrl)
}

const downloadMain=()=>{
  let tempList=[];
  do{
    tempList=fs.readdirSync(temp);

    tempList.forEach( async file=>{
      let {img,video}=jsonfile.readFileSync(file);
      await downloadImg(img);
      video && (await downloadVideo(video))
      fs.unlinkSync(file);
    });
  }while(tempList.length>0)
}


let start=true;

process.on('message',dirname=>{
  console.log('-------',dirname)
  fs.mkdirSync(path.join(staticDir,dirname));
  if(start){
    downloadMain()
    start=false;
  }
})






