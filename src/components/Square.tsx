import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  value: number;
  row: number;
  col: number;
  handleValueChange: (value: number, row: number, col: number) => string;
  moveDirection: string;
  movedNumber: number;
}

// const animation = {
//   initial: {
//     opacity: 1,
//   },
//   animate: {
//     opacity: 1,
//   },
//   transition: {
//     duration: 0.05,
//   },
// };

const getOffset = (direction: string) => {
  switch (direction) {
    case "right":
      return { x: "-116.5%", y: "0%" };
    case "left":
      return { x: "116.5%", y: "0%" };
    case "down":
      return { x: "0%", y: "-116.5%" };
    case "up":
      return { x: "0%", y: "116.5%" };
    default:
      return { x: "0%", y: "0%" };
  }
};

export const Square = ({
  value,
  row,
  col,
  handleValueChange,
  moveDirection,
  movedNumber,
}: Props) => {
  const [innerTempValue, setInnerTempValue] = useState<string | null>(null);
  // const [moveDirection, setMoveDirection] = useState<string>("bernardo");

  // let offset;
  const [offset, setOffset] = useState({ x: "0%", y: "0%" });
  const handleInnerValue = (innValue: string) => {
    setInnerTempValue(innValue);
  };

  useEffect(() => {
    setOffset(getOffset(moveDirection));
  }, [moveDirection]);

  return (
    <motion.div
      className="square"
      id={value == 0 ? "zero" : ""}
      // key={value}
      transition={{ duration: 0.2 }}
      // initial={animation.initial}
      // style={value === movedNumber? { transform: `translate(${offset.x}, ${offset.y})` }: {}}

      animate={
        value === movedNumber
          ? {
              opacity: 1,
              x: offset.x,
              y: offset.y,
            }
          : { opacity: 1 }
      }
    >
      <input
        type="number"
        name="value"
        className="squareInput"
        id={`${value}`}
        value={innerTempValue !== null ? innerTempValue : value.toString()}
        onChange={(e) => {
          // const newValue = e.target.value;
          // handleValueChange(Number(newValue), row, col);
          handleInnerValue(e.target.value);
        }}
        onBlur={() => {
          if (
            innerTempValue === null ||
            innerTempValue.trim() === "" ||
            isNaN(Number(innerTempValue))
          ) {
            setInnerTempValue(null);
            return;
          }
          const newValue = Number(innerTempValue);

          if (newValue < 0 || newValue > 8) {
            window.alert("Enter a valid number");
          }

          handleValueChange(Number(newValue), row, col);
          // setMoveDirection(handleValueChange(Number(newValue), row, col));

          setInnerTempValue(null);
        }}
      ></input>
    </motion.div>
  );
};
