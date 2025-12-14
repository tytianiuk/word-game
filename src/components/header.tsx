interface HeaderProps {
  roomId: string;
  handle: () => void;
}

const Header = ({ roomId, handle }: HeaderProps) => {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Word Master</h1>
          <p className="text-sm text-muted-foreground">Кімната: {roomId}</p>
        </div>
        <button
          onClick={handle}
          className="btn-outline text-destructive border-destructive/50 hover:bg-destructive/10"
        >
          Вийти з гри
        </button>
      </div>
    </div>
  );
};

export default Header;
