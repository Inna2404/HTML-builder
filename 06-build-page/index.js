const path = require('path');
const fs = require('fs');
const { rejects } = require('assert');

const folderProjectPath = path.join(__dirname, 'project-disit');
const indexPath = path.join(folderProjectPath, 'index.html');
const stylePath = path.join(folderProjectPath, 'style.css');

const assetsPath = path.join(__dirname, 'assets');
const copyAssetsPath = path.join(folderProjectPath, 'assets');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

const stylesPath = path.join(__dirname, 'styles');

function copyDirectory(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      }
      files.forEach((file) => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);

        if (file.isDirectory()) {
          copyDirectory(srcPath, destPath);
        } else if (file.isFile()) {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
  });
}

function replaceTemlateTags(templatePath, componentPath, outputPath) {
  fs.readFile(templatePath, 'utf-8', (err, templete) => {
    if (err) throw err;

    const tagRegex = /{{\s*(\w+)\s*}}/g;
    let result = templete;
    const tags = [...templete.matchAll(tagRegex)].map((match) => match[1]);

    const readComponent = tags.map((tag) => {
      const componentPath = path.join(componentsPath, `${tag}.html`);
      return new Promise((resolve, reject) => {
        fs.readFile(componentPath, 'utf-8', (err, data) => {
          if (err) {
            resolve('');
          } else {
            resolve({ tag, content: data });
          }
        });
      });
    });
    Promise.all(readComponent).then((componts) => {
      componts.forEach(({ tag, content }) => {
        const regext = new RegExp(`{{\\s*${tag}\\s*}}`, 'g');
        result = result.replace(regext, content);
      });
      fs.writeFile(outputPath, result, (err) => {
        if (err) throw err;
      });
    });
  });
}

function copyStales(src, dest) {
  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    fs.writeFile(dest, '', (err) => {
      if (err) {
        console.log(err);
        return;
      }
      cssFiles.forEach((file) => {
        const filePath = path.join(src, file.name);
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          fs.appendFile(dest, data + '\n', (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      });
    });
  });
}

fs.mkdir(folderProjectPath, { recursive: true }, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  fs.writeFile(indexPath, '', (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  fs.writeFile(stylePath, '', (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
  copyDirectory(assetsPath, copyAssetsPath);
  replaceTemlateTags(templatePath, componentsPath, indexPath);
  copyStales(stylesPath, stylePath);
});
