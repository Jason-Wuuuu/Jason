// The site's avatar, drawn as a 24×24 pixel sprite (cap, glasses, hoodie) and cropped to a stair-stepped circle.
export const SIZE = 24;

const COLORS = {
  ".": "#8cc4ff", // sky behind him
  K: "#2b2b2e", // cap
  G: "#46464b", // cap highlight
  S: "#f0c4a0", // skin
  D: "#d9a47f", // skin in the cap's shadow
  B: "#151517", // glasses frames
  W: "#e8f1fd", // lenses
  E: "#151517", // eyes
  M: "#b0594f", // mouth
  H: "#2f6fdb", // hoodie
  h: "#1b4f9c", // hoodie shade
};

const ROWS = [
  "........................",
  "........................",
  "........KKKKKKKK........",
  "......KKKGGGGGGKKK......",
  ".....KKGGGGGGGGGGKK.....",
  ".....KKKKKKKKKKKKKK.....",
  "....KKKKKKKKKKKKKKKK....",
  ".....DDDDDDDDDDDDDD.....",
  ".....SSSSSSSSSSSSSS.....",
  ".....SBBBBBSSBBBBBS.....",
  "....SSBWEWBBBBWEWBSS....",
  "....SSSBBBSSSSBBBSSS....",
  ".....SSSSSSSSSSSSSS.....",
  ".....SSSSSSSSSSSSSS.....",
  ".....SSSMSSSSSSMSSS.....",
  ".....SSSSMMMMMMSSSS.....",
  "......SSSSSSSSSSSS......",
  "......HHHHSSSSHHHH......",
  "....HHHHHHWHHWHHHHHH....",
  "...HHHHHHHWHHWHHHHHHH...",
  "..hhHHHHHHHHHHHHHHHHhh..",
  ".hhHHHHHHHHHHHHHHHHHHhh.",
  "hhHHHHHHHHHHHHHHHHHHHHhh",
  "hhhhhhhhhhhhhhhhhhhhhhhh",
];

export function avatarCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  const c = SIZE / 2;
  ROWS.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if ((x + 0.5 - c) ** 2 + (y + 0.5 - c) ** 2 > c * c) return; // outside the circle
      ctx.fillStyle = COLORS[ch];
      ctx.fillRect(x, y, 1, 1);
    }),
  );
  return canvas;
}

let url;
export const avatarURL = () => (url ??= avatarCanvas().toDataURL());
