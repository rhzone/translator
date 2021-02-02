const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function Translation(word, soundmark) {
  this.word = word;
  this.soundmark = soundmark;
  this.definition = {};
}

async function googleTranslator(word) {
  const res = await axios.get(`https://www.google.com/search?q=define+${word}&num=1&cad=h&hl=en`, {
    proxy: {
      host: 'localhost',
      port: 1080
    }
  });
  fs.writeFileSync('res.html', res.data);
  const $ = cheerio.load(res.data);
  const soundmark = $('span > .BNeawe').first().text();
  const translation = new Translation(word, soundmark);
  const pos = $('.Ap5OSd > .BNeawe > span.rQMQod').map((i, el) => $(el).text()).get();

  $('.Ap5OSd > ol').each((i, el) => {
    // 词性名称
    const name = pos[i];
    translation.definition[name] = [];
    // 每个li的innerText
    const text = $(el).find('li').map((i, el) => $(el).text()).get();
    text.forEach(liInnerText => {
      liInnerText = liInnerText.split('"');
      translation.definition[name].push({
        meanning: liInnerText[0],
        example: liInnerText[1] || '',
        synonyms: liInnerText[2] && liInnerText[2].split(': ')[1].split(', ') || [],
      });
    })
  });
  return translation;
}

module.exports = googleTranslator;
