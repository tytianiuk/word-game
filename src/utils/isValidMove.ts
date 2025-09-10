const isValidMove = (
  board: string[][],
  word: string,
  newPos: { y: number; x: number }
) => {
  const R = board.length;
  const C = board[0].length;
  word = word.toUpperCase();
  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, -1, 1];

  const inBounds = (r: number, c: number) => {
    return r >= 0 && r < R && c >= 0 && c < C;
  };

  const visited = Array.from({ length: R }, () => Array(C).fill(false));

  for (let sr = 0; sr < R; sr++) {
    for (let sc = 0; sc < C; sc++) {
      if (!board[sr][sc]) continue;
      if (board[sr][sc].toUpperCase() !== word[0]) continue;

      const stack = [
        { r: sr, c: sc, i: 0, usedNew: sr === newPos.y && sc === newPos.x },
      ];

      const dfs = (r: number, c: number, i: number, usedNew: boolean) => {
        if (board[r][c].toUpperCase() !== word[i]) return false;
        if (r === newPos.y && c === newPos.x) usedNew = true;
        if (i === word.length - 1) {
          return usedNew;
        }
        visited[r][c] = true;
        for (let k = 0; k < 4; k++) {
          const nr = r + dr[k],
            nc = c + dc[k];
          if (!inBounds(nr, nc)) continue;
          if (visited[nr][nc]) continue;
          if (!board[nr][nc]) continue;
          if (board[nr][nc].toUpperCase() !== word[i + 1]) continue;
          if (dfs(nr, nc, i + 1, usedNew)) {
            visited[r][c] = false;
            return true;
          }
        }
        visited[r][c] = false;
        return false;
      };

      if (dfs(sr, sc, 0, stack[0].usedNew)) return true;
    }
  }
  return false;
};

export default isValidMove;
