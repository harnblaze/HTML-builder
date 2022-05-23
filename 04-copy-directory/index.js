const copyDir = () => {
  const fs = require('fs');
  const path = require('path');

  const nameOfFolder = path.resolve(__dirname, 'files');
  const nameOfCopyFolder = path.resolve(__dirname, 'files-copy');

  fs.rm(nameOfCopyFolder, { recursive: true, force: true }, (err) => {
    if (err) return console.log(err.message);
    fs.mkdir(nameOfCopyFolder, { recursive: true }, (err) => {
      if (err) return console.log(err.message);

      fs.readdir(nameOfFolder, (err, files) => {
        if (err) return console.log(err.message);

        files.forEach((file) => {
          const readStream = fs.createReadStream(
            path.resolve(path.resolve(nameOfFolder, file)),
            'utf-8',
          );

          const writeStream = fs.createWriteStream(
            path.resolve(nameOfCopyFolder, file),
          );

          readStream.on('data', (chunk) => writeStream.write(chunk));
        });
      });
    });
  });
};

copyDir();
