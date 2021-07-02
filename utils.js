import { MessageButton, MessageActionRow } from "discord-buttons";

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
    start_time = contest_start_time.toTimeString().split(" ")[0],
    start_date = contest_start_time.getDate(),
    start_month = months[contest_start_time.getMonth()],
    start_day = days[contest_start_time.getDay()],
    start_year = contest_start_time.getFullYear(),
    end_time = contest_end_time.toTimeString().split(" ")[0],
    end_date = contest_end_time.getDate(),
    end_month = months[contest_end_time.getMonth()],
    end_day = days[contest_end_time.getDay()],
    end_year = contest_end_time.getFullYear(),
    duration_hrs = Math.floor(ele.duration / 3600),
    website = ele.site.toLowerCase(),
    duration_min = Math.floor((ele.duration - duration_hrs * 3600) / 60),
    min_until = Math.floor(
      (contest_start_time.getTime() - curr_time.getTime()) / 60000
    ),
    hrs_until = Math.floor(min_until / 60);
  min_until = min_until % 60;
  return {
    name: ele.name,
    hrs_until: hrs_until,
    min_until: min_until,
    duration_hrs: duration_hrs,
    duration_min: duration_min,
    url: ele.url,
    website: website,
    start_time: start_time,
    start_day: start_day,
    start_date: start_date,
    start_month: start_month,
    start_year: start_year,
    end_time: end_time,
    end_day: end_day,
    end_date: end_date,
    end_month: end_month,
    end_year: end_year,
  };
}

let websites = [
  {
    name: "codechef",
    description:
      "Here is where you can show off your computer programming skills.\n Take part in our 10 days long monthly coding contest and the shorter format Cook-off and Lunchtime coding contests.\n Put yourself up for recognition and win great prizes.",
    url: "https://miro.medium.com/max/333/1*1W0-bbmt4iiEpp_pPrS0VQ.png",
  },
  {
    name: "codeforces",
    description:
      "Codeforces is a project joining people interested in and taking part in programming contests. It is a platform where contests are held regularly, the participant's skills are reflected by their rating and the former contests can be used to prepare.",
    url: "https://codeforces-upsolving-helper.herokuapp.com/static/images/codeforces-icon.png",
  },
  {
    name: "hackerrank",
    description:
      "HackerRank is a technology hiring platform that is the standard for assessing developer skills for over 2,000+ companies around the world. It enables tech recruiters and hiring managers to objectively evaluate talent at every stage of the recruiting process",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
  },
  {
    name: "atcoder",
    description:
      "Based in Japan, AtCoder offers online programming contests on a weekly basis. The contests are offered in Japanese and English. As of 2020, it is one of the most popular platforms of its kind",
    url: "https://img.atcoder.jp/assets/atcoder.png",
  },
  {
    name: "topcoder",
    description:
      "US resource and company, which organizes contests and also provides industrial problems as a kind of free-lance job; it offers dozens of short contests and several long (marathons) every year.",
    url: "https://images.ctfassets.net/b5f1djy59z3a/3MB1wM9Xuwca88AswIUwsK/dad472153bcb5f75ea1f3a193f25eee2/Topcoder_Logo_200px.png",
  },
  {
    name: "hackerearth",
    description:
      "Bangalore, India based company providing online contest like environment aiming at providing recruitment assessment solutions.",
    url: "https://media.cdn.gradconnection.com/uploads/8cda75b2-8384-47be-af0b-6c1d4314bc0a-HACKEREARTH_LOGO.png",
  },
  {
    name: "kickstart",
    description:
      "Kick Start is a global online coding competition, consisting of three-hour rounds of a variety of algorithmic challenges designed by Google engineers.",
    url: "http://www.mladiinfo.eu/wp-content/uploads/bfi_thumb/75642397_202483967434562_2620245142245736448_n-3aztd00y5tpa6n5psjz0g0.jpg",
  },
  {
    name: "leetcode",
    description:
      "The purpose of LeetCode is to provide you hands-on training on real coding interview questions. The Online Judge gives you immediate feedback on the correctness and efficiency of your algorithm which facilitates a great learning experience.",
    url: "https://leetcode.com/static/images/LeetCode_logo_rvs.png",
  },
  {
    name: "toph",
    description:
      "Toph is where competitive programmers participate in programming contests, solve algorithm and data structure problems and become a part of an awesome community.",
    url: "https://toph.co/images/emblem_512p.png?_=d5d517cf95abe4d22253494019b418fc5f3ce386",
  },
];

function hasWebsite(name) {
  for (let ele in websites) {
    if (websites[ele].name === name) {
      return websites[ele];
    }
  }
  return false;
}

let next = () => {
  return new MessageButton()
    .setID("next_page")
    .setLabel("Next")
    .setStyle("grey")
    .setEmoji("➡");
};
let prev = () => {
  return new MessageButton()
    .setID("prev_page")
    .setLabel("Previous")
    .setStyle("grey")
    .setEmoji("⬅");
};
let newRow = () => {
  return new MessageActionRow().addComponent(prev()).addComponent(next());
};

function createContestEmbed(data, contestEmbed, n = 1, maxMessage) {
  contestEmbed.fields = [];
  for (
    let i = (n - 1) * maxMessage;
    i < n * maxMessage && i < data.length;
    i++
  ) {
    let {
      hrs_until,
      start_time,
      start_date,
      end_time,
      end_date,
      start_day,
      end_day,
      min_until,
      url,
      name,
      start_month,
      end_month,
      start_year,
      end_year,
    } = data[i];
    let desc = `Starts in ${hrs_until}hours and ${min_until}minutes\nVisit [here](${url}) for more.`;
    if (hrs_until < 0 || hrs_until > 10) {
      desc = `Started on ${start_date}/${start_month}/${start_year} at ${start_time}`;
      desc += `\nEnds on ${end_date}/${end_month}/${end_year} at ${end_time}`;
      desc += `\nVisit [here](${url}) for more.`;
    }
    contestEmbed.fields.push({
      name: `${name}`,
      value: desc,
    });
  }
  let len = data.length;
  if (len > 0) {
    contestEmbed.footer = {
      text: `${n} of ${
        Math.floor(len / maxMessage) + (len % maxMessage === 0 ? 0 : 1)
      }`,
    };
  } else {
    contestEmbed.footer = {
      text: "No such contests.",
    };
  }
  // console.log(data.length);
}

export {
  createContestObject,
  websites,
  newRow,
  createContestEmbed,
  hasWebsite,
};
