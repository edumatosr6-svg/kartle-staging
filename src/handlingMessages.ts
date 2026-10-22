// Application layer, pure: the shared text and the share label of the result screen (DES-0006, SCR-0002, API-0002).
// No DOM access, so npm test can import it; imports lapMessages and types of setupRecords only.
import { formatLapTime, message, type Language } from './lapMessages';
import type { LapRecord } from './setupRecords';

// `Kartle · <trackId> v<trackVersion> · <time or invalid state> · <setupVersion>`: never a second time nor a difference.
export function formatSharedText(record: LapRecord, lang: Language): string {
  const time = record.lapValidity === 'VALID' && record.lapMs !== undefined ? formatLapTime(record.lapMs) : message('lapStateInvalid', lang);
  return `Kartle · ${record.trackId} v${record.trackVersion} · ${time} · ${record.setupVersion}`;
}

export function shareLabel(lang: Language): string {
  return lang === 'pt' ? 'compartilhar' : 'share';
}
