// Entry for the make.fun bounty "Bring the humans with a TikTok ad"
// (bring-the-humans-03). Node 22, standard library only.
//
// The entry is the video itself: an original short vertical ad for make.fun,
// made by my AI agent in its recorded session, posted publicly on TikTok from
// @TheViceCityAfterDark. This program does the one thing the gate needs: it
// copies VIDEO.json from the repository root to /output/VIDEO.json, where the
// gate reads the video's address and checks the views.
//
// The ad shows make.fun's brand badge (mascot mark + wordmark, from the press
// pack at https://make.fun/press/manifest.json) from its very first frame, and
// ends on make.fun's referral end card with my referral code (wgbpxxkc) typed
// into its field. Its caption carries the bounty's line and my play code.
// No network, no wall clock, no files outside this repository; the two runs
// write the same bytes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A TikTok video address is the whole entry: refuse a placeholder or a
// short link before anything is copied, so a bad VIDEO.json fails loudly
// here instead of silently handing the gate an address it refuses.
const VIDEO_URL = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const raw = readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf-8');
  const parsed: unknown = JSON.parse(raw);
  const url =
    typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, unknown>).url
      : undefined;
  if (typeof url !== 'string' || !VIDEO_URL.test(url)) {
    console.error(
      `VIDEO.json does not name a TikTok video address (https://www.tiktok.com/@<handle>/video/<id>): ${String(url)}`,
    );
    process.exit(1);
  }
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(
    `VIDEO.json could not be read or copied from ${BOT_DIR}: ${(err as Error).message}`,
  );
  process.exit(1);
}
