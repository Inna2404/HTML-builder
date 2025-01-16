const path = require('path');
const fs = require('fs');
const filesPath = path.join(__dirname, 'files');
const fileCopyPath = path.join(__dirname, 'files-copy');

fs.mkdir(fileCopyPath, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  fs.readdir(filesPath, (err, files) => {
    if (err) {
      console.log('Error', err);
      return;
    }
    files.forEach((file) => {
      const originalFilePath = path.join(filesPath, file);
      const copyFilePath = path.join(fileCopyPath, file);

      fs.copyFile(originalFilePath, copyFilePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});
