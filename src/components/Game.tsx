import AlgorithmSelector from "./AlgorithmSelector";
import Board from "./Board";
import SolutionInfo from "./SolutionInfo";
import { useEffect, useState } from "react";
import EightPuzzleAlg from "../modules/EightPuzzleAlgC.ts";

const Game = () => {
  const [state, setState] = useState<number[][]>([
    [1, 2, 0],
    [4, 6, 3],
    [7, 5, 8],
  ]);
  const [path, setPath] = useState<string[] | null>(null);
  const [stepsNumber, setSteps] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [qtGenerated, setQtGenerated] = useState<number>(0);

  const [spaceUsed, setSpaceUsed] = useState<number>(0);

  // State que eh mostrado no board
  // Iterar sobre ele mudando ( useState () ) pra mudar no board

  const [algSelected, setAlg] = useState("BFS");

  const [moveDirection, setMoveDirection] = useState<string>("");

  const [movedNumber, setMovedNumber] = useState<number>(-1);

  // const [tempValue, setTempValue] = useState<string | null>("");

  const Solver = new EightPuzzleAlg();

  const handleAlgSelection = (alg: string) => {
    if (alg == "Greedy") {
      alg = "GreedySearch";
    } else if (alg == "A*") {
      alg = "AStar";
    }
    setAlg(alg);
  };

  const Solve = () => {
    let start = performance.now();

    const algorithmSelector = (Solver as any)[algSelected](state);
    setPath(algorithmSelector?.path);
    setQtGenerated(algorithmSelector?.qtGenerated);

    // console.log(algorithmSelector?.maxSpaceUsed);

    setSpaceUsed(algorithmSelector?.maxSpaceUsed);

    let end = performance.now();
    setDuration(Number((end - start).toFixed(2)));
  };

  // useEffect(() => console.log(algSelected + " " + path), [path]);

  useEffect(() => {
    let intervalTime = 200;
    if (algSelected == "DFS") {
      intervalTime = 200;
    }

    if (!path || path.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      if (index >= path?.length) {
        clearInterval(interval);

        return;
      }
      if (!(index + 1 > path?.length - 1)) {
        // console.log("Current path index:", index);
        // console.log(
        //   getMoveDirection(
        //     Solver.stringToMatrix(path[index]),
        //     Solver.stringToMatrix(path[index + 1])
        //   )
        // );
        setMovedNumber(
          getMovedNumber(
            Solver.stringToMatrix(path[index + 1]),
            Solver.stringToMatrix(path[index])
          )
        );

        setMoveDirection(
          getMoveDirection(
            Solver.stringToMatrix(path[index]),
            Solver.stringToMatrix(path[index + 1])
          )
        );
      } else {
        setMoveDirection("");
      }
      setState(Solver.stringToMatrix(path[index]));

      index += 1;
    }, intervalTime);

    setSteps(path.length - 1);

    return () => clearInterval(interval);
  }, [path]);

  // useEffect(() => console.log(stepsNumber), [stepsNumber]);

  const handleValueChange = (
    value: number,
    row: number,
    col: number
  ): string => {
    if (value > 8 || value < 0) {
      window.alert("Enter a valid number");
      return "";
    }
    const previousState = state;

    // ver qual valor o `value` esta substituindo na matrix ( row, col )
    let previousValue = state[row][col];
    let previousIndex: number[] = [];
    state.forEach((row, rowIndex) => {
      row.forEach((_col, colIndex) => {
        if (state[rowIndex][colIndex] === value) {
          previousIndex = [rowIndex, colIndex];
        }
      });
    });
    // Ver onde o `Value` estava antes de ser mudado

    const newMatrix = state.map((row: number[]) => [...row]);
    newMatrix[row][col] = value;

    // console.log(getMoveDirection(newMatrix, previousState));

    newMatrix[previousIndex[0]][previousIndex[1]] = previousValue;
    setState(newMatrix);
    return getMoveDirection(newMatrix, previousState);
  };

  const getMoveDirection = (prev: number[][], curr: number[][]) => {
    const findZero = (matrix: number[][]) => {
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) if (matrix[i][j] === 0) return [i, j];
    };

    const [prevRow, prevCol] = findZero(prev)!;
    const [currRow, currCol] = findZero(curr)!;

    if (currRow === prevRow) {
      return currCol > prevCol ? "right" : "left";
    } else {
      return currRow > prevRow ? "down" : "up";
    }
  };

  const getMovedNumber = (prevMatrix: number[][], currMatrix: number[][]) => {
    let movedNumber = -1;

    let prevZeroPos: { row: number; col: number } | null = null;
    let currZeroPos: { row: number; col: number } | null = null;

    for (let i = 0; i < prevMatrix.length; i++) {
      for (let j = 0; j < prevMatrix[i].length; j++) {
        if (prevMatrix[i][j] === 0) {
          prevZeroPos = { row: i, col: j };
        }
        if (currMatrix[i][j] === 0) {
          currZeroPos = { row: i, col: j };
        }
      }
    }

    if (prevZeroPos && currZeroPos) {
      for (let i = 0; i < prevMatrix.length; i++) {
        for (let j = 0; j < prevMatrix[i].length; j++) {
          if (prevMatrix[i][j] !== 0 && currMatrix[i][j] === 0) {
            movedNumber = prevMatrix[i][j];
          }
        }
      }
    }

    return movedNumber;
  };

  return (
    <div className="gameContainer">
      <AlgorithmSelector
        handleAlgSelection={handleAlgSelection}
      ></AlgorithmSelector>
      <Board
        state={state}
        handleValueChange={handleValueChange}
        moveDirection={moveDirection}
        movedNumber={movedNumber}
      ></Board>
      <input
        type="button"
        className="btn"
        value="Solve"
        onClick={() => Solve()}
      />
      <SolutionInfo
        steps={stepsNumber}
        found={!!path}
        duration={duration}
        generated={qtGenerated}
        spaceUsed = {spaceUsed}
      ></SolutionInfo>
    </div>
  );
};

export default Game;
