const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const preparedData = input.split("\n");

const add = (sum, num) => sum + num;

// Part 1
(() => {
  const isCharAdjacent = (char) => char && char !== ".";

  const firstTaskResult = preparedData
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

        if (
          isCharAdjacent(line[startIndex]) ||
          isCharAdjacent(line[endIndex])
        ) {
          isAdjacent = true;
        }

        [...Array(endIndex - startIndex + 1).keys()].forEach((index) => {
          const check = (char, charIndex) =>
            startIndex + index === charIndex && isCharAdjacent(char);

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

  console.log("Part 1: ", firstTaskResult);
})();

// Part 2
(() => {
  const secondTaskResult = 0;

  console.log("Part 2: ", secondTaskResult);
})();
