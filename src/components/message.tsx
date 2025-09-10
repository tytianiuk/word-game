type MessageProps = {
  message: string;
};

const Message = ({ message }: MessageProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg text-xl pointer-events-auto animate-fadeInOut">
        {message}
      </div>
    </div>
  );
};

export default Message;
