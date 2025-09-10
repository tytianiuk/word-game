type ScoreProps = {
  score: number[];
};

const Score = ({ score }: ScoreProps) => {
  return (
    <div className="h-min px-8 py-4 text-8xl font-bold text-center  shadow-md bg-white ">
      {score.join(' : ')}
    </div>
  );
};

export default Score;
