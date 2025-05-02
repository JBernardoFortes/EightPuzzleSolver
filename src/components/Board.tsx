import { Square } from "./Square";
interface Props {
  state: number[][];
  handleValueChange: (value: number, row: number, col: number) => string;
  moveDirection: string;
  movedNumber: number;
}
const Board = ({
  state,
  handleValueChange,
  moveDirection,
  movedNumber,
}: Props) => {
  return (
    <div className="boardContainer">
      {state.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            value={value}
            handleValueChange={handleValueChange}
            moveDirection={moveDirection}
            movedNumber={movedNumber}
          />
        ))
      )}
    </div>
  );
};

export default Board;
