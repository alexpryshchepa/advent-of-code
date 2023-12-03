const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const preparedData = input.split("\n");

const NUMBERS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const getNumbersFromLine = (line) => {
  const numbers = [];

  [...line].forEach((char) => {
    const number = Number(char);

    if (!isNaN(number)) {
      numbers.push(number);
    }
  });

  return numbers;
};

const getCodeFromNumbers = (numbers) =>
  Number(
    numbers.reduce((acc, number, index) => {
      const stringNumber = String(number);

      if (numbers.length === 1) {
        return acc + stringNumber + stringNumber;
      } else if (index === 0 || index === numbers.length - 1) {
        return acc + stringNumber;
      }

      return acc;
    }, "")
  );

// Part 1
(() => {
  const firstTaskResult = preparedData.reduce((sum, line) => {
    const numbers = getNumbersFromLine(line);
    return sum + getCodeFromNumbers(numbers);
  }, 0);

  console.log("Part 1: ", firstTaskResult);
})();

// Part 2
(() => {
  const secondTaskResult = preparedData.reduce((sum, line) => {
    const textNumbers = Object.keys(NUMBERS);

    while (textNumbers.some((num) => line.includes(num))) {
      line.replace(
        new RegExp(`(${textNumbers.join("|")})`),
        (match) => `${NUMBERS[match]}${match.substring(1)}`
      );
    }

    const numbers = getNumbersFromLine(line);
    return sum + getCodeFromNumbers(numbers);
  }, 0);

  console.log("Part 2: ", secondTaskResult);
})();
