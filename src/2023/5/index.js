const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(filePath, "utf8");

const preparedData = input.split("\n\n").reduce(
  (result, line) => {
    if (line.startsWith("seeds")) {
      const [, seeds] = line.split(": ");

      result.seeds = seeds.split(" ").map(Number);
    } else {
      const parts = line.split("\n");
      const id = parts[0];

      result.ids.push(id);

      parts.forEach((part, index) => {
        if (index !== 0) {
          const [startTo, startFrom, count] = part.split(" ").map(Number);

          result.mappers.push({
            id,
            from: startFrom,
            to: startTo,
            count,
          });
        }
      });
    }

    return result;
  },
  { seeds: [], ids: [], mappers: [] }
);

const checkMap = preparedData.ids.reduce((map, id) => {
  map[id] = false;
  return map;
}, {});

// Part 1
(() => {
  const locations = [];

  preparedData.seeds.forEach((seed) => {
    let mappedValue = seed;

    const checker = Object.assign({}, checkMap);

    preparedData.mappers.forEach(({ id, from, to, count }) => {
      if (checker[id]) return;

      if (mappedValue >= from && mappedValue < from + count) {
        mappedValue = mappedValue - from + to;
        checker[id] = true;
      }
    });

    locations.push(mappedValue);
  });

  console.log("Part 1: ", Math.min(...locations));
})();

// Part 2
(() => {
  const seedsRanges = preparedData.seeds.reduce((ranges, seed, index) => {
    if ((index - 1) % 2 === 0) return ranges;

    const minSeed = seed;
    const maxSeed = seed + preparedData.seeds[index + 1];

    ranges.push([minSeed, maxSeed]);

    return ranges;
  }, []);

  const locationsRanges = preparedData.mappers
    .filter(({ id }) => id.includes("location"))
    .reduce((ranges, { to, count }) => ranges.concat([[to, to + count]]), [])
    .sort((a, b) => a[0] - b[0]);

  const getAvailableMinLocation = (location) => {
    let result = location;

    for (const [index, [from, to]] of locationsRanges.entries()) {
      if (result >= from && result <= to) break;

      const nextRange = locationsRanges[index + 1];

      if (!nextRange) {
        continue;
      }

      if (result < nextRange.from) {
        result = nextRange.from;
        break;
      } else if (result > nextRange.to) {
        result = Infinity;
        break;
      } else {
        continue;
      }
    }

    return result;
  };

  const reversedMappers = preparedData.mappers.reverse();
  let location = getAvailableMinLocation(0);
  let seed = null;

  while (location !== Infinity && seed === null) {
    let mappedSeed = location;

    const checker = Object.assign({}, checkMap);

    reversedMappers.forEach(({ id, from: to, to: from, count }) => {
      if (checker[id]) return;

      if (mappedSeed >= from && mappedSeed < from + count) {
        mappedSeed = mappedSeed - from + to;
        checker[id] = true;
      }
    });

    if (
      seedsRanges.some(([from, to]) => mappedSeed >= from && mappedSeed <= to)
    ) {
      seed = mappedSeed;
    } else {
      location = getAvailableMinLocation(location + 1);
    }
  }

  console.log("Part 2: ", location);
})();
