const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const mkdirp = require('mkdirp');

const convert = async (cmd) => {
  try {
    const { stdout, stderr } = await exec(cmd);
    return true;
  } catch (err) {
    console.error(`Conversion command failed "${cmd}":n`, err);
  }
  return false;
};

const wav2mp4 = async (source, staticPath) => {
  // ffmpeg -i input.wav -c:a aac -b:a 128k output.m4a
  const dest = staticPath.replace(/\.wav$/, '.m4a');
  const success = convert(`ffmpeg -i ${source} -c:a aac -b:a 128k ${dest}`);
  return success ? dest : null;
};

const wav2ogg = async (source, staticPath) => {
  // ffmpeg -i input.wav -acodec libvorbis output.ogg
  const dest = staticPath.replace(/\.wav$/, '.ogg');
  const success = convert(`ffmpeg -i ${source} -acodec libvorbis ${dest}`);
  return success ? dest : null;
};

const wav2flac = async (source, staticPath) => {
  // sox input.wav output.flac
  const dest = staticPath.replace(/\.wav$/, '.flac');
  const success = convert(`sox ${source} ${dest}`);
  return success ? dest : null;
};

// Returns the public path (note that the file might not exist there yet)
const getStaticPath = async (file) => {
  const fileName = `${file.internal.contentDigest}/${file.base}`;
  const publicPath = path.join(process.cwd(), `public`, `static`, fileName);
  await mkdirp(path.dirname(publicPath));
  return publicPath;
};

exports.onCreateNode = async ({ node }, pluginOptions) => {
  if (
    node.internal.type === 'File' &&
    node.internal.mediaType === 'audio/wav'
  ) {
    const source = node.absolutePath;
    const staticPath = await getStaticPath(node);
    await wav2mp4(source, staticPath);
    await wav2ogg(source, staticPath);
    await wav2flac(source, staticPath);
  }
};
