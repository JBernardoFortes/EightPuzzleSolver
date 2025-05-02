import { useState } from "react";

interface Props {
  handleAlgSelection: (alg: string) => void;
}

const AlgorithmSelector = ({ handleAlgSelection }: Props) => {
  const algs = ["BFS", "DFS", "Greedy", "A*"] as const;
  const [selectedAlg, setSelectedAlg] = useState<(typeof algs)[number]>("BFS");

  return (
    <div className="AlgSelectionContainer">
      {algs.map((alg) => (
        <button
          type="button"
          className={`btn`}
          id={selectedAlg === alg ? "active" : ""}
          value={alg}
          key={alg}
          onClick={(e) => {
            handleAlgSelection((e.target as HTMLButtonElement).value);
            setSelectedAlg(alg);
          }}
        >
          {alg}
        </button>
      ))}
    </div>
  );
};

export default AlgorithmSelector;
