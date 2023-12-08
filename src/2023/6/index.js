const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const INDEX_TO_PROP = {
  0: "time",
  1: "distance",
};

const preparedData = input.split("\n").reduce((result, line, index) => {
  const [, data] = line.split(":");

  const regexp = /\d+/g;

  let match = null;
  let raceIndex = 0;

  do {
    match = regexp.exec(data);

    if (match) {
      const number = Number(match[0]);
      const race = result[raceIndex];

      if (race) {
        race[INDEX_TO_PROP[index]] = number;
      } else {
        result[raceIndex] = { [INDEX_TO_PROP[index]]: number };
      }
    }

    raceIndex++;
  } while (match);

  return result;
}, {});

const getWaysToWin = (race) => {
  let waysToWin = 0;
  let time = 0;

  do {
    const moveTime = race.time - time;

    if (moveTime * time > race.distance) {
      waysToWin++;
    }

    time++;
  } while (time < race.time);

  return waysToWin;
};

// Part 1
(() => {
  const waysToWin = [];

  Object.values(preparedData).forEach((race) => {
    waysToWin.push(getWaysToWin(race));
  });

  console.log(
    "Part 1: ",
    waysToWin.reduce((a, b) => a * b, 1)
  );
})();

// Part 2
(() => {
  const race = Object.values(preparedData).reduce(
    (result, { time, distance }) => {
      result.time += time;
      result.distance += distance;

      return result;
    },
    { time: "", distance: "" }
  );

  console.log("Part 2: ", getWaysToWin(race));
})();
