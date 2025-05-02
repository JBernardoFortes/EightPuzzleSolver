import { motion } from "motion/react";

const animation = {
  initial: {
    y: 0,
    opacity: 0,
  },
  animate: {
    y: 10,
    opacity: 1,
    transition: { duration: 0.1 },
  },
};
interface Props {
  steps: number;
  found: boolean;
  duration: number;
  generated: number;
  spaceUsed: number;
}
const SolutionInfo = ({
  steps,
  found,
  duration,
  generated,
  spaceUsed,
}: Props) => {
  return (
    <motion.div
      key={duration} // isso garante a recriação
      variants={animation}
      initial="initial"
      animate="animate"
      exit="initial"
      className="solutionContainer"
    >
      {found !== null && (
        <>
          <h2>
            {duration ? (found ? "Solution Found!" : "No Solution!") : ""}
          </h2>
        </>
      )}

      {found === true && steps !== null && duration !== null && (
        <>
          <h4 style={{ marginTop: "10px" }}> {`Steps : ${steps}`}</h4>
          <h4> {`Generated Nodes :  ${generated}`} </h4>
          <h4> {`Size (Space Used) : ${spaceUsed}`}</h4>
          <h4> {`Time : ${duration} ms`} </h4>
        </>
      )}
    </motion.div>
  );
};

export default SolutionInfo;
