const arg = require("arg");

const args = arg({
  "--year": Number,
  "--day": Number,
});

const year = args["--year"];
const day = args["--day"];

if (!year || !day) {
  throw new Error("Missing required arguments");
} else {
  const exec = require("child_process").exec;

  exec(`node ./src/${year}/${day}/index.js`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
    } else {
      console.log(stdout || stderr);
    }
  });
}
