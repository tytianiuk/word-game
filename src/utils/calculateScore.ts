import type { Player } from '../types/player';

const calculateScore = (players: Player[]): number[] => {
  const results: number[] = [];
  for (let i = 0; i < 2; i++) {
    let sum = 0;
    if (players[i] && players[i].words) {
      players[i].words.forEach((word: string) => {
        sum += word.length;
      });
    }
    results.push(sum);
  }

  return results;
};

export default calculateScore;
