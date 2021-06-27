let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

function createContestObject(ele) {
  let contest_start_time = new Date(ele.start_time),
    contest_end_time = new Date(ele.end_time),
    curr_time = new Date(),
    start_date = contest_start_time.getDate(),
    start_month = months[contest_start_time.getMonth()],
    start_day = days[contest_start_time.getDay()],
    start_year = contest_start_time.getFullYear(),
    end_date = contest_end_time.getDate(),
    end_month = months[contest_end_time.getMonth()],
    end_day = days[contest_end_time.getDay()],
    end_year = contest_end_time.getFullYear(),
    min_until = Math.floor(
      (contest_start_time.getTime() - curr_time.getTime()) / 60000
    ),
    hrs_until = Math.floor(min_until / 60);
  min_until = min_until % 60;
  return {
    name: ele.name,
    hrs_until: hrs_until,
    min_until: min_until,
    url: ele.url,
    start_day: start_day,
    start_date: start_date,
    start_month: start_month,
    start_year: start_year,
    end_day: end_day,
    end_date: end_date,
    end_month: end_month,
    end_year: end_year,
  };
}

let websites = [
  "codechef",
  "codeforces",
  "hackerrank",
  "atcoder",
  "topcoder",
  "hackerearth",
  "kickstart",
  "leetcode",
  "toph",
];

export { createContestObject, websites };