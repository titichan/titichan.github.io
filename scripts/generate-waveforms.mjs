import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const samples = [
  ['wav/sample-mix.wav', 'img/sample-wave-mix.svg'],
  ['wav/sample-normal.wav', 'img/sample-wave-normal.svg'],
  ['wav/sample-soft.wav', 'img/sample-wave-soft.svg']
];
const barCount = 72;
const width = 768;
const height = 64;
const barWidth = 4;
const gap = (width - barWidth * barCount) / (barCount - 1);

const readPcm16Mono = file => {
  const wav = fs.readFileSync(file);
  const dataOffset = wav.indexOf(Buffer.from('data')) + 8;
  if (dataOffset < 8) throw new Error(`WAV data chunk not found: ${file}`);
  const samples = new Int16Array(
    wav.buffer,
    wav.byteOffset + dataOffset,
    Math.floor((wav.length - dataOffset) / 2)
  );
  return samples;
};

for (const [source, destination] of samples) {
  const pcm = readPcm16Mono(path.join(root, source));
  const windowSize = Math.floor(pcm.length / barCount);
  const amplitudes = Array.from({ length: barCount }, (_, index) => {
    const start = index * windowSize;
    const end = index === barCount - 1 ? pcm.length : start + windowSize;
    let squareSum = 0;
    for (let cursor = start; cursor < end; cursor += 1) {
      const value = pcm[cursor] / 32768;
      squareSum += value * value;
    }
    return Math.sqrt(squareSum / Math.max(1, end - start));
  });
  const peak = Math.max(...amplitudes, 0.001);
  const bars = amplitudes.map((amplitude, index) => {
    const normalized = Math.pow(amplitude / peak, 0.62);
    const barHeight = Math.max(3, normalized * (height - 4));
    const x = index * (barWidth + gap);
    const y = (height - barHeight) / 2;
    return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth}" height="${barHeight.toFixed(2)}" rx="1.5"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><g fill="#657fae">${bars}</g></svg>\n`;
  fs.writeFileSync(path.join(root, destination), svg);
}
