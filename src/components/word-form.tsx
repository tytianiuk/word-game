const WordForm = () => {
  return (
    <form className="flex gap-4 items-center bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
      <input
        type="text"
        name="word-input"
        id="word-input"
        required
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg"
        placeholder="Введіть слово"
      />
      <input
        type="submit"
        value="Відправити"
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
      />
    </form>
  );
};

export default WordForm;
