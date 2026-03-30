require("../config/env");
const connectDb = require("../config/db");
const Team = require("../models/Team");

const teams = [
  {
    name: "Rajasthan Royals",
    shortName: "RR",
    captain: "Riyan Parag",
    players: {
      batters: ["Yashasvi Jaiswal", "Shimron Hetmyer", "Shubham Dubey", "Vaibhav Suryavanshi", "Lhuan-Dre Pretorius", "Aman Rao Parela","Riyan Parag"],
      wicketkeepers: ["Dhruv Jurel", "Donovan Ferreira"],
      allRounders: ["Ravindra Jadeja", "Dasun Shanaka"],
      bowlers: ["Jofra Archer", "Ravi Bishnoi", "Sandeep Sharma", "Tushar Deshpande", "Kwena Maphaka", "Nandre Burger", "Sushant Mishra", "Yash Raj Punja", "Vignesh Puthur", "Yudhvir Singh Charak"],
    },
  },
  {
    name: "Chennai Super Kings",
    shortName: "CSK",
    captain: "Ruturaj Gaikwad",
    players: {
      batters: ["Dewald Brevis", "Ayush Mhatre", "Sarfaraz Khan","Ruturaj Gaikwad"],
      wicketkeepers: ["MS Dhoni", "Sanju Samson", "Urvil Patel", "Kartik Sharma"],
      allRounders: ["Shivam Dube", "Jamie Overton", "Ramakrishna Ghosh", "Anshul Kamboj", "Prashant Veer", "Matthew Short", "Aman Khan", "Zak Foulkes"],
      bowlers: ["Khaleel Ahmed", "Noor Ahmad", "Mukesh Choudhary", "Spencer Johnson", "Shreyas Gopal", "Gurjapneet Singh", "Akeal Hosein", "Matt Henry", "Rahul Chahar"],
    },
  },
  {
    name: "Delhi Capitals",
    shortName: "DC",
    captain: "Axar Patel",
    players: {
      batters: ["Karun Nair", "David Miller", "Pathum Nissanka", "Sahil Parakh", "Prithvi Shaw", "Nitish Rana"],
      wicketkeepers: ["KL Rahul", "Abishek Porel", "Tristan Stubbs", "Ben Duckett"],
      allRounders: ["Sameer Rizvi", "Ashutosh Sharma", "Vipraj Nigam", "Ajay Mandal", "Tripurana Vijay", "Madhav Tiwari", "Auqib Dar","Axar Patel"],
      bowlers: ["Mitchell Starc", "T Natarajan", "Mukesh Kumar", "Dushmantha Chameera", "Lungi Ngidi", "Kyle Jamieson", "Kuldeep Yadav"],
    },
  },
  {
    name: "Gujarat Titans",
    shortName: "GT",
    captain: "Shubman Gill",
    players: {
      batters: ["Sai Sudharsan", "Shahrukh Khan"],
      wicketkeepers: ["Jos Buttler", "Kumar Kushagra", "Anuj Rawat", "Tom Banton","Shubman Gill"],
      allRounders: ["Washington Sundar", "Nishant Sindhu", "Glenn Phillips", "Rahul Tewatia", "Jason Holder"],
      bowlers: ["Kagiso Rabada", "Mohammed Siraj", "Prasidh Krishna", "Ishant Sharma", "Gurnoor Singh Brar", "Rashid Khan", "Manav Suthar", "Sai Kishore", "Jayant Yadav", "Ashok Sharma", "Arshad Khan"],
    },
  },
  {
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    captain: "Ajinkya Rahane",
    players: {
      batters: ["Rinku Singh", "Angkrish Raghuvanshi", "Ajinkya Rahane", "Manish Pandey", "Rovman Powell", "Rahul Tripathi"],
      wicketkeepers: ["Finn Allen", "Tim Seifert", "Tejasvi Singh"],
      allRounders: ["Sunil Narine", "Ramandeep Singh", "Anukul Roy", "Cameron Green", "Sarthak Ranjan", "Daksh Kamra"],
      bowlers: ["Varun Chakravarthy", "Vaibhav Arora", "Umran Malik", "Matheesha Pathirana", "Kartik Tyagi", "Prashant Solanki", "Saurabh Dubey", "Harshit Rana"],
    },
  },
  {
    name: "Lucknow Super Giants",
    shortName: "LSG",
    captain: "Rishabh Pant",
    players: {
      batters: ["Aiden Markram", "Himmat Singh", "Matthew Breetzke", "Akshat Raghuwanshi"],
      wicketkeepers: ["Nicholas Pooran", "Josh Inglis", "Mukul Choudhary","Rishabh Pant"],
      allRounders: ["Mitchell Marsh", "Abdul Samad", "Shahbaz Ahmed", "Arshin Kulkarni", "Wanindu Hasaranga", "Ayush Badoni"],
      bowlers: ["Mohammad Shami", "Avesh Khan", "Mayank Yadav", "Mohsin Khan", "M Siddharth", "Digvesh Singh", "Akash Singh", "Prince Yadav", "Arjun Tendulkar", "Anrich Nortje", "Naman Tiwari"],
    },
  },
  {
    name: "Mumbai Indians",
    shortName: "MI",
    captain: "Hardik Pandya",
    players: {
      batters: ["Rohit Sharma", "Suryakumar Yadav", "Tilak Varma", "Naman Dhir", "Danish Malewar"],
      wicketkeepers: ["Quinton de Kock", "Ryan Rickelton", "Robin Minz"],
      allRounders: ["Mitchell Santner", "Raj Bawa", "Corbin Bosch", "Will Jacks", "Sherfane Rutherford", "Atharva Ankolekar", "Mayank Rawat","Hardik Pandya"],
      bowlers: ["Jasprit Bumrah", "Trent Boult", "Deepak Chahar", "Shardul Thakur", "Mayank Markande", "Allah Ghafanzar", "Ashwani Kumar", "Raghu Sharma", "Mohammad Izhar"],
    },
  },
  {
    name: "Punjab Kings",
    shortName: "PBKS",
    captain: "Shreyas Iyer",
    players: {
      batters: ["Nehal Wadhera", "Harnoor Pannu", "Pyla Avinash", "Shashank Singh", "Priyansh Arya", "Suryansh Shedge","Shreyas Iyer"],
      wicketkeepers: ["Prabhsimran Singh", "Vishnu Vinod"],
      allRounders: ["Marcus Stoinis", "Harpreet Brar", "Marco Jansen", "Azmatullah Omarzai", "Musheer Khan", "Mitch Owen", "Cooper Connolly"],
      bowlers: ["Arshdeep Singh", "Yuzvendra Chahal", "Vyshak Vijaykumar", "Ben Dwarshuis", "Yash Thakur", "Xavier Bartlett", "Lockie Ferguson"],
    },
  },
  {
    name: "Royal Challengers Bengaluru",
    shortName: "RCB",
    captain: "Rajat Patidar",
    players: {
      batters: ["Virat Kohli", "Devdutt Padikkal","Rajat Patidar"],
      wicketkeepers: ["Phil Salt", "Jitesh Sharma", "Jordan Cox"],
      allRounders: ["Krunal Pandya", "Swapnil Singh", "Tim David", "Romario Shepherd", "Jacob Bethell", "Venkatesh Iyer", "Satvik Deswal", "Mangesh Yadav", "Vicky Ostwal", "Vihaan Malhotra", "Kanishk Chouhan"],
      bowlers: ["Josh Hazlewood", "Yash Dayal", "Bhuvneshwar Kumar", "Nuwan Thushara", "Rasikh Salam", "Abhinandan Singh", "Suyash Sharma", "Jacob Duffy"],
    },
  },
  {
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    captain: "Pat Cummins",
    players: {
      batters: ["Travis Head", "Abhishek Sharma", "Aniket Verma", "R Smaran"],
      wicketkeepers: ["Ishan Kishan", "Heinrich Klaasen", "Salil Arora"],
      allRounders: ["Nitish Kumar Reddy", "Kamindu Mendis", "Harsh Dubey", "Liam Livingstone", "Jack Edwards", "Shivang Kumar", "Krains Fuletra","Pat Cummins"],
      bowlers: ["Harshal Patel", "Brydon Carse", "Jaydev Unadkat", "Eshan Malinga", "Zeeshan Ansari", "Shivam Mavi", "Sakib Hussain", "Onkar Tarmale", "Amit Kumar", "Praful Hinge"],
    },
  },
];

const seedTeams = async () => {
  await connectDb();
  await Team.deleteMany({});
  await Team.insertMany(teams);
  console.log("Seeded IPL teams.");
  process.exit(0);
};

seedTeams().catch((error) => {
  console.error(error);
  process.exit(1);
});
