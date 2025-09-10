const changeFen = (
  cell: { x: number; y: number },
  fen: string,
  letter: string
): string => {
  const rowId = cell.y;
  const colId = cell.x;

  const rows = fen.split('/');
  const rowArr = rows[rowId].split('');
  rowArr[colId] = letter;
  rows[rowId] = rowArr.join('');
  return rows.join('/');
};

export default changeFen;
