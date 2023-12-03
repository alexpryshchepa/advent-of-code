const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const preparedData = input.split("\n");

const add = (sum, num) => sum + num;

// Part 1
(() => {
  const isSymbol = (char) => char && char !== ".";

  const firstPartResult = preparedData
    .reduce((result, line, lineIndex, lines) => {
      const regexp = /\d+/g;
      let match;

      while ((match = regexp.exec(line))) {
        const target = match[0];
        const number = Number(target);

        const startIndex = match.index - 1;
        const endIndex = match.index + target.length;

        const prevLine = lines[lineIndex - 1];
        const nextLine = lines[lineIndex + 1];

        let isAdjacent = false;

        if (isSymbol(line[startIndex]) || isSymbol(line[endIndex])) {
          isAdjacent = true;
        }

        [...Array(endIndex - startIndex + 1).keys()].forEach((index) => {
          const check = (char, charIndex) =>
            startIndex + index === charIndex && isSymbol(char);

          if (
            (prevLine && [...prevLine].some(check)) ||
            (nextLine && [...nextLine].some(check))
          ) {
            isAdjacent = true;
          }
        });

        if (isAdjacent) {
          result.push(number);
        }
      }

      return result;
    }, [])
    .reduce(add, 0);

  console.log("Part 1: ", firstPartResult);
})();

// Part 2
(() => {
  const isStar = (char) => char && char === "*";
  const getAdjacentId = (step, position) => `${step}|${position}`;

  const mappedData = preparedData.reduce((result, line, lineIndex, lines) => {
    const regexp = /\d+/g;
    let match;

    while ((match = regexp.exec(line))) {
      const target = match[0];
      const number = Number(target);

      const startIndex = match.index - 1;
      const endIndex = match.index + target.length;

      const prevLineIndex = lineIndex - 1;
      const nextLineIndex = lineIndex + 1;

      const prevLine = lines[prevLineIndex];
      const nextLine = lines[nextLineIndex];

      let adjacentId = null;

      if (isStar(line[startIndex])) {
        adjacentId = getAdjacentId(lineIndex, startIndex);
      }

      if (isStar(line[endIndex])) {
        adjacentId = getAdjacentId(lineIndex, endIndex);
      }

      [...Array(endIndex - startIndex + 1).keys()].forEach((i) => {
        const index = startIndex + i;

        const check = (char, charIndex) => index === charIndex && isStar(char);

        if (prevLine && [...prevLine].some(check)) {
          adjacentId = getAdjacentId(prevLineIndex, index);
        }

        if (nextLine && [...nextLine].some(check)) {
          adjacentId = getAdjacentId(nextLineIndex, index);
        }
      });

      if (adjacentId) {
        if (result[adjacentId]) {
          result[adjacentId].push(number);
        } else {
          result[adjacentId] = [number];
        }
      }
    }

    return result;
  }, {});

  const secondPartResult = Object.values(mappedData)
    .reduce((result, numbers) => {
      if (numbers.length > 1) {
        const produce = numbers.reduce((result, num) => result * num, 1);

        result.push(produce);
      }

      return result;
    }, [])
    .reduce(add, 0);

  console.log("Part 2: ", secondPartResult);
})();
