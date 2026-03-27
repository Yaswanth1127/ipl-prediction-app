const createDateTime = (date, time) => {
  const timeMap = {
    "3:30 PM": "15:30:00",
    "7:30 PM": "19:30:00",
  };

  return new Date(`${date}T${timeMap[time]}`);
};

const matches = [
  { matchNo: 1, team1: "RCB", team2: "SRH", date: "2026-03-28", time: "7:30 PM", venue: "Bengaluru" },
  { matchNo: 2, team1: "MI", team2: "KKR", date: "2026-03-29", time: "7:30 PM", venue: "Mumbai" },
  { matchNo: 3, team1: "RR", team2: "CSK", date: "2026-03-30", time: "7:30 PM", venue: "Guwahati" },
  { matchNo: 4, team1: "PBKS", team2: "GT", date: "2026-03-31", time: "7:30 PM", venue: "New Chandigarh" },
  { matchNo: 5, team1: "LSG", team2: "DC", date: "2026-04-01", time: "7:30 PM", venue: "Lucknow" },
  { matchNo: 6, team1: "KKR", team2: "SRH", date: "2026-04-02", time: "7:30 PM", venue: "Kolkata" },
  { matchNo: 7, team1: "CSK", team2: "PBKS", date: "2026-04-03", time: "7:30 PM", venue: "Chennai" },
  { matchNo: 8, team1: "DC", team2: "MI", date: "2026-04-04", time: "3:30 PM", venue: "Delhi" },
  { matchNo: 9, team1: "GT", team2: "RR", date: "2026-04-04", time: "7:30 PM", venue: "Ahmedabad" },
  { matchNo: 10, team1: "SRH", team2: "LSG", date: "2026-04-05", time: "3:30 PM", venue: "Hyderabad" },
  { matchNo: 11, team1: "RCB", team2: "CSK", date: "2026-04-05", time: "7:30 PM", venue: "Bengaluru" },
  { matchNo: 12, team1: "KKR", team2: "PBKS", date: "2026-04-06", time: "7:30 PM", venue: "Kolkata" },
  { matchNo: 13, team1: "RR", team2: "MI", date: "2026-04-07", time: "7:30 PM", venue: "Guwahati" },
  { matchNo: 14, team1: "DC", team2: "GT", date: "2026-04-08", time: "7:30 PM", venue: "Delhi" },
  { matchNo: 15, team1: "KKR", team2: "LSG", date: "2026-04-09", time: "7:30 PM", venue: "Kolkata" },
  { matchNo: 16, team1: "RR", team2: "RCB", date: "2026-04-10", time: "7:30 PM", venue: "Guwahati" },
  { matchNo: 17, team1: "PBKS", team2: "SRH", date: "2026-04-11", time: "3:30 PM", venue: "New Chandigarh" },
  { matchNo: 18, team1: "CSK", team2: "DC", date: "2026-04-11", time: "7:30 PM", venue: "Chennai" },
  { matchNo: 19, team1: "LSG", team2: "GT", date: "2026-04-12", time: "3:30 PM", venue: "Lucknow" },
  { matchNo: 20, team1: "MI", team2: "RCB", date: "2026-04-12", time: "7:30 PM", venue: "Mumbai" },
  { matchNo: 21, team1: "SRH", team2: "RR", date: "2026-04-13", time: "7:30 PM", venue: "Hyderabad" },
  { matchNo: 22, team1: "CSK", team2: "KKR", date: "2026-04-14", time: "7:30 PM", venue: "Chennai" },
  { matchNo: 23, team1: "RCB", team2: "LSG", date: "2026-04-15", time: "7:30 PM", venue: "Bengaluru" },
  { matchNo: 24, team1: "MI", team2: "PBKS", date: "2026-04-16", time: "7:30 PM", venue: "Mumbai" },
  { matchNo: 25, team1: "GT", team2: "KKR", date: "2026-04-17", time: "7:30 PM", venue: "Ahmedabad" },
  { matchNo: 26, team1: "RCB", team2: "DC", date: "2026-04-18", time: "3:30 PM", venue: "Bengaluru" },
  { matchNo: 27, team1: "SRH", team2: "CSK", date: "2026-04-18", time: "7:30 PM", venue: "Hyderabad" },
  { matchNo: 28, team1: "KKR", team2: "RR", date: "2026-04-19", time: "3:30 PM", venue: "Kolkata" },
  { matchNo: 29, team1: "PBKS", team2: "LSG", date: "2026-04-19", time: "7:30 PM", venue: "New Chandigarh" },
  { matchNo: 30, team1: "GT", team2: "MI", date: "2026-04-20", time: "7:30 PM", venue: "Ahmedabad" },
  { matchNo: 31, team1: "SRH", team2: "DC", date: "2026-04-21", time: "7:30 PM", venue: "Hyderabad" },
  { matchNo: 32, team1: "LSG", team2: "RR", date: "2026-04-22", time: "7:30 PM", venue: "Lucknow" },
  { matchNo: 33, team1: "MI", team2: "CSK", date: "2026-04-23", time: "7:30 PM", venue: "Mumbai" },
  { matchNo: 34, team1: "RCB", team2: "GT", date: "2026-04-24", time: "7:30 PM", venue: "Bengaluru" },
  { matchNo: 35, team1: "DC", team2: "PBKS", date: "2026-04-25", time: "3:30 PM", venue: "Delhi" },
  { matchNo: 36, team1: "RR", team2: "SRH", date: "2026-04-25", time: "7:30 PM", venue: "Jaipur" },
  { matchNo: 37, team1: "GT", team2: "CSK", date: "2026-04-26", time: "3:30 PM", venue: "Ahmedabad" },
  { matchNo: 38, team1: "LSG", team2: "KKR", date: "2026-04-26", time: "7:30 PM", venue: "Lucknow" },
  { matchNo: 39, team1: "DC", team2: "RCB", date: "2026-04-27", time: "7:30 PM", venue: "Delhi" },
  { matchNo: 40, team1: "PBKS", team2: "RR", date: "2026-04-28", time: "7:30 PM", venue: "New Chandigarh" },
  { matchNo: 41, team1: "MI", team2: "SRH", date: "2026-04-29", time: "7:30 PM", venue: "Mumbai" },
  { matchNo: 42, team1: "GT", team2: "RCB", date: "2026-04-30", time: "7:30 PM", venue: "Ahmedabad" },
  { matchNo: 43, team1: "RR", team2: "DC", date: "2026-05-01", time: "7:30 PM", venue: "Jaipur" },
  { matchNo: 44, team1: "CSK", team2: "MI", date: "2026-05-02", time: "7:30 PM", venue: "Chennai" },
  { matchNo: 45, team1: "SRH", team2: "KKR", date: "2026-05-03", time: "3:30 PM", venue: "Hyderabad" },
  { matchNo: 46, team1: "GT", team2: "PBKS", date: "2026-05-03", time: "7:30 PM", venue: "Ahmedabad" },
  { matchNo: 47, team1: "MI", team2: "LSG", date: "2026-05-04", time: "7:30 PM", venue: "Mumbai" },
  { matchNo: 48, team1: "DC", team2: "CSK", date: "2026-05-05", time: "7:30 PM", venue: "Delhi" },
  { matchNo: 49, team1: "SRH", team2: "PBKS", date: "2026-05-06", time: "7:30 PM", venue: "Hyderabad" },
  { matchNo: 50, team1: "LSG", team2: "RCB", date: "2026-05-07", time: "7:30 PM", venue: "Lucknow" },
  { matchNo: 51, team1: "DC", team2: "KKR", date: "2026-05-08", time: "7:30 PM", venue: "Delhi" },
  { matchNo: 52, team1: "RR", team2: "GT", date: "2026-05-09", time: "7:30 PM", venue: "Jaipur" },
  { matchNo: 53, team1: "CSK", team2: "LSG", date: "2026-05-10", time: "3:30 PM", venue: "Chennai" },
  { matchNo: 54, team1: "RCB", team2: "MI", date: "2026-05-10", time: "7:30 PM", venue: "Raipur" },
  { matchNo: 55, team1: "PBKS", team2: "DC", date: "2026-05-11", time: "7:30 PM", venue: "Dharamshala" },
  { matchNo: 56, team1: "GT", team2: "SRH", date: "2026-05-12", time: "7:30 PM", venue: "Ahmedabad" },
  { matchNo: 57, team1: "RCB", team2: "KKR", date: "2026-05-13", time: "7:30 PM", venue: "Raipur" },
  { matchNo: 58, team1: "PBKS", team2: "MI", date: "2026-05-14", time: "7:30 PM", venue: "Dharamshala" },
  { matchNo: 59, team1: "LSG", team2: "CSK", date: "2026-05-15", time: "7:30 PM", venue: "Lucknow" },
  { matchNo: 60, team1: "KKR", team2: "GT", date: "2026-05-16", time: "7:30 PM", venue: "Kolkata" },
  { matchNo: 61, team1: "PBKS", team2: "RCB", date: "2026-05-17", time: "3:30 PM", venue: "Dharamshala" },
  { matchNo: 62, team1: "DC", team2: "RR", date: "2026-05-17", time: "7:30 PM", venue: "Delhi" },
  { matchNo: 63, team1: "CSK", team2: "SRH", date: "2026-05-18", time: "7:30 PM", venue: "Chennai" },
  { matchNo: 64, team1: "RR", team2: "LSG", date: "2026-05-19", time: "7:30 PM", venue: "Jaipur" },
  { matchNo: 65, team1: "KKR", team2: "MI", date: "2026-05-20", time: "7:30 PM", venue: "Kolkata" },
  { matchNo: 66, team1: "CSK", team2: "GT", date: "2026-05-21", time: "7:30 PM", venue: "Chennai" },
  { matchNo: 67, team1: "SRH", team2: "RCB", date: "2026-05-22", time: "7:30 PM", venue: "Hyderabad" },
  { matchNo: 68, team1: "LSG", team2: "PBKS", date: "2026-05-23", time: "7:30 PM", venue: "Lucknow" },
  { matchNo: 69, team1: "MI", team2: "RR", date: "2026-05-24", time: "3:30 PM", venue: "Mumbai" },
  { matchNo: 70, team1: "KKR", team2: "DC", date: "2026-05-24", time: "7:30 PM", venue: "Kolkata" }
];

const matchSeedData = matches.map((match) => {
  const startTime = createDateTime(match.date, match.time);

  return {
    matchNo: match.matchNo,
    team1: match.team1,
    team2: match.team2,
    venue: match.venue,
    startTime,
    deadline: new Date(startTime),
    status: "upcoming",
    result: {},
  };
});

module.exports = {
  matchSeedData,
};
