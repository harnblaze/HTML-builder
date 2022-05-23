const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdout.write('Приветствую тебя! Что нового?\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  }
  output.write(chunk);
});

const exitProcess = () => stdout.write('Удачи! Еще увидимся!\n');
process.on('exit', exitProcess);
process.on('SIGINT', exitProcess);
