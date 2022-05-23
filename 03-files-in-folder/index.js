const fs = require('fs');
const path = require('path');
const pathName = path.resolve(__dirname, 'secret-folder');
fs.readdir(pathName, (err, files) => {
  if (err) return console.log(err.message);
  files.forEach((file) => {
    const { name, ext } = path.parse(path.resolve(pathName, file));
    fs.stat(path.resolve(pathName, file), (err, stats) => {
      if (err) return console.log(err.message);
      if (stats.isFile()) {
        console.log(`${name} - ${ext.slice(1)} - ${stats.size}bytes`);
      }
    });
  });
});
