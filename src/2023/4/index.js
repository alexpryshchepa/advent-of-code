const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const preparedData = input.split("\n").map((line) => {
  const [, card] = line.split(": ");
  const [winning, given] = card.split(" | ");

  const splitNumbers = (string) =>
    [...string].reduce((acc, _, index) => {
      if (index === 0 || index % 3 === 0) {
        acc.push(Number(string.substring(index, index + 2)));
      }

      return acc;
    }, []);

  return [splitNumbers(winning), splitNumbers(given)];
});

const add = (sum, num) => sum + num;

// Part 1
(() => {
  const firstPartResult = preparedData.reduce((sum, [winning, given]) => {
    let result = 0;

    winning.forEach((win) => {
      if (given.includes(win)) {
        result === 0 ? (result += 1) : (result *= 2);
      }
    });

    return sum + result;
  }, 0);

  console.log("Part 1: ", firstPartResult);
})();

// Part 2
(() => {
  const processedCards = preparedData.reduce((acc, [winning, given], index) => {
    const processCard = () => {
      let nextIndex = 0;

      winning.forEach((num) => {
        if (given.includes(num)) {
          nextIndex += 1;

          const wonIndex = index + nextIndex;

          if (wonIndex < preparedData.length) {
            acc[wonIndex]
              ? (acc[wonIndex] = acc[wonIndex] + 1)
              : (acc[wonIndex] = 1);
          }
        }
      });
    };

    if (acc[index]) {
      const iter = acc[index] + 1;

      [...Array(iter)].forEach(() => {
        processCard();
      });
    } else {
      processCard();
    }

    return acc;
  }, {});

  const secondPartResult =
    Object.values(processedCards).reduce(add, 0) + preparedData.length;

  console.log("Part 2: ", secondPartResult);
})();
