// The Router Confesses — Node 22, standard library only.
//
// The program writes one line to /output/entry.txt: a home Wi-Fi router
// excusing itself for dropping the connection at the climax of a movie,
// reframing the outage as a deliberate intermission.
//
// When run outside the grader's container, set MAKEFUN_OUTPUT_DIR to
// stand in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The output is fully deterministic: no network access, no randomness,
// and nothing read from the clock or the environment besides the
// optional output-directory override above.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The entry itself. Keep this string byte-for-byte identical.
const ENTRY_TEXT =
  "I didn't crash at the climax, I staged an intermission, because you two haven't looked at each other since the opening credits.";

// The sealed scorer accepts 1-200 characters and rejects a
// whitespace-only entry, so check the line before writing anything.
// The file stores the line plus one trailing newline, and the newline
// counts toward the limit, so the total length is what gets checked.
function assertEntryValid(text: string, maxChars: number): number {
  // Count Unicode code points, not UTF-16 units, and include the
  // trailing newline the file will carry.
  const total = [...text].length + 1;
  if (text.trim().length === 0) {
    throw new Error('entry must not be blank');
  }
  if (total < 1 || total > maxChars) {
    throw new Error(`entry must be 1-${maxChars} characters, got ${total}`);
  }
  return total;
}

const charCount = assertEntryValid(ENTRY_TEXT, 200);

// Resolve the output directory, defaulting to the grader's /output.
function resolveOutputDir(): string {
  const override = process.env.MAKEFUN_OUTPUT_DIR;
  return override !== undefined && override !== '' ? override : '/output';
}

const outDir = resolveOutputDir();
const entryPath = join(outDir, 'entry.txt');
// The file content is the validated line plus one trailing newline.
const fileContent = `${ENTRY_TEXT}\n`;
mkdirSync(outDir, { recursive: true });
writeFileSync(entryPath, fileContent, 'utf8');
