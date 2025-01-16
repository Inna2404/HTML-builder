const { stdout, stdin } = process;
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write('Please enter your name(For exit enter - exit or Ctrl+C:\n');

stdin.on('data', (data) => {
  const input = data.toString();

  writeStream.write(`${input}\n`);
  stdout.write('The text is written. Continue enter text  or enter exit ');
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  process.exit();
});
