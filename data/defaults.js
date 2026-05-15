// ============================================
// ZYZIRE 0.0.3 — data/defaults.js
// ============================================

const DEFAULT_TASKS = [
  {id:1,title:"Review 405 Assignment Phase 3",cat:"Uni",done:false,pri:"high"},
  {id:2,title:"Work on CartChef full build",cat:"Uni",done:false,pri:"high"},
  {id:3,title:"Update React portfolio website",cat:"Portfolio",done:false,pri:"medium"},
  {id:4,title:"Lab 8 – Course 440",cat:"Uni",done:true,pri:"low"},
  {id:5,title:"Organize laptop files",cat:"Personal",done:false,pri:"low"},
];

const DEFAULT_HABITS = [
  {id:1,name:"Morning workout 💪",done:false,streak:12,total:45},
  {id:2,name:"Read / learn something 📖",done:false,streak:7,total:30},
  {id:3,name:"No social media AM 📵",done:true,streak:4,total:20},
  {id:4,name:"Cold shower 🚿",done:false,streak:3,total:15},
  {id:5,name:"Journal entry ✍️",done:false,streak:9,total:35},
  {id:6,name:"Drink 2L water 💧",done:true,streak:15,total:60},
];

const DEFAULT_MEDIA = [
  {id:1,type:"Movie",title:"Dune: Part Two",status:"Watched",rating:5,genre:"Sci-Fi",note:""},
  {id:2,type:"Show",title:"Severance",status:"Watching",rating:4,genre:"Thriller",note:"S2 is incredible"},
  {id:3,type:"Comic",title:"Invincible Vol. 1",status:"Owned",rating:5,genre:"Superhero",note:""},
  {id:4,type:"Movie",title:"Oppenheimer",status:"Watched",rating:4,genre:"Drama",note:""},
  {id:5,type:"Show",title:"The Bear",status:"Watchlist",rating:0,genre:"Drama",note:""},
  {id:6,type:"Comic",title:"Saga Vol. 3",status:"Want",rating:0,genre:"Fantasy",note:""},
];

const DEFAULT_DIARY = [
  {id:1,date:"May 13",mood:"😊",rating:8,summary:"Productive day — finished 435 slides and hit the gym. Felt focused.",tags:["productive","gym"]},
  {id:2,date:"May 12",mood:"😐",rating:6,summary:"Slow start but got CartChef planning done. A bit scattered.",tags:["uni","planning"]},
  {id:3,date:"May 11",mood:"😴",rating:5,summary:"Tired. Didn't do much. Watched Severance at night.",tags:["rest","media"]},
];

const DEFAULT_BOOKS = [
  {id:1,title:"CPIS 405",sub:"Info Systems Analysis",color:"#22c55e",pages:[
    {id:1,type:"note",title:"Week 1 Notes",content:"NPV & ROI calculations\nr = 0.12\ny0 = 1/(1+0.12)^0 = 1"},
    {id:2,type:"pdf",title:"Lecture Slides Week 3",content:""},
    {id:3,type:"canvas",title:"Diagram Sketch",content:""},
  ]},
  {id:2,title:"CPIS 440",sub:"Software Engineering",color:"#15803d",pages:[
    {id:1,type:"note",title:"Requirements Notes",content:"Functional vs Non-functional requirements..."},
    {id:2,type:"pdf",title:"Lab 3 Slides",content:""},
  ]},
  {id:3,title:"CartChef",sub:"Capstone Project",color:"#052e16",pages:[
    {id:1,type:"note",title:"Architecture Notes",content:"React + Node + MongoDB\nRoutes: /api/recipes, /api/cart"},
    {id:2,type:"canvas",title:"UI Wireframe",content:""},
  ]},
  {id:4,title:"CPIS 428",sub:"IT Project Management",color:"#15803d",pages:[
    {id:1,type:"note",title:"Debate Prep",content:"Key arguments for agile vs waterfall..."},
  ]},
];

const DEFAULT_SUBS = [
  {id:1,name:"Netflix",icon:"🎬",amount:49,cycle:"monthly",next:"Jun 1",color:"#e50914"},
  {id:2,name:"Spotify",icon:"🎵",amount:19,cycle:"monthly",next:"May 20",color:"#1db954"},
  {id:3,name:"ChatGPT Plus",icon:"🤖",amount:75,cycle:"monthly",next:"Jun 5",color:"#74aa9c"},
  {id:4,name:"iCloud 50GB",icon:"☁️",amount:4,cycle:"monthly",next:"May 28",color:"#007aff"},
  {id:5,name:"GitHub Pro",icon:"💻",amount:25,cycle:"monthly",next:"Jun 10",color:"#6e40c9"},
];

const DEFAULT_GYM = [
  {id:1,date:"May 13",type:"Push",exercises:[
    {name:"Bench Press",sets:[{reps:10,kg:80},{reps:8,kg:85},{reps:6,kg:87.5}]},
    {name:"Shoulder Press",sets:[{reps:10,kg:50},{reps:8,kg:55},{reps:8,kg:55}]},
    {name:"Tricep Pushdown",sets:[{reps:12,kg:30},{reps:12,kg:32.5},{reps:10,kg:35}]},
  ]},
  {id:2,date:"May 11",type:"Pull",exercises:[
    {name:"Deadlift",sets:[{reps:5,kg:120},{reps:5,kg:125},{reps:3,kg:130}]},
    {name:"Pull-ups",sets:[{reps:10,kg:0},{reps:8,kg:0},{reps:7,kg:0}]},
    {name:"Barbell Row",sets:[{reps:10,kg:70},{reps:10,kg:72.5},{reps:8,kg:75}]},
  ]},
];

const DEFAULT_FINANCE = {
  income:[
    {id:1,source:"Freelance",amount:1200,date:"May 1",category:"Work"},
    {id:2,source:"Family",amount:800,date:"May 5",category:"Family"},
    {id:3,source:"Part-time",amount:500,date:"May 10",category:"Work"},
  ],
  expenses:[
    {id:1,name:"Grocery",amount:150,date:"May 2",category:"Food"},
    {id:2,name:"Transport",amount:80,date:"May 3",category:"Transport"},
    {id:3,name:"Eating out",amount:120,date:"May 8",category:"Food"},
    {id:4,name:"Clothes",amount:200,date:"May 12",category:"Shopping"},
  ],
  savings:[
    {id:1,goal:"Emergency Fund",target:5000,current:1200},
    {id:2,goal:"New Laptop",target:3000,current:800},
    {id:3,goal:"Travel",target:2000,current:350},
  ],
  budget:3000,
};

const DEFAULT_GOALS = [
  {id:1,title:"Graduate with honors",category:"Academic",deadline:"Dec 2025",progress:70,milestones:[
    {text:"Complete all labs",done:true},
    {text:"Pass all finals",done:false},
    {text:"Finish capstone",done:false},
  ]},
  {id:2,title:"Launch Zyzire",category:"Project",deadline:"Sep 2025",progress:35,milestones:[
    {text:"Build prototype",done:true},
    {text:"Add all modules",done:false},
    {text:"Publish to App Store",done:false},
  ]},
  {id:3,title:"Deadlift 140kg",category:"Fitness",deadline:"Aug 2025",progress:90,milestones:[
    {text:"Hit 100kg",done:true},
    {text:"Hit 120kg",done:true},
    {text:"Hit 140kg",done:false},
  ]},
];

const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const today  = new Date();
