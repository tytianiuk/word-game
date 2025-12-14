let ukrainianWords = new Set<string>();

export const loadDictionary = async () => {
  try {
    const response = await fetch('/ukrainian-words.txt');
    const wordsData = await response.text();
    const words = wordsData.toLowerCase().match(/[а-яіїєґ]+/g) || [];
    ukrainianWords = new Set(words);
  } catch (error) {
    console.error('Error loading words dictionary:', error);
  }
};

export const isValidWord = (word: string): boolean => {
  const normalizedWord = word.toLowerCase().trim();
  return normalizedWord.length >= 2 && ukrainianWords.has(normalizedWord);
};
