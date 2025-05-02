// AS FUNCOES QUE RESOLVEM RETORNAM UM ARRAY DE STRINGS COM O CAMINHO FEITO SE HOUVER RESOLUCAO
// SE NAO HOUVER, ELE RETORNA NULL

export default class EightPuzzleAlg {
  constructor() {
    this.goalState = "123456780";
  }
  matrixToString(matrix) {
    return matrix.flat().join("");
  }
  stringToMatrix(str) {
    const arr = str.split("").map(Number);
    return [arr.slice(0, 3), arr.slice(3, 6), arr.slice(6, 9)];
  }
  getNextStates(stateStr) {
    const moves = [];
    const index = stateStr.indexOf("0");
    const row = Math.floor(index / 3);
    const col = index % 3;

    const directions = [
      [0, 1], // direita
      [1, 0], // Baixo
      [-1, 0], // Cima
      [0, -1], // esquerda
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const newIndex = newRow * 3 + newCol;
        const stateArr = stateStr.split("");

        [stateArr[index], stateArr[newIndex]] = [
          stateArr[newIndex],
          stateArr[index],
        ];

        moves.push(stateArr.join(""));
      }
    }
    return moves;
  }

  BFS(initialMatrix) {
    const initialState = this.matrixToString(initialMatrix);
    const visited = new Set();
    const queue = [[initialState, []]];

    while (queue.length > 0) {
      const [current, path] = queue.shift();

      if (current === this.goalState) {
        return path.concat([current]);
      }

      if (!visited.has(current)) {
        visited.add(current);
        const nextStates = this.getNextStates(current);
        for (const next of nextStates) {
          queue.push([next, path.concat([current])]);
        }
      }
    }
    return null;
  }

  reconstructPath(state, predecessors) {
    const path = [];
    while (state !== null) {
      path.unshift(state);
      state = predecessors.get(state);
    }
    return path;
  }

  DFS(initialMatrix) {
    const initialState = this.matrixToString(initialMatrix);
    const visited = new Set();
    const stack = [initialState];
    const predecessors = new Map();
    predecessors.set(initialState, null);

    while (stack.length > 0) {
      const current = stack.pop();

      if (current === this.goalState) {
        return this.reconstructPath(current, predecessors);
      }

      if (!visited.has(current)) {
        visited.add(current);
        const nextStates = this.getNextStates(current);
        for (const next of nextStates) {
          if (!predecessors.has(next)) {
            predecessors.set(next, current);
            stack.push(next);
          }
        }
      }
    }
    return null;
  }

  Heuristic(stateStr) {
    // DISTANCIA MANHATAN
    let distance = 0;

    for (let i = 0; i < 9; i++) {
      const val = parseInt(stateStr[i]);

      if (val != 0) {
        const targetRow = Math.floor((val - 1) / 3);
        const targetCol = (val - 1) % 3;
        const currentRow = Math.floor(i / 3);
        const currentCol = i % 3;

        distance +=
          Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
      }
    }
    return distance;
  }

  GreedySearch(initialMatrix) {
    const initialState = this.matrixToString(initialMatrix);
    const visited = new Set();
    const queue = [[initialState, [], this.Heuristic(initialState)]];

    while (queue.length > 0) {
      queue.sort((a, b) => a[2] - b[2]);
      const [current, path] = queue.shift();

      if (current === this.goalState) {
        return path.concat([current]);
      }

      if (!visited.has(current)) {
        visited.add(current);
        const nextStates = this.getNextStates(current);
        for (const next of nextStates) {
          if (!visited.has(next)) {
            const h = this.Heuristic(next);
            queue.push([next, path.concat([current]), h]);
          }
        }
      }
    }

    return null;
  }

  AStar(initialMatrix) {
    const initialState = this.matrixToString(initialMatrix);
    const visited = new Set();
    const predecessors = new Map();
    const gScores = new Map();

    const queue = [[initialState, this.Heuristic(initialState), 0]];

    predecessors.set(initialState, null);
    gScores.set(initialState, 0);

    while (queue.length > 0) {
      queue.sort((a, b) => a[1] - b[1]);
      const [current, f, g] = queue.shift();

      if (current === this.goalState) {
        return this.reconstructPath(current, predecessors);
      }
      if (!visited.has(current)) {
        visited.add(current);

        const nextStates = this.getNextStates(current);
        for (const next of nextStates) {
          const tentativeG = g + 1;

          if (!gScores.has(next) || tentativeG < gScores.get(next)) {
            gScores.set(next, tentativeG);
            const h = this.Heuristic(next);
            const fScore = tentativeG + h;

            predecessors.set(next, current);
            queue.push([next, fScore, tentativeG]);
          }
        }
      }
    }

    return null;
  }

  printSolution(solution) {
    if (!solution) {
      console.log("Nao foi encontrada uma solucao");
      return;
    }
    console.log(`Solucao encontrada em ${solution.length - 1} passos \n`);
    solution.forEach((state, index) => {
      const matrix = this.stringToMatrix(state);
      console.log(matrix.flat());
    });
  }
}
