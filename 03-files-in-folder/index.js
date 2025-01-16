const path = require('path');
const fs = require('fs');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('Error', err);
    return;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretFolderPath, file.name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log('Error', err);
          return;
        }

        const fileExtension = path.extname(file.name).slice(1);
        const fileSizeInKb = (stats.size / 1024).toFixed(3);

        console.log(`${file.name} - ${fileExtension} - ${fileSizeInKb + 'kb'}`);
      });
    }
  });
});
