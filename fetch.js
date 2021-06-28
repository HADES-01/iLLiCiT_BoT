import axios from "axios";
import config from "./config.js";
import storage from "node-persist";
import { createContestObject, websites } from "./utils.js";

await storage.init({ dir: ".node-persist/storage" });

let dataPool = await storage.getItem("dataPool");

async function seed() {
  let { data } = await axios.get(config.url);
  await storage.setItem("dataPool", data);
  console.log("fetch Successful");
}

async function everyHour() {
  let { data } = await axios.get(config.url);
  let ret = [];
  if (!dataPool) {
    dataPool = data;
    return data;
  }
  data.forEach((ele) => {
    let found = dataPool.find((dat) => {
      return dat.name === ele.name || dat.in_24_hours === "Yes";
    });
    if (!found) {
      ret.push(ele);
      dataPool.push(ele);
    }
  });
  await storage.setItem("dataPool", dataPool);
  return ret;
}

function getIn24Hrs() {
  let contests = [];
  dataPool.forEach((ele) => {
    if (ele.in_24_hours === "Yes") {
      let contest = createContestObject(ele);
      if (contest.hrs > 0) contests.push(contest);
    }
  });
  contests.sort((a, b) => {
    return a.hrs > b.hrs;
  });
  return contests;
}

function getRunning() {
  let curr = new Date();
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
  if (!websites.includes(name)) {
    return [{ name: "Not Found" }];
  }
  let contests = [];
  dataPool.forEach((ele) => {
    if (ele.url.includes(name)) {
      let contest = createContestObject(ele);
      contests.push(contest);
    }
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

export { seed, everyHour, getIn24Hrs, getRunning, getAll, getByWebsite };
