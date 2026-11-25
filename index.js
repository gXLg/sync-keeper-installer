const path = require("node:path");
const crypto = require("node:crypto");
const os = require("node:os");
const fs = require("fs");

const axios = require("axios");
const input = require("readline-sync");

function getAppDir() {
  switch (process.platform) {
    case "win32":
      return process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
    case "darwin":
      return path.join(os.homedir(), "Library", "Application Support");
    case "linux":
      return process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

function getBinName() {
  switch (process.platform) {
    case "win32":
      return "sync-keeper-win.exe";
    case "darwin":
      return "sync-keeper-macos";
    case "linux":
      return "sync-keeper-linux";
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

function prompt(text, filterMap) {
  while (true) {
    const answer = input.question(text + "\n    ").trim();
    const { keep, value } = filterMap(answer);
    if (keep) return value;
    console.log("Wrong format, please re-check your input and try again!");
  }
}

function promptFilter(text, filter) {
  return prompt(text, value => ({ "keep": filter(value), value }));
}

function promptConfirm(action) {
  prompt(`Press [Enter] to ${action ?? "continue"} ...`, a => ({ "keep": true }));
}

async function download(url, output) {
  const writer = fs.createWriteStream(output);
  const response = await axios.get(url, { "responseType": "stream" });

  return new Promise(res => {
    let error = false;
    writer.on("error", err => {
      error = true;
      res(false);
    });
    writer.on("close", () => {
      if (!error) {
        res(true);
      }
    });
    response.data.pipe(writer);
  });
}

async function main() {
  const INSTALL_DIR = path.join(getAppDir(), "SyncKeeper_by_gXLg");
  const EXE_NAME = getBinName();
  const EXE = path.join(INSTALL_DIR, EXE_NAME);

  console.log();
  console.log("- SyncKeeper Installer - Author: gXLg - Date: Nov 2026 - LICENSE: MIT -");
  console.log();

  const updating = fs.existsSync(INSTALL_DIR);

  let host, folder, username;

  if (updating) {
    console.log("Existing installation detected, updating and/or repairing stuff ...");

    host = fs.readFileSync(path.join(INSTALL_DIR, "host.txt"), "utf8").trim();
    folder = fs.readFileSync(path.join(INSTALL_DIR, "folder.txt"), "utf8").trim();
    username = fs.readFileSync(path.join(INSTALL_DIR, "username.txt"), "utf8").trim();

    host = promptFilter(
      `Host Address | Press [Enter] to keep current ('${host}') or enter a new one:`,
      v => v.length == 0 || /^https[:][/][/][a-z]([a-z0-9-.]*?)[.]([a-z]+?)$/.test(v)
    ) ?? host;

    folder = prompt(
      `Game Folder  | Press [Enter] to keep current ('${folder}') or enter a new one:`,
      v => {
        if (v.length == 0) return { "keep": true, "value": folder };
        const value = path.normalize(v);
        const keep = fs.existsSync(value);
        return { keep, value };
      }
    );

    username = promptFilter(
      `Username     | Press [Enter] to keep current ('${username}') or enter a new one:`,
      v => v.length == 0 || /^[a-zA-Z0-9_]{3,10}$/.test(v)
    ) ?? username;

  } else {
    console.log("Installing SyncKeeper ...");
    fs.mkdirSync(INSTALL_DIR);

    console.log("Requesting user data ...");

    host = promptFilter(
      `Host Address | Enter the Host Address (e.g. 'https://example.com'):`,
      v => /^https[:][/][/][a-z]([a-z0-9-.]*?)[.]([a-z]+?)$/.test(v)
    );

    folder = prompt(
      `Game Folder  | Select the Game Folder (e.g. 'C:\\Users\\User\\AppData\\LocalLow\Pugstorm\\Core Keeper\\Steam\\12345'):`,
      v => {
        const value = path.normalize(v);
        const keep = fs.existsSync(value);
        return { keep, value };
      }
    );

    username = promptFilter(
      `Username     | Pick your displayed Username (3-10 characters, latin, numbers, underscores, e.g. '_Core_1337'):`,
      v => /^[a-zA-Z0-9_]{3,10}$/.test(v)
    );

    console.log("Generating user identity ...");
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
    fs.writeFileSync(path.join(INSTALL_DIR, "identity"), publicKey.export({ "type": "spki", "format": "der" }).toString("base64"));
    fs.writeFileSync(path.join(INSTALL_DIR, "key"), privateKey.export({ "type": "pkcs8", "format": "pem" }));
  }

  console.log("Saving user data ...");
  fs.writeFileSync(path.join(INSTALL_DIR, "host.txt"), host);
  fs.writeFileSync(path.join(INSTALL_DIR, "folder.txt"), folder);
  fs.writeFileSync(path.join(INSTALL_DIR, "username.txt"), username);

  console.log("Fetching latest binary ...");
  const latest = await axios.get("https://api.github.com/repos/gXLg/sync-keeper-client/releases/latest")
    .then(res => res.data.assets.find(a => a.name == EXE_NAME).browser_download_url);

  console.log(`Downloading from ${latest} ...`);
  await download(latest, EXE);

  console.log("All done! Now go to Steam and update the launch options of Core Keeper with one of the following:");
  console.log(`If empty:                 "${EXE}" %command%`);
  console.log(`If contains '%command%':  "${EXE}" <oldContent>`);
  console.log(`Else:                     "${EXE}" %command% <oldContent>`);
  console.log();
}

(async () => {

  process.on("SIGINT", () => {
    console.log("\rCTRL+C pressed, exitting ...");
    process.exit(0);
  });

  try {
    await main();
    console.log();
    console.log("-- INSTALLATION SUCCESSFULL --");
    console.log();

  } catch (err) {
    console.log();
    console.log();
    console.log("-- ERROR --");
    console.log();
    console.error(err);
    console.log();
  }
  promptConfirm("exit");

})();
