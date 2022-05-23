const fs = require('fs');
const path = require('path');
const {
  readdir,
  mkdir,
  readFile,
  writeFile,
  rm,
  copyFile,
} = require('fs/promises');

const outputPath = path.resolve(__dirname, 'project-dist');

async function createBundleHtml(sourcePath, outputPath) {
  try {
    await rm(outputPath, { recursive: true, force: true });
    await mkdir(outputPath, { recursive: true });
    let html = await readFile(path.resolve(__dirname, 'template.html'), 'utf8');
    const filesHtml = await readdir(sourcePath);
    for (const fileHtml of filesHtml) {
      const { name, ext } = path.parse(path.resolve(sourcePath, fileHtml));
      if (ext === '.html') {
        const component = await readFile(
          path.resolve(sourcePath, fileHtml),
          'utf8',
        );
        html = html.replace(`{{${name}}}`, component);
      }
      await writeFile(path.join(outputPath, '/index.html'), html, 'utf8');
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function createBundleCss(sourcePath, outputPath) {
  const outputStream = fs.createWriteStream(
    path.resolve(outputPath, 'style.css'),
  );

  try {
    const filesCss = await readdir(sourcePath);

    filesCss.forEach((css) => {
      const { ext } = path.parse(path.resolve(sourcePath, css));
      if (ext === '.css') {
        const readStream = fs.createReadStream(
          path.resolve(path.resolve(sourcePath, css)),
          'utf-8',
        );
        readStream.on('data', (chunk) => outputStream.write(chunk));
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function copyDir(sourcePath, outputPath) {
  try {
    await rm(outputPath, { recursive: true, force: true });
    await mkdir(outputPath, { recursive: true });
    const files = await readdir(sourcePath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(
          path.resolve(sourcePath, file.name),
          path.join(outputPath, file.name),
        );
      } else if (file.isDirectory()) {
        await mkdir(path.join(outputPath, file.name));
        await copyDir(
          path.join(sourcePath, file.name),
          path.join(outputPath, file.name),
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function createBundle() {
  await createBundleHtml(path.resolve(__dirname, 'components'), outputPath);
  await createBundleCss(path.resolve(__dirname, 'styles'), outputPath);
  await copyDir(
    path.resolve(__dirname, 'assets'),
    path.resolve(outputPath, 'assets'),
  );
}

createBundle();
