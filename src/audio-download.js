const fs = require('fs');
const axios = require('axios');

// source: https://stackoverflow.com/questions/55374755/node-js-axios-download-file-stream-and-writefile

module.exports = function audioDownloader(word) {
  const audioPath = `./sound/${word}.mp3`;
  
  return new Promise((resolve, reject) => {
    if (fs.existsSync(audioPath)) {
      return resolve();
    }
    axios({
      method: 'get',
      url: `https://dict.youdao.com/dictvoice?audio=${word}&type=2`,
      responseType: 'stream'
    }).then(res => {
      res.data.pipe(fs.createWriteStream(audioPath));
      resolve();
    }).catch(reject)
  });
}





