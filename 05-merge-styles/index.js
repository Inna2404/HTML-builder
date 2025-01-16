const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const boundlePath = path.join(__dirname, 'project-dist', 'boundle.css');
const folderPath = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(boundlePath);

fsPromises.readdir(folderPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(folderPath, file.name);

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        writeStream.write(data + '\n');
      });
    }
  });
});
