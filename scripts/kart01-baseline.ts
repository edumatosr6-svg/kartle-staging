// Baseline recorder of modelo-kart-01 (DM-0001, ADR-0004): one reference lap per published setup, the
// per-step inputs run-length encoded, the final kart and the simulation measures that SIM_CONTRACT,
// DETERMINISM and WHEEL_POSITIONS compare in npm test. Run with `npm run baseline:kart01 -- [--force] [--commit <sha>]`.
// The only clock read of the feature is recordedAtUtc, documentary; no host name, user name or absolute path is written.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { PUBLISHED_SETUPS, STEP, wheelPositions, type Input, type SetupId } from '../src/physics';
import { getLapResult } from '../src/lap';
import { syntheticReading } from '../tests/fixtures/trackFiles';
import { autopilot, drive, MAX_LAP_STEPS, runCountdown, startSession } from '../tests/helpers/autopilot';

const OUTPUT = 'tests/fixtures/kart01-sim-baseline.json';
const DRIVER_MASS_KG = 75;
const SETUP_IDS: readonly SetupId[] = ['ARCADE_ASSISTIDO', 'REALISTA_ALUGUEL_4T'];

type InputRun = [count: number, throttle: number, brake: number, steer: number, drift: boolean];

// Run-length encoding of the per-step inputs: consecutive equal inputs collapse into one run.
function encodeRuns(inputs: readonly Input[]): InputRun[] {
  const runs: InputRun[] = [];
  for (const input of inputs) {
    const drift = input.drift ?? false;
    const last = runs[runs.length - 1];
    if (last && last[1] === input.throttle && last[2] === input.brake && last[3] === input.steer && last[4] === drift) last[0]++;
    else runs.push([1, input.throttle, input.brake, input.steer, drift]);
  }
  return runs;
}

function inputTypeLine(): string {
  const line = readFileSync('src/physics.ts', 'utf8').split('\n').find(l => l.startsWith('export type Input ='));
  if (!line) throw new Error('src/physics.ts: `export type Input =` line not found');
  return line.trim();
}

function main(argv: readonly string[]): void {
  const force = argv.includes('--force');
  const commitIndex = argv.indexOf('--commit');
  const commit = commitIndex >= 0 ? argv[commitIndex + 1] : undefined;
  if (commitIndex >= 0 && !commit) throw new Error('--commit needs a sha');
  if (existsSync(OUTPUT) && !force) {
    console.error(`baseline: ${OUTPUT} exists; pass --force to overwrite`);
    process.exitCode = 1;
    return;
  }
  const reading = syntheticReading();
  if (reading.trackDataStatus !== 'COMPLETE' && reading.trackDataStatus !== 'INCOMPLETE') throw new Error(`fixture reading is ${reading.trackDataStatus}`);
  const configs = SETUP_IDS.map(id => PUBLISHED_SETUPS[id].config);
  const simWheelbaseM = configs[0].wheelbase, simTrackWidthM = configs[0].trackWidth;
  for (const c of configs) if (c.wheelbase !== simWheelbaseM || c.trackWidth !== simTrackWidthM) throw new Error('published setups disagree on wheelbase or trackWidth');

  const wheelPositionsBySetup: Record<string, { forwardM: number; leftM: number }[]> = {};
  const referenceRuns = SETUP_IDS.map(setupId => {
    const setup = PUBLISHED_SETUPS[setupId];
    const config = { ...setup.config, driverMass: DRIVER_MASS_KG };
    wheelPositionsBySetup[setupId] = wheelPositions(config).map(p => ({ forwardM: p.forward, leftM: p.left }));
    const started = runCountdown(startSession(reading, 'OFFICIAL', config));
    // The recorder drives with the default autopilot of the lap tests (the design's `autopilot()`); the lap itself runs the published setup.
    const { lap, inputs } = drive(started, autopilot(), MAX_LAP_STEPS);
    const result = getLapResult(lap);
    const lapValidity = lap.validity;
    return {
      setupId, setupVersion: setup.setupVersion, lapKind: 'OFFICIAL' as const, driverMassKg: DRIVER_MASS_KG,
      inputRuns: encodeRuns(inputs), checkStepCount: inputs.length,
      lapValidity,
      ...(lapValidity === 'VALID' && !('code' in result) && result.lapMs !== undefined ? { lapMs: result.lapMs, sectorMs: result.sectorMs } : {}),
      finalKart: lap.kart,
    };
  });
  const baseline = {
    schemaVersion: 1,
    recordedAtUtc: new Date().toISOString(),
    recordedOnCommit: commit ?? null,
    stepS: STEP,
    inputTypeLine: inputTypeLine(),
    simWheelbaseM, simTrackWidthM,
    trackId: reading.trackId, trackVersion: reading.trackVersion,
    wheelPositions: wheelPositionsBySetup,
    referenceRuns,
  };
  writeFileSync(OUTPUT, JSON.stringify(baseline, null, 1) + '\n');
  for (const run of referenceRuns) console.log(`baseline ${run.setupId} ${run.setupVersion}: ${run.checkStepCount} steps, ${run.lapValidity}${run.lapMs !== undefined ? `, ${run.lapMs} ms` : ''}`);
  console.log(`baseline written: ${OUTPUT}`);
}

main(process.argv.slice(2));
