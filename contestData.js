import axios from "axios";
import config from "./config.js";

async function getData() {
  let contests = [];
  let { data } = await axios.get(config.url);
  data.forEach((ele) => {
    if (ele.in_24_hours === "Yes") {
      let const_time = new Date(ele.start_time);
      let curr_time = new Date();
      let min = Math.floor(
        (const_time.getTime() - curr_time.getTime()) / 60000
      );
      let hrs = Math.floor(min / 60);
      min = min % 60;
      let contest = { name: ele.name, hrs: hrs, min: min, url: ele.url };
      contests.push(contest);
    }
  });
  contests.sort((a, b) => {
    return a.hrs > b.hrs;
  });
  return contests;
}

export default getData;
