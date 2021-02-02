const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const ioHook = require('iohook');

const audioDownloader = require('./audio-download');

const generateDecoratedTranslation = require('./text-decorator');

const googleTranslator = require('./translator');


const word = process.argv[2];

audioDownloader(word).then(() => {
  const audioPath = path.join(__dirname, '../sound', word + '.mp3');
  child_process.spawn(`ffplay -nodisp -loglevel quiet -autoexit -t 10 ${audioPath}`, { stdio: 'ignore', shell: true })
  ioHook.on("keydown", event => {
    if (event.keycode == 56) {
      child_process.spawn(`ffplay -nodisp -loglevel quiet -autoexit -t 10 ${audioPath}`, { stdio: 'ignore', shell: true })
    }
  });
  ioHook.start();
  process.stdout.write('\033c');
}).catch(console.log)

async function main() {
  const translation = await googleTranslator(word);
  const content = generateDecoratedTranslation(translation);
  fs.writeFile('t', content, () => {
    const less = child_process.spawn(`less -R t`, {stdio: 'inherit', shell: true })
    less.on('exit', () => {
      process.stdout.write('\033c');
      process.exit(0);
    });
  });
}

main()