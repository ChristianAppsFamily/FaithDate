#!/usr/bin/env node
/**
 * Generates the three tiny placeholder voice clips in assets/audio/.
 * Mock voice intros and voice notes point at these so playback is real audio
 * (expo-audio) without shipping recordings of real people.
 *
 *   node scripts/generate-placeholder-audio.js
 */
const fs = require('node:fs');
const path = require('node:path');

const SAMPLE_RATE = 8000;
const SECONDS = 6;
const OUT_DIR = path.join(__dirname, '..', 'assets', 'audio');

// Soft, hum-like melodies in different registers so the three clips sound distinct.
const melodies = [
  [262, 330, 392, 330, 294, 262],
  [196, 247, 294, 247, 220, 196],
  [330, 392, 440, 392, 349, 330],
];

function render(melody) {
  const total = SAMPLE_RATE * SECONDS;
  const perNote = Math.floor(total / melody.length);
  const samples = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const noteIndex = Math.min(melody.length - 1, Math.floor(i / perNote));
    const freq = melody[noteIndex];
    const tInNote = (i % perNote) / SAMPLE_RATE;
    const env = Math.min(1, tInNote * 12) * Math.exp(-tInNote * 2.2);
    const t = i / SAMPLE_RATE;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.2;
    samples[i] = Math.round(128 + tone * env * 60);
  }
  return samples;
}

function wav(samples) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + samples.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE, 28); // byte rate (8-bit mono)
  header.writeUInt16LE(1, 32); // block align
  header.writeUInt16LE(8, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(samples.length, 40);
  return Buffer.concat([header, Buffer.from(samples)]);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
melodies.forEach((melody, i) => {
  const file = path.join(OUT_DIR, `placeholder-${i + 1}.wav`);
  fs.writeFileSync(file, wav(render(melody)));
  console.log(`wrote ${path.relative(process.cwd(), file)}`);
});
