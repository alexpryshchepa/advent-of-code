const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const preparedData = input.split("\n").map((line) => {
  const [, games] = line.split(": ");
  const parts = games.split("; ");

  return parts.flatMap((part) => {
    const cubes = part.split(", ");

    return cubes.map((cube) => {
      const [count, color] = cube.split(" ");

      return [color, Number(count)];
    });
  });
});

// Part 1
(() => {
  const isCubeValid = ([color, count]) => {
    const LIMITS = {
      red: 12,
      green: 13,
      blue: 14,
    };

    return count <= LIMITS[color];
  };

  const firstTaskResult = preparedData
    .flatMap((tuples, index) => (tuples.every(isCubeValid) ? [index + 1] : []))
    .reduce((sum, num) => sum + num, 0);

  console.log("Part 1: ", firstTaskResult);
})();

// Part 2
(() => {
  const secondTaskResult = preparedData
    .map((tuples) => {
      const STORAGE = {
        red: 0,
        blue: 0,
        green: 0,
      };

      tuples.forEach(([color, count]) => {
        if (STORAGE[color] < count) {
          STORAGE[color] = count;
        }
      });

      return STORAGE;
    })
    .map((data) => Object.values(data).reduce((acc, num) => acc * num, 1))
    .reduce((sum, num) => sum + num, 0);

  console.log("Part 2: ", secondTaskResult);
})();
