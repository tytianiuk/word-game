const PlayerContainer = () => {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
      <div className="text-2xl font-bold text-gray-800">Артем</div>
      <div className="flex flex-col gap-2 w-full">
        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md shadow-sm">
          слово 1
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md shadow-sm">
          слово 2
        </div>
      </div>
    </div>
  );
};

export default PlayerContainer;
