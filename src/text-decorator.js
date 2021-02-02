const chalk = require('chalk');

function lineSplit(wordList, wordDecorator = word => word, len = 63) {
  const result = [];
  let wordPerLine = [], charCount = 0;

  wordList.forEach(word => {
    charCount += word.length + 3;
    word = wordDecorator(word)
    if (charCount < len) {
      wordPerLine.push(word);
    } else {
      result.push(wordPerLine.join(' '));
      wordPerLine = [];
      wordPerLine.push(word);
      charCount = 0;
    }
  });
  result.push(wordPerLine.join(' '));
  return result;
}

function generateDecoratedTranslation(translation) {
  const { word, soundmark, definition } = translation;

  let content = '';

  content += chalk.hex('#effb8d').bold(word) + ' ' + chalk.hex('#dd2e2b').bold(soundmark) + '\n\n'

  // console.log(chalk.hex('#effb8d').bold(word), chalk.hex('#dd2e2b').bold(soundmark))

  const padding = new Array(9).join(' ');
  const lineBreakToken = '\n' + padding;

  Object.keys(definition).forEach(key => {
    content += ` -${key}\n`;
    // console.log(`\n-${key}`)
    definition[key].forEach((v, index) => {
      const { meanning, example, synonyms } = v;

      const meanningLineSplit = lineSplit(meanning.split(' '), word => chalk.hex('#2eb52d')(word)).join(lineBreakToken);
      const exampleLineSplit = lineSplit(example.split(' ')).join(lineBreakToken);
      const synonymsLineSplit = lineSplit(synonyms, word => chalk.hex('#effb8d').bold.underline(`'${word}'`), 48).join(lineBreakToken);

      content += `      ${index + 1}.${meanningLineSplit}\n\n`
      
      if (exampleLineSplit != '') {
        content += padding + exampleLineSplit + '.\n\n';
      }

      if (synonymsLineSplit != '') {
        content += padding + synonymsLineSplit + '\n\n'
      }
      // console.log(`    ${index + 1}.${meanningLineSplit}`)
      // console.log(padding + exampleLineSplit)
      // console.log(padding + synonymsLineSplit)
    })
    // console.log('\n')
  })

  return content;
}

module.exports = generateDecoratedTranslation;