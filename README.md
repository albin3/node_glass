### node-glass

部署：  确保安装了node、mongodb、curl
1. 运行script/db-init.js、script/baiduApi.js
2. 拷贝gtpush***.so 到 /usr/local/lib
3. 在LD_LIBRARY_PATH 中增加 /usr/local/lib
4. 重新编译gtpush模块下地个推文件
5. 执行node server.js
6. crontab -e 中增加产生随机数的规则，例如："* 0 * * * /opt/node-v0.10.28-linux-x64/bin/node /opt/www/essilor-server/scripts/regularRandom.js"
