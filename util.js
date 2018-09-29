import chalk from 'chalk';

export const showProcess=(current,total)=>{
  let precent=parseInt(current/total*100,10);
  console.log(chalk.green(`已经完成${precent}%`))
}

export const sleep=(ms)=>{
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};
