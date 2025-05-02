interface AlgorithmStats {
  path: string[]
  qtGenerated: number
  maxSpaceUsed: number
  depth: number
  maxDepth: number
}

export default class EightPuzzleAlg {  
  goalState: string;

  constructor() {
    this.goalState = "123456780";
  }

  matrixToString(matrix: number[][]): string {
    return matrix.flat().join("");
  }

  stringToMatrix(str: string): number[][] {
    const arr: number[] = str.split("").map(Number);
    return [arr.slice(0, 3), arr.slice(3, 6), arr.slice(6, 9)];
  }

  getNextStates(stateStr: string): string[] {
    const moves: string[] = [];
    const index: number = stateStr.indexOf("0");
    const row: number = Math.floor(index / 3);
    const col: number = index % 3;

    const directions: [number, number][] = [
      [0, 1], // direita
      [1, 0], // baixo
      [-1, 0], // cima
      [0, -1], // esquerda
    ];

    for (const [dx, dy] of directions) {
      const newRow: number = row + dx;
      const newCol: number = col + dy;

      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const newIndex: number = newRow * 3 + newCol;
        const stateArr: string[] = stateStr.split("");

        [stateArr[index], stateArr[newIndex]] = [
          stateArr[newIndex],
          stateArr[index],
        ];

        moves.push(stateArr.join(""));
      }
    }

    return moves;
  }

  BFS(initialMatrix: number[][]): AlgorithmStats | null {
    if (!this.isSolvable(initialMatrix)) {
      return null;
    }

    const initialState: string = this.matrixToString(initialMatrix);
    const visited: Set<string> = new Set();
    const queue: [string, string[]][] = [[initialState, []]];

    let qtNodeGenerated: number = 0
    let maxQueueSize: number = 0
    let maxDepth: number = 0

    while (queue.length > 0) {
      const [current, path] = queue.shift() as [string, string[]];

      if (current === this.goalState) {
        // console.log(path.length + 1, maxDepth)
        return {
          path: path.concat([current]), 
          qtGenerated: qtNodeGenerated,
          maxSpaceUsed: maxQueueSize,
          depth: path.length + 1,
          maxDepth: maxDepth
        };
      }

      if (!visited.has(current)) {
        visited.add(current);
        const nextStates: string[] = this.getNextStates(current);
        qtNodeGenerated += nextStates.length;

        for (const next of nextStates) {
          const newPath = path.concat([current]);

          queue.push([next, newPath]);
          maxQueueSize = Math.max(maxQueueSize, queue.length);
          maxDepth = Math.max(maxDepth, newPath.length);
        }
      }
    }

    return null;
  }

  reconstructPath(
    state: string,
    predecessors: Map<string, string | null>
  ): string[] {
    const path: string[] = [];
    while (state !== null) {
      path.unshift(state);
      state = predecessors.get(state)!;
    }
    return path;
  }

  DFS(initialMatrix: number[][]): AlgorithmStats | null {
    if (!this.isSolvable(initialMatrix)) {  
      return null;
    }
    
    const initialState: string = this.matrixToString(initialMatrix);
  
    interface Node { state: string; depth: number; } // depth pra calcular a profundidade
    const stack: Node[] = [{ state: initialState, depth: 0 }];

    const visited: Set<string> = new Set([initialState]);     
    const predecessors: Map<string, string | null> = new Map([[initialState, null]]);                    
  
    let qtNodeGenerated: number = 0;
    let maxStackSize: number = 0;
    let maxDepth: number = 0;

    while (stack.length > 0) {
      const { state: current, depth } = stack.pop()!;

      if (current === this.goalState) {
        // console.log(depth, maxDepth)
        return {
          path: this.reconstructPath(current, predecessors), 
          qtGenerated: qtNodeGenerated,
          maxSpaceUsed: maxStackSize,
          depth: depth,
          maxDepth: maxDepth
        };
      }

      // if (depth >= 64) {
      //   continue;   // não gera filhos abaixo desse nível; 64 é arbitrario
      // }
    
      const nextStates: string[] = this.getNextStates(current);
      qtNodeGenerated += nextStates.length;

      for (const next of nextStates) {  
        if (!visited.has(next)) { // Verifica logo se existe algum filho visitado, pra não gerar repetido
          visited.add(next);      
          predecessors.set(next, current);   
          stack.push({ state: next, depth: depth + 1 });
          maxStackSize = Math.max(maxStackSize, stack.length);
          maxDepth = Math.max(maxDepth, depth)
        }
      }
    }
    
    return null;
  }

  Heuristic(stateStr: string): number {
    let distance = 0;

    for (let i = 0; i < 9; i++) {
      const val: number = parseInt(stateStr[i]);

      if (val !== 0) {
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

  GreedySearch(initialMatrix: number[][]): AlgorithmStats | null {
    if (!this.isSolvable(initialMatrix)) {
      return null;
    }
    const initialState: string = this.matrixToString(initialMatrix);
    const visited: Set<string> = new Set();
    const queue: [string, string[], number][] = [
      [initialState, [], this.Heuristic(initialState)],
    ];

    let qtNodeGenerated: number = 0;
    let maxQueueSize: number = 0
    let maxDepth: number = 0;

    while (queue.length > 0) {
      queue.sort((a, b) => a[2] - b[2]);
      const [current, path] = queue.shift() as [string, string[], number];


      if (current === this.goalState) {
        // console.log(path.length+1, maxDepth + 1)
        return {
          path: path.concat([current]), 
          qtGenerated: qtNodeGenerated,
          maxSpaceUsed: maxQueueSize,
          depth: path.length + 1,
          maxDepth: maxDepth + 1
        };
      }

      if (!visited.has(current)) {
        visited.add(current);

        const nextStates: string[] = this.getNextStates(current);
        qtNodeGenerated += nextStates.length;

        for (const next of nextStates) {
          if (!visited.has(next)) {
            const h = this.Heuristic(next);
            const newPath = path.concat([current]);

            queue.push([next, newPath, h]);
            maxQueueSize = Math.max(maxQueueSize, queue.length);
            maxDepth = Math.max(maxDepth, newPath.length);
          }
        }
      }
    }

    return null;
  }

  AStar(initialMatrix: number[][]): AlgorithmStats | null {
    if (!this.isSolvable(initialMatrix)) {
      return null;
    }
    const initialState: string = this.matrixToString(initialMatrix);
    const visited: Set<string> = new Set();
    const predecessors: Map<string, string | null> = new Map();
    const gScores: Map<string, number> = new Map();
    const queue: [string, number, number][] = [
      [initialState, this.Heuristic(initialState), 0],
    ];

    predecessors.set(initialState, null);
    gScores.set(initialState, 0);

    let qtNodeGenerated: number = 0;
    let maxQueueSize: number = 0
    let maxDepth: number = 0

    while (queue.length > 0) {
      queue.sort((a, b) => a[1] - b[1]);
      const [current, _f, g] = queue.shift() as [string, number, number];


      if (current === this.goalState) {
        // console.log(g, maxDepth)
        return {
          path: this.reconstructPath(current, predecessors), 
          qtGenerated: qtNodeGenerated,
          maxSpaceUsed: maxQueueSize,
          depth: g,
          maxDepth: maxDepth
        };
      }

      if (!visited.has(current)) {
        visited.add(current);

        const nextStates: string[] = this.getNextStates(current);
        qtNodeGenerated += nextStates.length;

        for (const next of nextStates) {
          const tentativeG = g + 1;

          if (!gScores.has(next) || tentativeG < gScores.get(next)!) {
            gScores.set(next, tentativeG);
            const h = this.Heuristic(next);
            const fScore = tentativeG + h;

            predecessors.set(next, current);
            queue.push([next, fScore, tentativeG]);
            maxQueueSize = Math.max(maxQueueSize, queue.length);
            maxDepth = Math.max(maxDepth, tentativeG);
          }
        }
      }
    }

    return null;
  }
  isSolvable(initialMatrix: number[][]): boolean {
    const arr: number[] = initialMatrix.flat().filter((n) => n !== 0);
    let inversions: number = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  }

  printSolution(solution: string[] | null): void {
    if (!solution) {
      return;
    }

    solution.forEach((state: string) => {
      const matrix = this.stringToMatrix(state);
      console.log(matrix.flat());
    });
  }
}
