const fenToBoard = (fen: string): string[][] => {
  return fen
    .split('/')
    .map((row) => row.split('').map((ch) => (ch === '0' ? '' : ch)));
};

export default fenToBoard;
