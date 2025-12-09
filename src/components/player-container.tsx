type PlayerProps = {
  player?: { id: string; name: string; words: string[] };
};

const PlayerContainer = ({ player }: PlayerProps) => {
  if (!player) {
    return (
      <div className="flex-1 flex items-center gap-4 justify-center text-gray-400 p-4 shadow-lg">
        Очікування гравця...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-4 px-4 py-8 bg-white rounded-xl shadow-lg">
      <div className="text-2xl font-bold text-gray-800">{player.name}</div>
      <div className="flex flex-col gap-2 w-full">
        {player.words &&
          player.words.length > 0 &&
          player.words.map((word, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md shadow-sm"
            >
              {word}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlayerContainer;
