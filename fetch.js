import axios from "axios";
import config from "./config.js";
import storage from "node-persist";
import { createContestObject } from "./utils.js";

await storage.init({ dir: ".node-persist/storage" });
let dataPool = await storage.getItem("dataPool");

async function seed() {
  try {
    if (!dataPool) {
      let { data } = await axios.get(config.url);
      await storage.setItem("dataPool", data);
      dataPool = data;
      console.info("\x1b[36m%s\x1b[0m", "==> Fetch Successful");
    } else {
      console.log("\x1b[35m==> Using cached DataPool\x1b[0m");
    }
  } catch (err) {
    console.log("\x1b[31m==> Fetch Unsuccessful\x1b[0m");
  }
}

async function everyHour() {
  try {
    await axios.get("https://illicit-bots.herokuapp.com/");
    let { data } = await axios.get(config.url);
    let ret = [];
    if (!dataPool) {
      dataPool = data;
      return data;
    }
    data.forEach((ele) => {
      let found = dataPool.find((each) => {
        return each.name === ele.name;
      });
      if (!found) {
        ret.push(ele);
      }
    });
    await storage.setItem("dataPool", data);
    return ret;
  } catch (error) {
    console.log("\x1b[31m==> fetch unsuccessful", error, "\x1b[0m");
  }
}

function getRunning() {
  let contests = [];
  dataPool.forEach((ele) => {
    if (ele.status === "CODING") {
      let contest = createContestObject(ele);
      contests.push(contest);
    }
  });
  return contests;
}

function getByWebsite(name) {
  let contests = [];
  dataPool.forEach((ele) => {
    if (
      ele.site.toLowerCase().split(" ").join("") === name ||
      ele.url.includes(name)
    ) {
      let contest = createContestObject(ele);
      contests.push(contest);
    }
  });
  return contests;
}

function getInHours(hrs) {
  let contests = [];
  dataPool.forEach((ele) => {
    let contest = createContestObject(ele);
    if (contest.hrs_until === hrs) contests.push(contest);
  });
  return contests;
}

function getAll() {
  let contests = [];
  dataPool.forEach((ele) => {
    let contest = createContestObject(ele);
    if (contest.hrs_until > 0) contests.push(contest);
  });
  return contests;
}

function getByName(name) {
  let contests = [];
  dataPool.forEach((data) => {
    if (data.name.toLowerCase().includes(name.toLowerCase())) {
      contests.push(data);
    }
  });
  return contests;
}

export {
  seed,
  everyHour,
  getRunning,
  getAll,
  getByWebsite,
  getInHours,
  getByName,
};
