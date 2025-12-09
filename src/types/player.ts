export interface Player {
  id: string;
  name: string;
  words: string[];
  score?: number;
}

export interface GameRoom {
  id: string;
  players: Player[];
  fen: string;
  currentTurn: string;
}
