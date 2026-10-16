// The site's avatar: a 32×32 pixel sprite cropped to a stair-stepped circle. Two candidates for now (see #/avatars).
export const SIZE = 32;
export const DEFAULT = "memoji";

export const SPRITES = {
  memoji: {
    colors: {
      ".": "#8cc4ff",
      K: "#2b2b2e",
      G: "#46464b",
      P: "#1b1b1d",
      S: "#f0c4a0",
      D: "#d9a47f",
      Q: "#3a2a22",
      B: "#4a4a4f",
      W: "#e8f1fd",
      E: "#151517",
      U: "#ffffff",
      L: "#c9ccd1",
      l: "#a9adb4",
      A: "#8e9299",
      H: "#26262a",
    },
    rows: [
      "................................",
      "................................",
      "................................",
      "...........KKKKKKKKKK...........",
      ".........KKKGGGGGGGGKKK.........",
      "........KKKKGGGGGGGGKKKK........",
      ".......KKKGGGGPPPPKKKKKKK.......",
      ".......KKKGGGGPPPPKKKKKKK.......",
      ".......KKKKKKKPPPPKKKKKKK.......",
      ".......KKKKKKKKKKKKKKKKKKKKK....",
      ".......KKKKKKKKKKKKKKKKKKKKK....",
      ".........DDDDDDDDDDDDDD..KK.....",
      ".........SQQQQSSSSQQQQS.........",
      ".........BBBBBBSSBBBBBB.........",
      ".......UUBWEEWBBBBWEEWBUU.......",
      ".......UUBWEEWBSSBWEEWBUU.......",
      ".......UUBWWWWBSSBWWWWBUU.......",
      ".........BBBBBBSSBBBBBB.........",
      ".....llllllllllllllllllllll.....",
      ".....LLLLLLLLLLLLLLLLLLLLLL.....",
      ".....LLLLLLLLLLLLLLLLLLLLLL.....",
      ".....LLLLLLLLLLLLALLLLLLLLL.....",
      ".....LLLLLLLLLLLALLLLLLLLLL.....",
      ".....LLLLLLLLLLAAALLLLLLLLL.....",
      "....HLLLLLLLLLLAALLLLLLLLLLH....",
      "....HLLLLLLLLLLLLLLLLLLLLLLH....",
      "....HLLLLLLLLLLLLLLLLLLLLLLH....",
      "..HHHLLLLLLLLLLLLLLLLLLLLLLHHH..",
      "..HHHLLLLLLLLLLLLLLLLLLLLLLHHH..",
      "..HHHllllllllllllllllllllllHHH..",
      "..HHHHHHHHHHHHHHHHHHHHHHHHHHHH..",
      "..HHHHHHHHHHHHHHHHHHHHHHHHHHHH..",
    ],
  },
  cat: {
    colors: {
      ".": "#8cc4ff",
      K: "#151517",
      F: "#ffffff",
      B: "#151517",
      g: "#8a8a8f",
      O: "#f0a030",
      E: "#151517",
      H: "#0b57d0",
      h: "#07408f",
      N: "#f2a6a6",
    },
    rows: [
      "................................",
      "................................",
      "...........g........O...........",
      "...........gg......OO...........",
      "...........gggFFFOOOO...........",
      "...........gggFFFOOOO...........",
      "...........FFFFFFOOOO...O.......",
      "...........FFEFFFFEFF....O......",
      "...........FFFFNNFFFF....O......",
      "........FFFFFFFFFFOOOOOF.O......",
      "........FgggFFFFFFOOOOOFO.......",
      "........FFFFFFFFFFFFFFFF........",
      "........KKKKKKKKKKKKKKKK........",
      "......KKKKKKKKKKKKKKKKKKKK......",
      "......KKKKKKKKKKKKKKKKKKKK......",
      "......KKKKFBBBFFFFBBBFKKKK......",
      "......KKKKBFFFBFFBFFFBKKKK......",
      "......KKKKBFFFBBBBFFFBKKKK......",
      ".......K..BFFFBFFBFFFBKKKK......",
      "..........FBBBFFFFBBBF..KK......",
      "..........FFFFFFFFFFFF..........",
      "...........FFFFFFFFFF...........",
      ".............FFFFFF.............",
      ".............FFFFFF.............",
      "........HHhhhFFFFFFhhhHH........",
      "........HHhhhHHHHHHhhhHH........",
      ".....HHHHHHHHHHHHHHHHHHHHHH.....",
      ".....HHHHHHHHHHHHHHHHHHHHHH.....",
      ".....HHHHHHHHHHhHhHHHHHHHHH.....",
      "...HHHHHHHHHHHHhHhHHHHHHHHHHH...",
      "...HHHHHHHHHHHHhHhHHHHHHHHHHH...",
      "...HHHHHHHHHHHHhHhHHHHHHHHHHH...",
    ],
  },
};

export function avatarCanvas(name = DEFAULT) {
  const { colors, rows } = SPRITES[name];
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  const c = SIZE / 2;
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if ((x + 0.5 - c) ** 2 + (y + 0.5 - c) ** 2 > c * c) return; // outside the circle
      ctx.fillStyle = colors[ch];
      ctx.fillRect(x, y, 1, 1);
    }),
  );
  return canvas;
}
