import cp from 'child_process';

const spider=cp.fork('./spider.js');
const download=cp.fork('./download.js');

