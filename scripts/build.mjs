import { rollup } from 'rollup';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

async function build() {
  const configUrl = pathToFileURL(path.join(root, 'rollup.config.mjs')).href;
  const config = (await import(configUrl)).default;
  const bundle = await rollup({
    input: config.input,
    external: config.external,
    plugins: config.plugins,
  });
  await bundle.write(config.output);
  await bundle.close();
  // Copy assets
  const dist = path.join(root, 'dist');
  fs.copyFileSync(path.join(root, 'plugin.json'), path.join(dist, 'plugin.json'));
  const imgSrc = path.join(root, 'img');
  const imgDest = path.join(dist, 'img');
  if (fs.existsSync(imgSrc)) {
    fs.mkdirSync(imgDest, { recursive: true });
    for (const f of fs.readdirSync(imgSrc)) {
      fs.copyFileSync(path.join(imgSrc, f), path.join(imgDest, f));
    }
  }
  console.log('Build completed successfully. Plugin files are in the dist/ directory.');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
