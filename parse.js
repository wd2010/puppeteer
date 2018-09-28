
export const parseArticle=async (page)=>{
  let CLASS='.M9sTE.L_LMM.JyscU';

  let article=await page.evaluate((e)=>{
    let articleNode=document.querySelector(e);
    let img=articleNode.childNodes[1].querySelector('img').src;

    let videoNode=articleNode.childNodes[1].querySelector('video');

    let video=videoNode && videoNode.src;


    let _likes=articleNode.childNodes[2].querySelector('.EDfFK.ygqzn').textContent;
    let likes=parseInt(_likes.replace(' 次赞','').replace(',',''),10);

    let content=articleNode.querySelector('.k59kT').childNodes[0].textContent.trim();
    let create_time=articleNode.querySelector('.c-Yi7').children[0].getAttribute('datetime')
    let obj={img, video ,likes,content, create_time, hasDown: false}
    return obj
  }, CLASS).catch(err=>console.log(err));
  return article
}

export const queryUrl=async(page,type)=>{
  let CLASS=type?'.HBoOv.coreSpriteRightPaginationArrow':'.v1Nh3.kIKUG._bz0w';
  if(type){
    return await page.evaluate((e)=>document.querySelector('.HBoOv.coreSpriteRightPaginationArrow').href,CLASS)
  }else{
    return await page.evaluate((e)=>document.querySelectorAll(e)[0].querySelector('a').href,CLASS)
  }
}