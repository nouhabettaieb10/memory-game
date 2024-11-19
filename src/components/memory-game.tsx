import { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const onGridSizeChage = (e: any) => {
    const value = parseInt(e.target.value);
    if (value >= 2 && value <= 10) setGridSize(value);
  };
  const initializeGame = () => {
    const totalCards: number = gridSize * gridSize;
    const numbers: number[] = [...Array(Math.floor(totalCards / 2)).keys()].map(
      (n: number) => n + 1
    );
    const cards: { id: number; number: number }[] = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((n, index) => ({
        id: index,
        number: n,
      }));
    console.log(cards);
    setCards(cards);
    setFlipped([]);
    setDisabled(false);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId: number) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setDisabled(false);
      setSolved([...solved, secondId, firstId]);
      setFlipped([]);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };
  const handleClick = (id: number) => {
    if (disabled || won) return;
    if (flipped.length === 0) {
      setFlipped([id]);
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        // check match logic
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.length === solved.length) setWon(true);
  }, [solved, cards]);

  const isflipped = (id: number) => flipped.includes(id) || solved.includes(id);
  const isWon = (id: number) => solved.includes(id);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginBottom: "4px",
        alignItems: "center",
        padding: "4px",
      }}
    >
      {/* Input*/}
      <h1 className="text-3xl font-bold mb-6"> Memory Game </h1>
      <div>
        <label htmlFor="gridSize" style={{ marginRight: "2px" }}>
          Grid size: (max 10){" "}
        </label>
        <input
          type="number"
          id="gridSize"
          min={2}
          max={10}
          onChange={onGridSizeChage}
          value={gridSize}
          style={{
            border: "1px solid gray",
            borderRadius: "4px",
            padding: "1px 2px",
          }}
        />
      </div>
      {/* card game */}
      <div
        style={{
          display: "grid",
          marginBottom: 4,
          marginTop: 6,
          gap: "2px",
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              border: "1px solid lightgray",
              borderRadius: "4px",
              backgroundColor: isflipped(card.id)
                ? isWon(card.id)
                  ? "green"
                  : "mediumblue"
                : "lightgray",
              display: "flex",
              justifyContent: "center",
              color: "white",
              width: "50px",
              height: "50px",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => handleClick(card.id)}
          >
            {isflipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>

      {/* Grid // win message // Button */}
      {won && (
        <div style={{ fontSize: "14px", fontWeight: "bold" }}> You won !</div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        onClick={() => initializeGame()}
      >
        {won ? "Play again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
