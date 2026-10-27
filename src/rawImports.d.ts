// The published track file is bundled as text (ADR-0002 of pista-kart-park): the exact bytes of the file, read by readTrackData.
declare module '*.json?raw' {
  const text: string;
  export default text;
}
