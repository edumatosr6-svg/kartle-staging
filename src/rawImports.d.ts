// The published track file is bundled as text (ADR-0002 of pista-kart-park): the exact bytes of the file, read by readTrackData.
declare module '*.json?raw' {
  const text: string;
  export default text;
}
// A recording bundled inside the script (ADR-0001 of apresentacao-e-som): the bytes of the file as a base 64 `data:` text.
declare module '*.mp3?inline' {
  const dataUrl: string;
  export default dataUrl;
}
