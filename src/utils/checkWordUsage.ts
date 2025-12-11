import { Player } from '@/types/player';

export const checkWordUsage = (players: Player[], word: string) => {
  const allUsedWords = players.flatMap((player: Player) => player.words);

  const isWordUsedGlobally = allUsedWords.some(
    (usedWord) => usedWord.toLowerCase() === word.toLowerCase()
  );

  return isWordUsedGlobally;
};
