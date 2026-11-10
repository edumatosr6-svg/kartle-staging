// asset-budget — command-line entry of the build measure of apresentacao-e-som (DES-0004), NOT part of the playable
// client: `npm run build && npm run check:assets`. Prints the `ASSET_BUDGET` record on one line of stdout and exits with
// 0 on PASS and 1 on FAIL; it writes no file.
import { isAbsolute } from 'node:path';
import { measureAssetBudget } from './assetBudget';

// Run from the repository root (`npm run check:assets`): every path below is relative to it.
const PATHS = { distDir: 'dist', recordPath: 'src/assets/feature-assets.json', packageJsonPath: 'package.json' };

try {
  const record = measureAssetBudget(PATHS);
  process.stdout.write(`${JSON.stringify(record)}\n`);
  process.exitCode = record.verdict === 'PASS' ? 0 : 1;
} catch (error) {
  // The relative path of the file that failed, when the error names one: never a content, a machine name or an absolute path.
  const path = error instanceof Error && 'path' in error && typeof error.path === 'string' && !isAbsolute(error.path)
    ? error.path.replace(/\\/g, '/') : PATHS.distDir;
  process.stderr.write(`asset-budget: could not measure ${path}\n`);
  process.exitCode = 1;
}
