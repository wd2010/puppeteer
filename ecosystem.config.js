module.exports = {
  apps : [{
    name: 'spider-instagram-post',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    //args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    /*env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }*/
    ignore_watch : [  // 从监控目录中排除
      "node_modules",
      "temp",
      "statics",
    ],
  }],

  /*deploy : {
    production : {
      user : 'wd2010',
      host : '176.122.144.208',
      ref  : 'origin/master',
      repo : 'https://github.com/wd2010/puppeteer.gitt',
      path : '/var/www/spider',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }*/
};
