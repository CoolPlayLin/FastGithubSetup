const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const child_process = require("node:child_process");

const main = () => {
  if (os.platform() !== "win32") {
    throw Error("This script is able to be run in Windows only");
  }

  const innoCompilerPath = path.resolve("InnoCompiler", "ISCC.exe");
  const fastGithubPath = path.resolve("src", "FastGithub");
  const distFolder = path.resolve("dist");
  const logPath = path.resolve("build.log");
  const configPath = fs
    .readdirSync(path.resolve("src"))
    .filter((file) => file.endsWith(".iss"))
    .map((file) => {
      console.log(`Found config file ${file}`);
      return path.resolve("src", file);
    });
  if (fs.existsSync(distFolder)) {
    fs.readdirSync(distFolder).forEach((file) => {
      fs.rmSync(path.join(distFolder, file), { recursive: true, force: true });
    });
    fs.rmdirSync(distFolder, { force: true });
  }
  if (!fs.existsSync(innoCompilerPath)) {
    throw Error("Unable to find Inno Compiler folder");
  }
  if (!fs.existsSync(fastGithubPath)) {
    throw Error("Some of resource files lost");
  }
  const logs = [];
  for (let config of configPath) {
    console.log(`Starting compile ${config}`);
    logs.push(
      child_process.execSync(`${innoCompilerPath} ${config}`).toString("utf-8")
    );
  }

  const distPath = fs
    .readdirSync("src")
    .filter((file) => file.includes("FastGithub.Setup"))
    .map((file) => path.resolve("src", file));

  console.log(`Creating dist folder in ${distFolder}`);
  fs.mkdirSync(distFolder);
  for (let dist of distPath) {
    console.log(`Moving ${dist} into ${distFolder}`);
    fs.renameSync(dist, path.join(distFolder, path.basename(dist)));
  }
};

console.log(
  `=========================\nCompiling process started\n=========================`
);
main();
console.log(
  `=========================\nCompiling process ended\n=========================`
);
