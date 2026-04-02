import { useState, useEffect, useRef, useCallback } from "react";

const AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=aarav",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=ishaan",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=priya",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=neha",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=rohan",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=simran",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=arjun",
];
const STREAM = {
  medical:    { label:"Medical",     emoji:"🔬", color:"#B0185A", light:"#FDF0F6", border:"rgba(176,24,90,.2)"  },
  nonmedical: { label:"Non-Medical", emoji:"⚛️",  color:"#1A4FD6", light:"#EBF0FF", border:"rgba(26,79,214,.22)" },
};
const SKILL_COLORS = {
  Physics:"#F59E0B", Chemistry:"#A78BFA", Biology:"#34D399", Maths:"#38BDF8",
  Coding:"#FB923C", "Organic Chem":"#F472B6", Calculus:"#60A5FA", Research:"#C084FC",
};
const BADGE_COLORS = { platinum:"#38BDF8", gold:"#F59E0B", silver:"#7988A8", bronze:"#CD7F32", verified:"#0A9B6A" };
const BADGE_TIERS  = {
  platinum:"linear-gradient(135deg,#E0F2FE,#7DD3FC)",
  gold:"linear-gradient(135deg,#FEF3C7,#F59E0B)",
  silver:"linear-gradient(135deg,#F1F5F9,#94A3B8)",
  bronze:"linear-gradient(135deg,#FEF9C3,#D97706)",
  verified:"linear-gradient(135deg,#ECFDF5,#34D399)",
};

// ─── 20 Accounts ─────────────────────────────────────────────────────────────
const ALL_AVATARS = Array.from({length:20},(_,i)=>`https://api.dicebear.com/7.x/adventurer/svg?seed=user${i+1}`);

const STUDENTS = [
  { id:1,  name:"Priya Menon",     avatar:ALL_AVATARS[0],  stream:"medical",    streak:142, xp:11240, rank:1,  verified:true,  challengesWon:4, noteDownloads:5800, city:"Kochi",       exam:"NEET 2026", syllabusPct:89, daysToExam:48, skillLevels:[["Biology",96,"#34D399"],["Chemistry",88,"#A78BFA"],["Physics",74,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:true}],  goal:"AIIMS Delhi — MBBS 2026",           rankLabel:"Top 1%",   notes:18, percentile:99 },
  { id:2,  name:"Neha Gupta",      avatar:ALL_AVATARS[1],  stream:"medical",    streak:98,  xp:9310,  rank:2,  verified:true,  challengesWon:2, noteDownloads:3900, city:"Jaipur",      exam:"NEET 2026", syllabusPct:82, daysToExam:48, skillLevels:[["Chemistry",91,"#A78BFA"],["Biology",85,"#34D399"],["Physics",68,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"Maulana Azad Medical College",      rankLabel:"Top 2%",   notes:14, percentile:97 },
  { id:3,  name:"Ishaan Verma",    avatar:ALL_AVATARS[2],  stream:"nonmedical", streak:88,  xp:8620,  rank:3,  verified:true,  challengesWon:3, noteDownloads:2940, city:"Delhi",       exam:"JEE 2026",  syllabusPct:78, daysToExam:72, skillLevels:[["Maths",94,"#38BDF8"],["Physics",89,"#F59E0B"],["Coding",82,"#FB923C"]],   streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"IIT Bombay — Computer Science",     rankLabel:"Top 3%",   notes:11, percentile:96 },
  { id:4,  name:"Aarav Sharma",    avatar:ALL_AVATARS[3],  stream:"nonmedical", streak:47,  xp:4320,  rank:4,  verified:false, challengesWon:0, noteDownloads:1120, city:"Chandigarh",  exam:"JEE 2026",  syllabusPct:64, daysToExam:72, skillLevels:[["Physics",88,"#F59E0B"],["Chemistry",74,"#A78BFA"],["Coding",68,"#FB923C"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],goal:"IIT Bombay — Computer Science",     rankLabel:"Top 12%",  notes:5,  percentile:88 },
  { id:5,  name:"Simran Kaur",     avatar:ALL_AVATARS[4],  stream:"medical",    streak:66,  xp:5640,  rank:5,  verified:true,  challengesWon:1, noteDownloads:2100, city:"Amritsar",    exam:"NEET 2026", syllabusPct:71, daysToExam:48, skillLevels:[["Biology",87,"#34D399"],["Chemistry",78,"#A78BFA"],["Physics",62,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"AIIMS Jodhpur — MBBS",             rankLabel:"Top 8%",   notes:8,  percentile:91 },
  { id:6,  name:"Rohan Desai",     avatar:ALL_AVATARS[5],  stream:"nonmedical", streak:34,  xp:2740,  rank:6,  verified:false, challengesWon:0, noteDownloads:540,  city:"Pune",        exam:"JEE 2026",  syllabusPct:52, daysToExam:72, skillLevels:[["Coding",74,"#FB923C"],["Physics",66,"#F59E0B"],["Maths",61,"#38BDF8"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],goal:"IIT Pune — Electronics",            rankLabel:"Top 24%",  notes:3,  percentile:76 },
  { id:7,  name:"Arjun Nair",      avatar:ALL_AVATARS[6],  stream:"nonmedical", streak:21,  xp:1980,  rank:7,  verified:false, challengesWon:0, noteDownloads:310,  city:"Thrissur",    exam:"JEE 2026",  syllabusPct:44, daysToExam:72, skillLevels:[["Maths",71,"#38BDF8"],["Coding",63,"#FB923C"],["Physics",55,"#F59E0B"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],goal:"NIT Trichy — Mechanical",           rankLabel:"Top 32%",  notes:2,  percentile:68 },
  { id:8,  name:"Kavya Reddy",     avatar:ALL_AVATARS[7],  stream:"medical",    streak:119, xp:10180, rank:2,  verified:true,  challengesWon:3, noteDownloads:4620, city:"Hyderabad",   exam:"NEET 2026", syllabusPct:86, daysToExam:48, skillLevels:[["Biology",93,"#34D399"],["Chemistry",84,"#A78BFA"],["Physics",71,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:true}],  goal:"AIIMS Hyderabad — MBBS",           rankLabel:"Top 1%",   notes:16, percentile:99 },
  { id:9,  name:"Tanvi Shah",      avatar:ALL_AVATARS[8],  stream:"medical",    streak:55,  xp:4890,  rank:8,  verified:false, challengesWon:1, noteDownloads:1680, city:"Ahmedabad",   exam:"NEET 2026", syllabusPct:67, daysToExam:48, skillLevels:[["Chemistry",80,"#A78BFA"],["Biology",76,"#34D399"],["Physics",58,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"BJ Medical College, Ahmedabad",     rankLabel:"Top 15%",  notes:6,  percentile:85 },
  { id:10, name:"Dev Patel",       avatar:ALL_AVATARS[9],  stream:"nonmedical", streak:79,  xp:7340,  rank:4,  verified:true,  challengesWon:2, noteDownloads:2560, city:"Surat",       exam:"JEE 2026",  syllabusPct:76, daysToExam:72, skillLevels:[["Coding",91,"#FB923C"],["Maths",86,"#38BDF8"],["Physics",79,"#F59E0B"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"IIT Delhi — Electrical Engineering", rankLabel:"Top 5%",   notes:9,  percentile:94 },
  { id:11, name:"Ananya Singh",    avatar:ALL_AVATARS[10], stream:"medical",    streak:88,  xp:7920,  rank:3,  verified:true,  challengesWon:2, noteDownloads:3340, city:"Lucknow",     exam:"NEET 2026", syllabusPct:80, daysToExam:48, skillLevels:[["Biology",90,"#34D399"],["Chemistry",82,"#A78BFA"],["Physics",65,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"KGMU Lucknow — MBBS",              rankLabel:"Top 4%",   notes:12, percentile:95 },
  { id:12, name:"Rahul Mehta",     avatar:ALL_AVATARS[11], stream:"nonmedical", streak:43,  xp:3860,  rank:9,  verified:false, challengesWon:0, noteDownloads:780,  city:"Indore",      exam:"JEE 2026",  syllabusPct:58, daysToExam:72, skillLevels:[["Physics",77,"#F59E0B"],["Maths",72,"#38BDF8"],["Coding",65,"#FB923C"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],goal:"IIT Indore — CSE",                  rankLabel:"Top 18%",  notes:4,  percentile:82 },
  { id:13, name:"Shriya Agarwal",  avatar:ALL_AVATARS[12], stream:"medical",    streak:73,  xp:6480,  rank:6,  verified:true,  challengesWon:1, noteDownloads:2420, city:"Agra",        exam:"NEET 2026", syllabusPct:73, daysToExam:48, skillLevels:[["Biology",85,"#34D399"],["Chemistry",79,"#A78BFA"],["Physics",61,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"AIIMS Rishikesh — MBBS",           rankLabel:"Top 7%",   notes:7,  percentile:92 },
  { id:14, name:"Karan Bhatia",    avatar:ALL_AVATARS[13], stream:"nonmedical", streak:61,  xp:5520,  rank:7,  verified:false, challengesWon:1, noteDownloads:1540, city:"Mumbai",      exam:"JEE 2026",  syllabusPct:69, daysToExam:72, skillLevels:[["Physics",83,"#F59E0B"],["Maths",78,"#38BDF8"],["Coding",59,"#FB923C"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"IIT Bombay — Mechanical",          rankLabel:"Top 9%",   notes:5,  percentile:90 },
  { id:15, name:"Meera Pillai",    avatar:ALL_AVATARS[14], stream:"medical",    streak:104, xp:9640,  rank:2,  verified:true,  challengesWon:3, noteDownloads:4100, city:"Trivandrum",  exam:"NEET 2026", syllabusPct:84, daysToExam:48, skillLevels:[["Biology",92,"#34D399"],["Chemistry",86,"#A78BFA"],["Physics",70,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:true}],  goal:"Medical College Thiruvananthapuram", rankLabel:"Top 2%",   notes:15, percentile:98 },
  { id:16, name:"Vivek Rao",       avatar:ALL_AVATARS[15], stream:"nonmedical", streak:38,  xp:3180,  rank:10, verified:false, challengesWon:0, noteDownloads:620,  city:"Bangalore",   exam:"JEE 2026",  syllabusPct:55, daysToExam:72, skillLevels:[["Coding",78,"#FB923C"],["Maths",69,"#38BDF8"],["Physics",57,"#F59E0B"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],goal:"IISc Bangalore — Engineering",      rankLabel:"Top 22%",  notes:3,  percentile:78 },
  { id:17, name:"Pooja Iyer",      avatar:ALL_AVATARS[16], stream:"medical",    streak:82,  xp:7180,  rank:5,  verified:true,  challengesWon:1, noteDownloads:2880, city:"Chennai",     exam:"NEET 2026", syllabusPct:77, daysToExam:48, skillLevels:[["Biology",88,"#34D399"],["Chemistry",81,"#A78BFA"],["Physics",64,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"Madras Medical College",           rankLabel:"Top 6%",   notes:10, percentile:93 },
  { id:18, name:"Siddharth Joshi", avatar:ALL_AVATARS[17], stream:"nonmedical", streak:52,  xp:4640,  rank:8,  verified:false, challengesWon:0, noteDownloads:940,  city:"Nagpur",      exam:"JEE 2026",  syllabusPct:62, daysToExam:72, skillLevels:[["Maths",80,"#38BDF8"],["Physics",73,"#F59E0B"],["Coding",67,"#FB923C"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"VNIT Nagpur — Computer Science",   rankLabel:"Top 16%",  notes:4,  percentile:83 },
  { id:19, name:"Aditi Saxena",    avatar:ALL_AVATARS[18], stream:"medical",    streak:93,  xp:8340,  rank:4,  verified:true,  challengesWon:2, noteDownloads:3560, city:"Varanasi",    exam:"NEET 2026", syllabusPct:81, daysToExam:48, skillLevels:[["Biology",91,"#34D399"],["Chemistry",83,"#A78BFA"],["Physics",68,"#F59E0B"]], streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:true},{day:100,label:"Elite",done:false}], goal:"IMS BHU — MBBS",                   rankLabel:"Top 4%",   notes:13, percentile:95 },
  { id:20, name:"Nikhil Bansal",   avatar:ALL_AVATARS[19], stream:"nonmedical", streak:29,  xp:2320,  rank:11, verified:false, challengesWon:0, noteDownloads:410,  city:"Jodhpur",     exam:"JEE 2026",  syllabusPct:48, daysToExam:72, skillLevels:[["Physics",65,"#F59E0B"],["Maths",60,"#38BDF8"],["Coding",52,"#FB923C"]],    streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:false},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],goal:"IIT Jodhpur — Mechanical",         rankLabel:"Top 38%",  notes:2,  percentile:62 },
];


const FEED_POSTS = [
  // ── QUIZ POSTS ────────────────────────────────────────────────────────────
  { id:1, studentId:1, name:"Priya Menon", avatar:ALL_AVATARS[0], stream:"medical", subject:"🧠 QUIZ TIME · Biology", day:"Day 142", hours:0, xp:0,
    text:"🎯 QUICK QUIZ — answer before scrolling!\n\nQ: Which enzyme is called the 'guardian of the genome'?\n\nA) DNA Polymerase\nB) RNA Polymerase\nC) p53\nD) Helicase\n\n.\n.\n.\n✅ Answer: C) p53 — it's a tumour suppressor protein, not an enzyme per se, but NCERT calls it the 'guardian'. Mutations in p53 = most common cancer mutation. 50% of all human cancers involve p53 damage. This WILL appear in NEET 2026.",
    tags:["#quiz","#biology","#neet","#cancer"], imageUrl:null, likes:1842, comments:312, saves:890, time:"1h ago" },

  { id:2, studentId:3, name:"Ishaan Verma", avatar:ALL_AVATARS[2], stream:"nonmedical", subject:"⚡ QUIZ · Physics", day:"Day 88", hours:0, xp:0,
    text:"JEE TRAP QUESTION 🪤\n\nA ball is dropped from height h. At what height is its KE = 3× its PE?\n\nA) h/4\nB) h/3\nC) 3h/4\nD) h/2\n\n.\n.\n.\n💡 Answer: A) h/4\n\nAt height x: PE = mgx, KE = mg(h-x)\nFor KE = 3×PE: mg(h-x) = 3mgx → h-x = 3x → x = h/4\n\nDon't just memorise — DERIVE IT ONCE and you'll never forget. 🧠",
    tags:["#quiz","#physics","#jee","#energy"], imageUrl:null, likes:2341, comments:478, saves:1120, time:"2h ago" },

  { id:3, studentId:8, name:"Kavya Reddy", avatar:ALL_AVATARS[7], stream:"medical", subject:"🔥 QUIZ · Chemistry", day:"Day 119", hours:0, xp:0,
    text:"POV: It's 2am before NEET and you see this question 😭\n\nQ: Arrange in order of increasing acidic strength:\nCH₃COOH, CCl₃COOH, CF₃COOH, CBr₃COOH\n\n.\n.\n.\n📊 Answer: CH₃COOH < CBr₃COOH < CCl₃COOH < CF₃COOH\n\nKey: electronegativity F>Cl>Br. Higher EN = more electron withdrawal = more stable carboxylate = STRONGER ACID.\n\nF is THE most electronegative element. CF₃COOH = strongest. Don't mix up size with EN! 🎯",
    tags:["#chemistry","#quiz","#neet","#acids"], imageUrl:null, likes:3102, comments:567, saves:1450, time:"3h ago" },

  { id:4, studentId:10, name:"Dev Patel", avatar:ALL_AVATARS[9], stream:"nonmedical", subject:"💻 QUIZ · Coding", day:"Day 79", hours:0, xp:0,
    text:"WHAT'S THE OUTPUT? 😈\n\n```\nfor i in range(3):\n    print(i, end=' ')\n    i = 10\nprint(i)\n```\n\nA) 0 1 2 10\nB) 0 1 2 2\nC) 10 10 10 10\nD) 0 1 2\n\n.\n.\n.\n✅ A) 0 1 2 10\n\nWhy: Reassigning i inside the loop doesn't affect the loop iterator — Python creates a new 'i' each iteration from range(). The last print(i) shows i=10 because the final assignment persists after loop. This is a classic interview trap. 🪤",
    tags:["#coding","#quiz","#python","#jee"], imageUrl:null, likes:1923, comments:289, saves:876, time:"4h ago" },

  // ── DOPAMINE / ACHIEVEMENT POSTS ──────────────────────────────────────────
  { id:5, studentId:1, name:"Priya Menon", avatar:ALL_AVATARS[0], stream:"medical", subject:"🏆 Achievement", day:"Day 142", hours:14, xp:890,
    text:"I JUST SCORED 720/720 IN A MOCK TEST. 🤯\n\nNEET full syllabus mock. 14 hours of revision yesterday. 720 out of 720.\n\nFor anyone who says it's impossible — I'm telling you it's not. Here's what I did this week:\n\n📅 Mon: Full Biology revision + 100 MCQs\n📅 Tue: Organic Chemistry reactions × 3 passes\n📅 Wed: Physics — all formulas, 80 problems\n📅 Thu: Grand mock. 6 hours.\n📅 Fri: Revision of every wrong answer\n\nNEET is 48 days away. Still time. Go.",
    tags:["#neet","#720","#motivation","#grind"], imageUrl:"https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&q=80", likes:8420, comments:1240, saves:3890, time:"5h ago" },

  { id:6, studentId:11, name:"Ananya Singh", avatar:ALL_AVATARS[10], stream:"medical", subject:"🔥 Day Streak", day:"Day 88", hours:8, xp:540,
    text:"88 DAYS. NO BREAKS. 🔥\n\nPeople ask how I stay consistent. Honest answer:\n\nI stopped waiting to 'feel motivated'.\n\nMotivation is a feeling. Discipline is a decision.\n\n🧠 Day 1-7: Felt exciting\n😑 Day 8-30: Felt boring, almost quit\n💀 Day 31-60: Felt impossible\n⚡ Day 61-88: Feels automatic\n\nYou don't build a habit. You become it.\n\nWhat's your current streak? 👇",
    tags:["#streak","#consistency","#neet","#motivation"], imageUrl:null, likes:5621, comments:834, saves:2341, time:"6h ago" },

  { id:7, studentId:3, name:"Ishaan Verma", avatar:ALL_AVATARS[2], stream:"nonmedical", subject:"🚀 Challenge Win", day:"Day 88", hours:0, xp:620,
    text:"WON THE UNACADEMY PHYSICS CHALLENGE. 🥇\n\nRank 1 out of 312 submissions.\n\nBuilt the projectile simulator in React + Canvas API. Got an email from Unacademy HR this morning for an internship interview.\n\nI was just a student 3 months ago.\n\nLearnLoop literally changed the trajectory (pun intended 🎯) of my life.\n\nBuilding in public works. Submit to challenges. GET. SEEN.",
    tags:["#win","#challenge","#coding","#internship"], imageUrl:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80", likes:4231, comments:623, saves:1870, time:"8h ago" },

  // ── EDUCATIONAL / CONCEPT POSTS ───────────────────────────────────────────
  { id:8, studentId:2, name:"Neha Gupta", avatar:ALL_AVATARS[1], stream:"medical", subject:"🧬 Biology · DNA", day:"Day 98", hours:7, xp:460,
    text:"The DNA replication story nobody tells you 🧬\n\nEveryone memorises: 'DNA Pol III extends the chain'\n\nBut WHY can't DNA Pol start from scratch?\n\n→ Because it can ONLY ADD nucleotides to an existing 3'-OH group.\n→ So primase lays down an RNA primer first.\n→ DNA Pol III extends from that.\n→ Later, DNA Pol I removes primer and fills the gap.\n→ Ligase joins the nick.\n\nThis is why Okazaki fragments exist on the lagging strand — because synthesis MUST go 5'→3', but the template goes 3'→5' in that direction.\n\nUnderstand the WHY. The WHAT follows automatically. 🎯",
    tags:["#biology","#dna","#neet","#deeplearning"], imageUrl:"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80", likes:3241, comments:412, saves:1560, time:"10h ago" },

  { id:9, studentId:15, name:"Meera Pillai", avatar:ALL_AVATARS[14], stream:"medical", subject:"⚗️ Chemistry · GOC", day:"Day 104", hours:6, xp:380,
    text:"RESONANCE explained so you never forget it 🎸\n\nMost students memorise resonance structures.\nToppers understand them.\n\nResonance = electron delocalisation through π bonds or lone pairs.\n\n🔥 The more resonating structures = more stable the molecule\n🔥 Resonance hybrid = average of all structures (NOT one switching to another)\n🔥 Benzene doesn't alternate — it's a permanent hybrid\n\nTrick to spot resonance possibility:\n→ Adjacent π bond + lone pair? ✅ Resonance possible\n→ Adjacent π bond + empty orbital? ✅ Resonance possible\n\nAniline: N lone pair delocalised into ring → less basic than expected.\nBenzoic acid: O lone pair delocalised into ring → more acidic.\n\nSame principle. Different outcomes. Master this. 🧠",
    tags:["#chemistry","#goc","#resonance","#neet"], imageUrl:null, likes:2890, comments:378, saves:1340, time:"12h ago" },

  { id:10, studentId:3, name:"Ishaan Verma", avatar:ALL_AVATARS[2], stream:"nonmedical", subject:"📐 Maths · Integration", day:"Day 88", hours:8, xp:510,
    text:"Integration by parts is just the product rule backwards 🤯\n\n∫u·dv = uv - ∫v·du\n\nBut nobody explains HOW to pick u and dv:\n\nILATE rule:\nI → Inverse trig (sin⁻¹x, tan⁻¹x)\nL → Logarithmic (ln x)\nA → Algebraic (xⁿ)\nT → Trigonometric (sin x, cos x)\nE → Exponential (eˣ)\n\nPick the one EARLIER in ILATE as 'u'.\n\nExample: ∫x·eˣdx\nAlgebraic (x) comes before Exponential (eˣ)\nSo u=x, dv=eˣdx\n= x·eˣ - ∫eˣdx = xeˣ - eˣ + C ✅\n\nDid this 3 times, did 30 problems, it's LOCKED. 🔒",
    tags:["#maths","#integration","#jee","#calculus"], imageUrl:null, likes:3456, comments:489, saves:1670, time:"1d ago" },

  { id:11, studentId:19, name:"Aditi Saxena", avatar:ALL_AVATARS[18], stream:"medical", subject:"🔬 Biology · Evolution", day:"Day 93", hours:7, xp:430,
    text:"Evolution in 60 seconds ⚡\n\nDarwin: natural selection. Survive → reproduce → pass traits.\n\nNeo-Darwinism adds: mutation + gene flow + genetic drift + natural selection\n\n🎯 Hardy-Weinberg: allele frequencies DON'T change if:\n- No mutation\n- No selection\n- No migration\n- Random mating\n- Large population\n(Real populations ALWAYS violate at least one)\n\n🎯 Miller-Urey (1953): simulated early Earth atmosphere → amino acids formed → first experimental evidence for chemical origin of life\n\nFun fact: we share 98.5% DNA with chimpanzees and 50% with BANANAS 🍌\n\nNEET loves Hardy-Weinberg calculations. Practice them.",
    tags:["#biology","#evolution","#neet","#facts"], imageUrl:null, likes:2134, comments:287, saves:980, time:"1d ago" },

  { id:12, studentId:10, name:"Dev Patel", avatar:ALL_AVATARS[9], stream:"nonmedical", subject:"💻 DSA · Trees", day:"Day 79", hours:8, xp:520,
    text:"Binary Tree traversals — visualised 🌳\n\nEveryone KNOWS the names. Nobody can DO them under pressure.\n\nTree:     1\n        /   \\\n       2     3\n      / \\   / \\\n     4   5 6   7\n\nInorder   (L→Root→R): 4 2 5 1 6 3 7\nPreorder  (Root→L→R): 1 2 4 5 3 6 7\nPostorder (L→R→Root): 4 5 2 6 7 3 1\n\nMemory trick:\nInorder = Alphabetical (In the middle)\nPreorder = Root FIRST (Pre = before)\nPostorder = Root LAST (Post = after)\n\nNow write it yourself without looking. If you can do it in 30 seconds, you own it. ⏱️",
    tags:["#coding","#trees","#dsa","#jee"], imageUrl:null, likes:2789, comments:356, saves:1230, time:"1d ago" },

  // ── FUN / MEME ENERGY POSTS ───────────────────────────────────────────────
  { id:13, studentId:6, name:"Rohan Desai", avatar:ALL_AVATARS[5], stream:"nonmedical", subject:"😂 Real Talk · JEE Life", day:"Day 34", hours:6, xp:320,
    text:"JEE student life summarised in 4 stages:\n\n📅 July: 'I'll study 14 hours a day, sleep at 10pm, no phone'\n\n📅 September: 'Ok maybe 10 hours, I'll start properly after Dussehra'\n\n📅 January: 'I just need to finish waves and modern physics and calculus and electrochemistry and—'\n\n📅 March: *opens HC Verma at 2am crying* 'I just need to breathe'\n\n———\n\nBut real talk: Day 34 here. Still going. Still logging. Still showing up.\n\nThe students who make it aren't the smartest. They're the ones who didn't quit on the dark days.\n\nDay 34. 🔥",
    tags:["#jee","#relatable","#streak","#grind"], imageUrl:null, likes:7823, comments:1120, saves:2340, time:"2d ago" },

  { id:14, studentId:5, name:"Simran Kaur", avatar:ALL_AVATARS[4], stream:"medical", subject:"😭 NEET Life", day:"Day 66", hours:7, xp:420,
    text:"Things NEET students say vs what they mean:\n\n'I'm just going to revise quickly' → 7 hour session\n\n'I'll start properly after this one YouTube video' → it's 3am\n\n'I think I understand Genetics' → fails every Hardy-Weinberg question\n\n'I'm not even stressed about NEET' → stress-eats entire pack of biscuits during break\n\n'One more mock and I'm done for the day' → currently on mock #4\n\n———\nDay 66. Still here. Still breathing. \n\nAlso genuinely — share your revision tip below 👇 the comments on my last post had SO many gold nuggets.",
    tags:["#neet","#relatable","#funnybutreal","#medical"], imageUrl:null, likes:9234, comments:1456, saves:3120, time:"2d ago" },

  { id:15, studentId:20, name:"Nikhil Bansal", avatar:ALL_AVATARS[19], stream:"nonmedical", subject:"😤 Day 29 Energy", day:"Day 29", hours:5, xp:240,
    text:"Nobody talks about Day 20-40 of JEE prep.\n\nDay 1-10: excited, motivated, 'THIS IS MY YEAR'\n\nDay 20-40: everything is confusing, you feel dumb, you question your entire existence\n\nDay 29 here. Physics formulas feel like a different language. Maths problems feel impossible.\n\nBut I found something that helps:\n\nI stopped comparing my Chapter 1 to someone else's Chapter 20.\n\nI'm building the foundation. The structure comes later.\n\nDay 29. Small. Consistent. Unbroken.\n\n(If you're also struggling in early days — comment 🙋 so we can suffer together 😭)",
    tags:["#jee","#day29","#beginners","#motivation"], imageUrl:null, likes:4521, comments:678, saves:1890, time:"2d ago" },

  // ── STUDY TIPS / HACKS ────────────────────────────────────────────────────
  { id:16, studentId:17, name:"Pooja Iyer", avatar:ALL_AVATARS[16], stream:"medical", subject:"📚 Study Hack", day:"Day 82", hours:8, xp:490,
    text:"The '3-2-1 revision method' that took my biology score from 65% to 92% 📈\n\n3 days after learning: write the topic from memory (no book)\n2 days later: only review what you couldn't recall\n1 day before exam: one final skim of the whole topic\n\nThis is spaced repetition. Your brain NEEDS the forgetting and re-learning cycle to form long-term memory.\n\nBonus: for NEET Biology specifically —\n→ NCERT line-by-line is non-negotiable\n→ Diagrams from memory beat any amount of reading\n→ MCQs expose gaps; reading creates false confidence\n\nWhich subject do you struggle most with? 👇",
    tags:["#studytip","#neet","#biology","#revision"], imageUrl:"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=700&q=80", likes:5678, comments:789, saves:2567, time:"2d ago" },

  { id:17, studentId:13, name:"Shriya Agarwal", avatar:ALL_AVATARS[12], stream:"medical", subject:"⏰ Study Schedule", day:"Day 73", hours:9, xp:560,
    text:"My EXACT daily schedule for NEET revision (sharing because it actually works):\n\n5:30am → Wake. No phone. Drink water.\n6:00am → Biology (freshest brain = hardest subject)\n9:00am → Break + breakfast\n9:30am → Chemistry (organic focus)\n12:00pm → 30 min walk (not optional — blood flow = brain function)\n12:30pm → Physics MCQs (100 problems)\n2:30pm → Lunch + 20 min nap\n3:00pm → Mock test section (1 subject)\n5:00pm → Mistake analysis (most important part)\n7:00pm → Rapid revision — flashcards\n9:00pm → Done. No studying after 9pm.\n\nTotal: ~12 hours of actual work.\n\nSleep 10pm → 5:30am = 7.5hrs. Non-negotiable.\n\nSave this. Adjust to your timeline. Start tomorrow.",
    tags:["#schedule","#neet","#productivity","#routine"], imageUrl:null, likes:6789, comments:892, saves:3456, time:"3d ago" },

  { id:18, studentId:9, name:"Tanvi Shah", avatar:ALL_AVATARS[8], stream:"medical", subject:"🧠 Memory Hack", day:"Day 55", hours:6, xp:360,
    text:"How to memorise the KREBS CYCLE in 10 minutes 🔥\n\nForget the mnemonic. Here's the logic:\n\nAcetyl-CoA (2C) + Oxaloacetate (4C) → Citrate (6C)\n↓ lose CO₂ → 5C\n↓ lose CO₂ → 4C (succinate area)\n↓ eventually regenerates Oxaloacetate (4C)\n\nThe CYCLE exists to strip electrons (as NADH/FADH₂) from carbon compounds. Those electrons go to ETC to make ATP.\n\nOne turn = 2CO₂ released, 3NADH, 1FADH₂, 1 GTP\n\nFor complete glucose: ×2 (because 1 glucose = 2 pyruvate = 2 acetyl-CoA)\n\nNow draw it from memory. Bet you can. 🎯",
    tags:["#biology","#krebs","#neet","#memory"], imageUrl:null, likes:3456, comments:456, saves:1678, time:"3d ago" },

  { id:19, studentId:12, name:"Rahul Mehta", avatar:ALL_AVATARS[11], stream:"nonmedical", subject:"📐 Maths Trick", day:"Day 43", hours:6, xp:380,
    text:"JEE shortcut that saved me 90 seconds per question ⏱\n\nFor limits of form 1^∞ (indeterminate):\n\nlim [f(x)]^g(x) where f(x)→1, g(x)→∞\n\nAnswer = e^[lim (f(x)-1)·g(x)]\n\nExample: lim(x→0) (1+x)^(1/x) = e^[lim x·(1/x)] = e^1 = e\n\nExample: lim(x→0) (cos x)^(1/x²)\n= e^[lim (cos x - 1)/x²]\n= e^[lim (-x²/2)/x²] (using cos x ≈ 1 - x²/2)\n= e^(-1/2)\n\nJEE 2023 had 2 questions using exactly this form. You're welcome. 🤝",
    tags:["#maths","#limits","#jee","#shortcut"], imageUrl:null, likes:4123, comments:534, saves:1890, time:"3d ago" },

  // ── ANXIETY / EMOTIONAL SUPPORT ───────────────────────────────────────────
  { id:20, studentId:5, name:"Simran Kaur", avatar:ALL_AVATARS[4], stream:"medical", subject:"💙 Mental Health", day:"Day 66", hours:0, xp:0,
    text:"Posting this because someone needs to hear it today:\n\nYou are NOT behind.\n\nThere is no 'ideal' NEET/JEE student.\nThere is no 'correct' number of hours.\nThere is no 'perfect' schedule.\n\nThere is only:\n→ The work you did today\n→ The work you'll do tomorrow\n\nI cried in the bathroom after a mock test last week. 54%. Worst score in months.\n\nI didn't quit. I analysed every mistake. I went back to basics.\n\nThat's it. That's the whole secret.\n\nIf you're struggling today — you're normal. You're not weak. You're human.\n\nDrop a 🤝 in the comments if you needed this.",
    tags:["#mentalhealth","#neet","#youvegotthis","#realpost"], imageUrl:null, likes:12340, comments:2341, saves:5670, time:"4d ago" },

  // ── MORE QUIZZES ──────────────────────────────────────────────────────────
  { id:21, studentId:15, name:"Meera Pillai", avatar:ALL_AVATARS[14], stream:"medical", subject:"🎯 NEET Trap Question", day:"Day 104", hours:0, xp:0,
    text:"96% of students get this wrong. Are you in the 4%? 🤔\n\nQ: Which of the following is NOT a part of the endomembrane system?\n\nA) Endoplasmic Reticulum\nB) Golgi Apparatus\nC) Mitochondria\nD) Vacuoles\n\n.\n.\n.\n✅ Answer: C) Mitochondria\n\nThe endomembrane system = ER + Golgi + Lysosomes + Vacuoles + Plasma membrane\n\nMitochondria and Chloroplasts are NOT part of it — they have their own origin story (endosymbiont theory) and their own DNA.\n\nThis exact MCQ appeared in NEET 2022. How'd you do? 👇",
    tags:["#quiz","#biology","#neet","#cell"], imageUrl:null, likes:4567, comments:678, saves:2134, time:"4d ago" },

  { id:22, studentId:14, name:"Karan Bhatia", avatar:ALL_AVATARS[13], stream:"nonmedical", subject:"⚡ Physics Trap", day:"Day 61", hours:0, xp:0,
    text:"This question DESTROYED me in JEE mock. Don't let it destroy you 😤\n\nQ: A charged particle moves in a magnetic field. The work done by the magnetic force on it is:\n\nA) Always positive\nB) Always negative\nC) Always zero\nD) Depends on the charge\n\n.\n.\n.\n⚡ Answer: C) Always ZERO\n\nWhy: Magnetic force (F = qv×B) is ALWAYS perpendicular to velocity. \nW = F·d·cosθ. If θ = 90°, cos90° = 0.\nNo work done = no change in KE = no change in SPEED.\n\nThe particle changes DIRECTION but not speed in a magnetic field.\nThis is why it moves in a circle — constant speed, changing direction.\n\nHOW MANY of you got it right? 🙋",
    tags:["#physics","#magnetism","#jee","#quiz"], imageUrl:null, likes:3789, comments:512, saves:1456, time:"4d ago" },

  // ── FACTS + WOW POSTS ─────────────────────────────────────────────────────
  { id:23, studentId:19, name:"Aditi Saxena", avatar:ALL_AVATARS[18], stream:"medical", subject:"🤯 Biology Facts", day:"Day 93", hours:0, xp:0,
    text:"Biology facts that sound made up but are 100% NCERT 🤯\n\n1. You have enough DNA in your body to stretch to the sun and back 600 times\n\n2. Your stomach gets a new lining every 3-4 days (stomach acid would digest itself otherwise)\n\n3. The human eye can distinguish ~10 million colours\n\n4. Neurons can transmit signals at 120 m/s — that's 432 km/h\n\n5. Every 3-4 days, all your white blood cells are replaced\n\n6. The cornea is the only tissue in the body with NO blood supply (gets O₂ directly from air)\n\n#6 is a NEET favourite. Don't sleep on it.\n\nWhich one shocked you most? 👇",
    tags:["#biology","#facts","#neet","#mindblown"], imageUrl:null, likes:8901, comments:1234, saves:3456, time:"5d ago" },

  { id:24, studentId:16, name:"Vivek Rao", avatar:ALL_AVATARS[15], stream:"nonmedical", subject:"🤯 Physics Wow", day:"Day 38", hours:5, xp:300,
    text:"Physics facts that broke my brain 🧠💥\n\n⚡ If you removed all empty space from atoms in all humans on Earth, we'd all fit in a sugar cube\n\n⚡ Light travels from the Sun to Earth in 8 minutes, but takes 100,000 years to travel from the sun's CORE to its surface\n\n⚡ A neutron star is so dense, a teaspoon weighs ~1 billion tonnes\n\n⚡ Heisenberg Uncertainty Principle: you CANNOT simultaneously know a particle's exact position AND momentum. It's not an equipment problem — it's a fundamental law of the universe\n\n⚡ The double-slit experiment proves that observation itself affects reality\n\nPhysics isn't hard. It's WEIRD. And weird things are fun to learn. 🎯",
    tags:["#physics","#facts","#jee","#quantum"], imageUrl:null, likes:6234, comments:789, saves:2341, time:"5d ago" },

  // ── MILESTONE + COMMUNITY ─────────────────────────────────────────────────
  { id:25, studentId:4, name:"Aarav Sharma", avatar:ALL_AVATARS[3], stream:"nonmedical", subject:"🎯 Progress Check", day:"Day 47", hours:6, xp:320,
    text:"Honest 47-day progress report 📊\n\nWhat I said I'd do:\n✅ 10 hours/day\n✅ All of Physics\n✅ 200 problems/week\n\nWhat actually happened:\n→ Average 6.2 hours/day (real, tracked)\n→ Physics 78% done (skipped some chapters twice)\n→ ~140 problems/week\n\nAnd you know what? I'm STILL ahead of where I was.\n\nPerfect plans don't survive contact with reality.\nBut SHOWING UP every day? That compounds.\n\n47 days × 6 hours = 282 hours of JEE prep.\n\nThat's real. That's mine. Nobody can take it.\n\nHow's your prep going? Be honest 👇 (no judgement zone)",
    tags:["#jee","#progress","#honest","#day47"], imageUrl:null, likes:3456, comments:567, saves:1234, time:"5d ago" },

  { id:26, studentId:8, name:"Kavya Reddy", avatar:ALL_AVATARS[7], stream:"medical", subject:"🏆 Notes Drop", day:"Day 119", hours:0, xp:0,
    text:"DROPPING MY FULL BIOLOGY NOTES — FREE 🎁\n\n📚 What's included:\n→ Cell Biology (all organelles, functions, differences)\n→ Genetics (Mendelian + molecular)\n→ Human Physiology (all systems, 1-pager each)\n→ Plant Physiology (photosynthesis, respiration, transport)\n→ Ecology (all 3 chapters)\n→ Evolution + Biotech\n\n4,200+ students downloaded last time. Updated for NEET 2026.\n\nComment 📥 below and I'll DM the link.\n\nOne condition: if these notes help you, share them with ONE more student who can't afford coaching.\n\nKnowledge shared is knowledge doubled. 💙",
    tags:["#notes","#neet","#free","#biology"], imageUrl:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80", likes:11234, comments:3456, saves:7890, time:"6d ago" },

  // ── MORE EDUCATIONAL QUIZZES ──────────────────────────────────────────────
  { id:27, studentId:11, name:"Ananya Singh", avatar:ALL_AVATARS[10], stream:"medical", subject:"🎯 NEET 2023 Repeat", day:"Day 88", hours:0, xp:0,
    text:"This exact question appeared in NEET 2023 and will probably appear again:\n\nQ: Assertion (A): Ribosomes are found on rough ER\nReason (R): Ribosomes synthesise proteins that are secreted outside the cell\n\nA) Both A and R are true; R is the correct explanation of A\nB) Both A and R are true; R is NOT the correct explanation of A\nC) A is true but R is false\nD) A is false but R is true\n\n.\n.\n✅ Answer: B\n\nWhy: A is true (ribosomes ARE on RER). R is also true (RER proteins are mostly for secretion/membrane). BUT R doesn't fully explain A — ribosomes also exist on free ribosomes (not on ER) for cytosolic proteins. The Reason doesn't correctly explain the Assertion.\n\nAssertion-Reason = 4 marks = NEVER skip. 🎯",
    tags:["#neet","#quiz","#assertionreason","#biology"], imageUrl:null, likes:5678, comments:789, saves:2345, time:"6d ago" },

  { id:28, studentId:2, name:"Neha Gupta", avatar:ALL_AVATARS[1], stream:"medical", subject:"🧪 Chemistry Speed Round", day:"Day 98", hours:0, xp:0,
    text:"SPEED ROUND — answer in your head, no cheating 🏃\n\n1. Inert pair effect is most prominent in: Group 13/14/15?\n2. Which has highest lattice energy: NaCl, MgO, CaO?\n3. Colour of [Cu(NH₃)₄]²⁺ complex: Blue/Green/Colourless?\n4. Bleaching powder formula: Ca(OCl)Cl or CaOCl₂?\n5. IUPAC name of CHCl₃: ?\n\n.\n.\n.\n✅ Answers:\n1. Group 14 (Pb, Sn show it most)\n2. MgO (higher charge, smaller ions = stronger lattice)\n3. Deep Blue (used to test for Cu²⁺ ions)\n4. Ca(OCl)Cl is correct! CaOCl₂ is a common wrong formula.\n5. Trichloromethane\n\nHow many did you get? 5/5 = NEET ready 💪",
    tags:["#chemistry","#quiz","#neet","#speedround"], imageUrl:null, likes:4567, comments:678, saves:1890, time:"1w ago" },

  // ── CONCEPT DEEP DIVES ────────────────────────────────────────────────────
  { id:29, studentId:17, name:"Pooja Iyer", avatar:ALL_AVATARS[16], stream:"medical", subject:"🌿 Plant Bio · Explained", day:"Day 82", hours:7, xp:440,
    text:"Why plants don't 'breathe' the same way animals do 🌿\n\nAnimals: O₂ in → CO₂ out (always)\n\nPlants: It DEPENDS on light! 🤯\n\n☀️ In sunlight:\n→ Photosynthesis > Respiration\n→ Net: CO₂ absorbed, O₂ released\n→ What you see in textbook diagrams\n\n🌙 At night:\n→ Only respiration happens\n→ Net: O₂ absorbed, CO₂ released\n→ Why sleeping under trees at night is not ideal\n\n🌤️ Compensation point:\n→ Where photosynthesis rate = respiration rate\n→ Net gas exchange = ZERO\n\nThis is also why CAM plants (cacti, succulents) open stomata only at night — to minimise water loss while still absorbing CO₂.\n\nThis single concept = 3-4 NEET questions every year. 🎯",
    tags:["#biology","#plants","#neet","#photosynthesis"], imageUrl:"https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=700&q=80", likes:3456, comments:456, saves:1567, time:"1w ago" },

  { id:30, studentId:18, name:"Siddharth Joshi", avatar:ALL_AVATARS[17], stream:"nonmedical", subject:"📡 Physics · Waves", day:"Day 52", hours:7, xp:430,
    text:"The Doppler Effect explained with cricket 🏏\n\nYou're at a cricket stadium. Bowler running towards you:\n→ Sound waves compressed → higher pitch (frequency increases)\n\nBowler running away from you:\n→ Sound waves stretched → lower pitch (frequency decreases)\n\nFormula: f' = f × (v ± v_observer)/(v ∓ v_source)\n\nTrick for signs:\n+ for numerator when observer moves TOWARDS source\n+ for denominator when source moves AWAY from observer\n(Opposite signs for approaching = higher frequency)\n\n🚑 Ambulance approaching: high pitch siren\n🚑 Ambulance receding: low pitch siren\n\nThis is also why the universe expanding means galaxies show redshift — light waves stretched = lower frequency = shifts toward red.\n\nSame physics. Different scale. 🌌",
    tags:["#physics","#doppler","#jee","#waves"], imageUrl:null, likes:2890, comments:378, saves:1234, time:"1w ago" },

  // ── LATE NIGHT POSTS ──────────────────────────────────────────────────────
  { id:31, studentId:7, name:"Arjun Nair", avatar:ALL_AVATARS[6], stream:"nonmedical", subject:"🌙 2am Post", day:"Day 21", hours:5, xp:240,
    text:"It's 2am and I just had a breakthrough 🌙\n\nI've been stuck on projectile motion for 3 days.\n\nJust now: I stopped trying to memorise the formula and just derived it from F=ma.\n\nHorizontal: no force → a=0 → x = u·cosθ·t\nVertical: gravity → a=-g → y = u·sinθ·t - ½gt²\n\nEliminate t, you get the trajectory equation.\n\nRange = u²sin2θ/g (maximum at θ=45°)\n\nI always wondered why 45° gives max range. Now I know:\nsin2θ is maximum when 2θ=90°, so θ=45°.\n\nIT'S JUST TRIGONOMETRY.\n\nDay 21. Still building. Slowly understanding WHY things work, not just WHAT they are.\n\nGoodnight everyone 🌙",
    tags:["#jee","#projectile","#breakthrough","#latenight"], imageUrl:null, likes:4523, comments:567, saves:1890, time:"1w ago" },

  { id:32, studentId:9, name:"Tanvi Shah", avatar:ALL_AVATARS[8], stream:"medical", subject:"😭 Honest Post", day:"Day 55", hours:0, xp:0,
    text:"Okay real talk at 1am:\n\nI failed my unit test today. 52%. Cut-off was 60%.\n\nAnd I know EXACTLY why. I skipped the exception cases in coordination compounds because 'they probably won't ask exceptions'.\n\nThey asked 2 questions on exceptions.\n\nLesson:\nIn NEET Chemistry, the exceptions ARE the syllabus.\n— CuSO₄ is blue but CuSO₄·5H₂O is also blue\n— Anhydrous CoCl₂ is blue, hydrated is pink (used in humidity indicators)\n— Fe₂O₃ red but Fe₃O₄ is black\n— Exceptions to Markovnikov, exceptions to Huckel rule...\n\nI'm making a dedicated 'Exceptions Notebook' tomorrow.\n\nFailing a mock is data, not destiny. 💙\n\nAnyone else keeping an exceptions list? What's yours?",
    tags:["#neet","#chemistry","#realtalk","#exceptions"], imageUrl:null, likes:6789, comments:1012, saves:2345, time:"1w ago" },

  // ── CHALLENGE ENERGY ──────────────────────────────────────────────────────
  { id:33, studentId:4, name:"Aarav Sharma", avatar:ALL_AVATARS[3], stream:"nonmedical", subject:"⚡ Challenge Submitted", day:"Day 41", hours:7, xp:420,
    text:"JUST SUBMITTED TO THE NVIDIA CHALLENGE 🚀\n\nBuilt an AI study scheduler in React. It takes:\n→ Your exam date\n→ Your weak subjects (from mock test data)\n→ Daily available hours\n\nAnd generates a personalised, weighted revision plan that front-loads weak areas.\n\nIt's not perfect. But it's real. It works. I built it.\n\nStarted from zero React knowledge 6 weeks ago.\n\n312 other students submitted. Top 10% gets an interview with NVIDIA's India team.\n\nWhether I win or not — I built something real, learned React for real, and showed myself I can ship under pressure.\n\nThat's already the win. 🎯\n\nGitHub link in bio.",
    tags:["#nvidia","#challenge","#jee","#coding","#shipped"], imageUrl:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80", likes:5678, comments:789, saves:2341, time:"1w ago" },

  // ── MORE QUIZZES ──────────────────────────────────────────────────────────
  { id:34, studentId:13, name:"Shriya Agarwal", avatar:ALL_AVATARS[12], stream:"medical", subject:"🎯 5-Second NEET Quiz", day:"Day 73", hours:0, xp:0,
    text:"5 questions. 5 seconds each. GO. ⏱️\n\n1. Which vitamin is synthesised by gut bacteria? __\n2. Which enzyme converts fibrinogen → fibrin? __\n3. What is the full form of ATP? __\n4. Which gas causes Greenhouse effect the most? __\n5. How many chromosomes in a human gamete? __\n\n.\n.\n.\n✅ ANSWERS:\n1. Vitamin K (also B12 partially)\n2. Thrombin\n3. Adenosine Triphosphate\n4. Water vapour (CO₂ is second — most students say CO₂ wrongly)\n5. 23 (haploid)\n\n#4 is the most common wrong answer in NEET. Most people say CO₂. It's actually water vapour. 🤯\n\nScore below 👇",
    tags:["#quiz","#neet","#biology","#quickfire"], imageUrl:null, likes:7890, comments:1234, saves:3456, time:"2w ago" },

  { id:35, studentId:14, name:"Karan Bhatia", avatar:ALL_AVATARS[13], stream:"nonmedical", subject:"📐 Maths Mystery", day:"Day 61", hours:0, xp:0,
    text:"WARNING: This will make your head hurt (in a good way) 🤯\n\ni² = -1\n\nSo what is i^i ? (i to the power of i)\n\nMost people: 'it should be negative? or imaginary?'\n\nActual answer: i^i is REAL! And it equals approximately 0.2079...\n\nHere's why:\ni = e^(iπ/2) [Euler's formula: e^(iθ) = cosθ + i·sinθ, at θ=π/2: cos(π/2)+i·sin(π/2)=i]\n\nSo i^i = (e^(iπ/2))^i = e^(i²π/2) = e^(-π/2) ≈ 0.2079\n\nAn imaginary number raised to an imaginary power = REAL number. 🤯\n\nMathematics is the most insane subject and I love it.\n\nJEE doesn't ask this directly but Euler's formula shows up in Complex Numbers. Master it.",
    tags:["#maths","#complex","#jee","#mindblown"], imageUrl:null, likes:5423, comments:678, saves:2123, time:"2w ago" },

  // ── BOARD EXAM RELEVANT ───────────────────────────────────────────────────
  { id:36, studentId:11, name:"Ananya Singh", avatar:ALL_AVATARS[10], stream:"medical", subject:"📋 NCERT Hacks", day:"Day 88", hours:0, xp:0,
    text:"NCERT lines that ALWAYS come in NEET (screenshot this) 📸\n\n🔬 'Ribosomes are the site of protein synthesis' — basic but 2 marks guaranteed\n\n🔬 'Cell is the structural and functional unit of life' — 100% will come\n\n🔬 'DNA is the genetic material in most organisms' — keyword: MOST (some viruses use RNA)\n\n🔬 'Mitochondria is the powerhouse of the cell' — BUT chloroplast is the 'kitchen'\n\n🔬 'Plasma membrane is selectively permeable' — selective permeability = key word\n\n🔬 'Active transport requires ATP' — passive transport does NOT\n\nNEET is 90% NCERT. Read it like scripture.\nUnderline. Reread. Test yourself.\n\nThe topper's secret isn't some special book — it's NCERT read 4+ times.",
    tags:["#ncert","#neet","#biology","#essentials"], imageUrl:null, likes:9876, comments:1456, saves:4567, time:"2w ago" },

  { id:37, studentId:12, name:"Rahul Mehta", avatar:ALL_AVATARS[11], stream:"nonmedical", subject:"⚛️ Physics Concept", day:"Day 43", hours:6, xp:380,
    text:"The ONE concept that connects ALL of modern physics:\n\nEnergy is QUANTIZED 🔢\n\nNewton thought energy was continuous.\nMax Planck said: no, it comes in packets. E = hf.\n\nThis ONE idea explains:\n→ Photoelectric effect (Einstein — Nobel 1921)\n→ Atomic spectra (Bohr model)\n→ Blackbody radiation\n→ Lasers\n→ Semiconductors (your phone exists because of this)\n→ MRI machines\n→ Solar panels\n\nPlanck's constant h = 6.626 × 10⁻³⁴ J·s\n\nThe universe has a minimum 'unit' of energy. Everything beyond that is just multiples.\n\nWhen you understand this, Modern Physics goes from 'memorise formulas' to 'obvious consequences of one idea'.",
    tags:["#physics","#quantam","#jee","#concept"], imageUrl:null, likes:4234, comments:567, saves:1789, time:"2w ago" },

  // ── FUN CHALLENGES / GAMES ────────────────────────────────────────────────
  { id:38, studentId:1, name:"Priya Menon", avatar:ALL_AVATARS[0], stream:"medical", subject:"🎮 Reflex Quiz", day:"Day 142", hours:0, xp:0,
    text:"FIRST PERSON TO ANSWER WINS 🎮\n\nNo googling. Pure memory.\n\nName:\n1. The anticodon for AUG (start codon)\n2. The scientist who proposed fluid mosaic model\n3. The enzyme that adds telomeres\n4. Which plant hormone causes apical dominance?\n5. What is the pH of human blood?\n\nTag a friend who knows all 5. 👇\n.\n.\n.\nANSWERS (check yourself):\n1. UAC (on tRNA)\n2. Singer and Nicolson (1972)\n3. Telomerase\n4. Auxin (IAA)\n5. 7.35–7.45 (slightly basic)\n\nBonus: if blood pH drops below 7.35 = ACIDOSIS. Above 7.45 = ALKALOSIS. Both dangerous. Lungs + kidneys maintain it. This is a NEET favourite every year.",
    tags:["#quiz","#neet","#biology","#challenge"], imageUrl:null, likes:8234, comments:2341, saves:3456, time:"3w ago" },
];


const CHALLENGES = [
  { id:1, type:"company", sponsor:"Unacademy", sponsorLogo:"🎓", title:"Build a Physics Simulation Tool",   tagline:"Visualise projectile motion interactively",     reward:"Internship interview + ₹20,000 stipend", rewardType:"internship", prize:"₹20,000", deadline:"5 days",  daysLeft:5,  participants:312, skills:["Physics","Coding"],        difficulty:"hard",   category:"build",    xpReward:500, stream:"nonmedical", description:"Design and build an interactive simulation that visualises projectile motion with variable initial velocity, angle, and gravity.", requirements:["Interactive simulation (web or mobile)","Variable inputs: velocity, angle, gravity","Real-time trajectory graph","Clean, student-friendly UI"], format:"code",     evalCriteria:["Accuracy of physics (30%)","UI/UX quality (25%)","Code quality (25%)","Creativity (20%)"],            liveBoard:[{name:"Arjun Nair",  avatar:ALL_AVATARS[6],xp:320},{name:"Rohan Desai",  avatar:ALL_AVATARS[5],xp:295},{name:"Ishaan Verma",avatar:ALL_AVATARS[2],xp:280}] },
  { id:2, type:"company", sponsor:"Scale AI",  sponsorLogo:"🤖", title:"NEET MCQ Quality Audit",           tagline:"Validate 200 AI-generated biology questions",   reward:"₹8,000 + Research Assistant interview",  rewardType:"bounty",     prize:"₹8,000",  deadline:"3 days",  daysLeft:3,  participants:189, skills:["Biology","Research"],      difficulty:"medium", category:"research", xpReward:300, stream:"medical",    description:"Review 200 AI-generated NEET Biology MCQs. Flag errors, suggest corrections, and rate question difficulty.",                                         requirements:["Accuracy check against NCERT","Difficulty rating (1-5)","Correction notes where needed","Structured CSV submission"],           format:"research", evalCriteria:["Accuracy of corrections (40%)","Consistency of ratings (30%)","Depth of notes (20%)","Completeness (10%)"],         liveBoard:[{name:"Priya Menon", avatar:ALL_AVATARS[0],xp:410},{name:"Simran Kaur",  avatar:ALL_AVATARS[4],xp:375},{name:"Neha Gupta",   avatar:ALL_AVATARS[1],xp:340}] },
  { id:3, type:"company", sponsor:"NVIDIA",    sponsorLogo:"⚡", title:"AI-Powered Study Scheduler",       tagline:"Build an adaptive study planner for JEE",       reward:"₹50,000 + NVIDIA internship track",      rewardType:"internship", prize:"₹50,000", deadline:"12 days", daysLeft:12, participants:541, skills:["Coding","Maths","Physics"], difficulty:"hard",   category:"build",    xpReward:800, stream:"nonmedical", description:"Build an AI-powered study scheduler that takes a student's weak subjects, daily hours, and exam date — then generates an optimised revision plan.",  requirements:["Input: subjects, hours, exam date","Output: weekly study plan","Adaptive to weak areas","Clean and usable interface"],           format:"code",     evalCriteria:["Algorithm quality (35%)","UX / usability (25%)","Practical value (25%)","Bonus: AI integration (15%)"],     liveBoard:[{name:"Ishaan Verma",avatar:ALL_AVATARS[2],xp:620},{name:"Arjun Nair",   avatar:ALL_AVATARS[6],xp:580},{name:"Rohan Desai",  avatar:ALL_AVATARS[5],xp:510}] },
  { id:4, type:"weekly",  sponsor:null,        sponsorLogo:"🔥", title:"Best Organic Chemistry Summary",   tagline:"Write the clearest GOC explanation in 500 words",reward:"+300 XP + Knowledge Contributor badge",  rewardType:"xp",         prize:"300 XP",  deadline:"2 days",  daysLeft:2,  participants:97,  skills:["Chemistry","Organic Chem"],difficulty:"easy",   category:"notes",    xpReward:300, stream:"medical",    description:"Write the clearest, most student-friendly summary of GOC concepts in under 500 words. Voted by the community.",                                      requirements:["Under 500 words","Cover reaction mechanisms","Must include SN1/SN2 distinction","Plain language for students"],                format:"notes",    evalCriteria:["Clarity (40%)","Accuracy (30%)","Community votes (30%)"],                                                              liveBoard:[{name:"Neha Gupta",  avatar:ALL_AVATARS[1],xp:210},{name:"Priya Menon",  avatar:ALL_AVATARS[0],xp:185},{name:"Simran Kaur",  avatar:ALL_AVATARS[4],xp:160}] },
  { id:5, type:"weekly",  sponsor:null,        sponsorLogo:"⚡", title:"Solve 5 JEE Mechanics Problems",   tagline:"Speed + accuracy — fastest correct solutions win",reward:"+150 XP + Fast Builder badge",           rewardType:"xp",         prize:"150 XP",  deadline:"1 day",   daysLeft:1,  participants:428, skills:["Physics","Maths"],         difficulty:"medium", category:"solve",    xpReward:150, stream:"nonmedical", description:"Solve all 5 JEE Advanced-level Mechanics problems. Scored on accuracy first, then time.",                                                          requirements:["All 5 problems attempted","Show working / reasoning","Submitted within deadline","Accurate final answers"],                  format:"solve",    evalCriteria:["Accuracy (60%)","Time taken (25%)","Clarity of working (15%)"],                                                        liveBoard:[{name:"Aarav Sharma",avatar:ALL_AVATARS[3],xp:145},{name:"Rohan Desai",  avatar:ALL_AVATARS[5],xp:132},{name:"Arjun Nair",   avatar:ALL_AVATARS[6],xp:118}] },
  { id:6, type:"company", sponsor:"Embibe",    sponsorLogo:"📊", title:"Student Learning Pattern Analysis",tagline:"Analyse mock test data, identify weak clusters",  reward:"Analytics Fellow fast-track + ₹12,000",  rewardType:"internship", prize:"₹12,000", deadline:"8 days",  daysLeft:8,  participants:143, skills:["Maths","Research","Coding"],difficulty:"hard",   category:"research", xpReward:400, stream:"nonmedical", description:"Given a mock dataset of 500 JEE mock test results, identify patterns in topic-wise performance and propose study recommendations.",                  requirements:["Analyse provided dataset (CSV)","Identify top 5 weak topic clusters","Visualise patterns","Submit 1-page recommendation"], format:"research", evalCriteria:["Insight quality (35%)","Data accuracy (30%)","Visualisation clarity (20%)","Report writing (15%)"],  liveBoard:[{name:"Ishaan Verma",avatar:ALL_AVATARS[2],xp:380},{name:"Aarav Sharma",avatar:ALL_AVATARS[3],xp:320},{name:"Rohan Desai",  avatar:ALL_AVATARS[5],xp:270}] },
];

const INIT_SUBMISSIONS = [
  { id:1, challengeId:1, studentId:3, title:"PhysicsSim.js — WebGL Trajectory Tool", desc:"Built a real-time WebGL simulation with adjustable gravity, angle, and air resistance. Supports multiple projectile comparison.", votes:142, comments:[{name:"Aarav Sharma",avatar:ALL_AVATARS[3],text:"This is really clean — learning from this!",time:"1h ago"}], xpEarned:380, rank:1, timeAgo:"2h ago", tags:["#coding","#physics","#webgl"], featured:true,  votedBy:[] },
  { id:2, challengeId:1, studentId:4, title:"React Physics Playground",              desc:"A React component with Recharts for trajectory graphing. Clean UI, mobile-responsive. Uses basic kinematics equations.",            votes:97,  comments:[{name:"Priya Menon",avatar:ALL_AVATARS[0],text:"Great use of Recharts here!",  time:"3h ago"}], xpEarned:320, rank:2, timeAgo:"5h ago", tags:["#react","#physics","#jee"],   featured:false, votedBy:[] },
  { id:3, challengeId:2, studentId:1, title:"NEET MCQ Audit Report — 200 Questions", desc:"Completed full audit. Found 23 factual errors, 14 NCERT misalignments. Provided corrected versions and difficulty map.",            votes:218, comments:[{name:"Neha Gupta", avatar:ALL_AVATARS[1],text:"Incredible work — very detailed!", time:"2h ago"}], xpEarned:410, rank:1, timeAgo:"1h ago", tags:["#biology","#neet","#research"],featured:true,  votedBy:[] },
  { id:4, challengeId:4, studentId:2, title:"GOC in Plain English",                  desc:"Explained GOC using analogies. Covers reaction mechanisms, SN1/SN2, carbocation stability in exactly 487 words.",                    votes:189, comments:[{name:"Simran Kaur",avatar:ALL_AVATARS[4],text:"Best GOC summary I've read!", time:"30m ago"}],xpEarned:210, rank:1, timeAgo:"3h ago", tags:["#chemistry","#neet","#goc"],  featured:true,  votedBy:[] },
];

const INIT_NOTIFS = [
  { id:1, text:"NVIDIA posted a new challenge: AI-Powered Study Scheduler 💰 ₹50k", time:"10m ago", read:false, icon:"🏆" },
  { id:2, text:"Your Physics simulation got 12 new upvotes — climbing the board!",   time:"25m ago", read:false, icon:"🔼" },
  { id:3, text:"Unacademy shortlisted you from Challenge #1 — check Opportunities",  time:"1h ago",  read:false, icon:"💼" },
  { id:4, text:"You earned the Fast Builder badge ⚡ Companies can see this now",    time:"2h ago",  read:true,  icon:"🏅" },
  { id:5, text:"You moved to #2 on the Physics Simulation live leaderboard!",        time:"3h ago",  read:true,  icon:"⬆️" },
];

const OPPORTUNITIES = [
  { id:1, company:"Unacademy", logo:"🎓", type:"EdTech Internship",    title:"Physics Content Creator",  stipend:"₹15,000/mo", duration:"3 months", stream:"nonmedical", skills:["Physics"], match:96 },
  { id:2, company:"Scale AI",  logo:"🤖", type:"AI Data Project",       title:"NEET Question Validator",  stipend:"₹12,000/mo", duration:"2 months", stream:"medical",    skills:["Biology"], match:92 },
  { id:3, company:"NVIDIA",    logo:"⚡", type:"Engineering Internship", title:"AI Study Tools Developer", stipend:"₹35,000/mo", duration:"3 months", stream:"nonmedical", skills:["Coding"],  match:88 },
];

const PROOF_BADGES = [
  { id:"top5",    label:"Top 5% Physics",       emoji:"⚡", tier:"gold",     desc:"Top 5% in Physics scores",        earned:true  },
  { id:"contrib", label:"Knowledge Contributor", emoji:"📚", tier:"silver",   desc:"Notes downloaded 500+ times",     earned:true  },
  { id:"hours",   label:"100-Hour Warrior",      emoji:"⏱", tier:"bronze",   desc:"100+ tracked study hours",        earned:true  },
  { id:"solver",  label:"Problem Solver",        emoji:"🧠", tier:"silver",   desc:"Completed 5+ challenges",         earned:true  },
  { id:"fast",    label:"Fast Builder",          emoji:"⚡", tier:"silver",   desc:"Top 10% by time on a challenge",  earned:true  },
  { id:"winner",  label:"Challenge Winner",      emoji:"🏆", tier:"gold",     desc:"Won a company challenge",         earned:false },
  { id:"verify",  label:"Verified Talent",       emoji:"✔",  tier:"verified", desc:"Identity + streak verified",     earned:false },
];

const CHALLENGE_BADGES = [
  { id:"winner",  label:"Challenge Winner", emoji:"🏆", tier:"gold",   desc:"Won a company-sponsored challenge", earned:false },
  { id:"solver",  label:"Problem Solver",   emoji:"🧠", tier:"silver", desc:"Completed 5+ challenges",           earned:true  },
  { id:"fast",    label:"Fast Builder",     emoji:"⚡", tier:"silver", desc:"Submitted in top 10% by time",      earned:true  },
  { id:"contrib", label:"Top Contributor",  emoji:"📚", tier:"bronze", desc:"Best community-voted submission",   earned:false },
];


const INIT_HISTORY = [
  { id:1, title:"Physics Solver Challenge",       sponsor:"Unacademy", result:"Top 5%",       xpEarned:120, badge:"⚡ Fast Builder",         completedAgo:"3 days ago" },
  { id:2, title:"React Component Mini Challenge", sponsor:"Weekly",    result:"Top 10%",      xpEarned:80,  badge:null,                      completedAgo:"1 week ago" },
  { id:3, title:"Best Chemistry Summary",         sponsor:"Weekly",    result:"2nd Place 🥈", xpEarned:200, badge:"📚 Knowledge Contributor", completedAgo:"2 weeks ago" },
];

const INIT_USER = {
  id:4, name:"Aarav Sharma", avatar:ALL_AVATARS[3], stream:"nonmedical",
  streak:47, xp:4320, rank:4, percentile:88, rankLabel:"Top 12%",
  verified:false, challengesWon:0, challengeXP:340, notes:5, noteDownloads:1120,
  goal:"IIT Bombay — Computer Science 2026", exam:"JEE 2026",
  syllabusPct:64, daysToExam:112,
  skillLevels:[["Physics",88,"#F59E0B"],["Chemistry",74,"#A78BFA"],["Coding",68,"#FB923C"]],
  streakGoals:[{day:7,label:"Week",done:true},{day:21,label:"Habit",done:true},{day:50,label:"Pro",done:false},{day:100,label:"Elite",done:false}],
  submittedChallenges:[],
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;background:#EFF4FB;color:#0F1C3F;-webkit-font-smoothing:antialiased}
  button{font-family:inherit;cursor:pointer}
  input,textarea{font-family:inherit}
  :root{
    --bg:#EFF4FB;--s1:#FFFFFF;--s2:#F4F7FD;
    --b1:rgba(15,28,63,.09);--b2:rgba(15,28,63,.15);
    --text:#0F1C3F;--sub:#3D5280;--muted:#7988A8;
    --blue:#1A4FD6;--green:#0A9B6A;--amber:#B97200;
  }
  .fu{animation:fadeUp .35s ease both}
  .fi{animation:fadeIn .25s ease both}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes livePop{0%{transform:scale(.9);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  .pulse-dot{animation:pulse 1.8s infinite}
  .live-pop{animation:livePop .4s ease both}
  .btn-primary{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:13px 20px;background:linear-gradient(135deg,#1A4FD6,#3B5CE8);color:#fff;border:none;border-radius:12px;font-size:13px;font-weight:800;box-shadow:0 4px 14px rgba(26,79,214,.28);transition:all .18s}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(26,79,214,.4)}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .btn-sm{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:8px 15px;background:linear-gradient(135deg,#1A4FD6,#3B5CE8);color:#fff;border:none;border-radius:9px;font-size:11px;font-weight:800;box-shadow:0 3px 10px rgba(26,79,214,.22);transition:all .15s;white-space:nowrap}
  .btn-sm:hover{transform:translateY(-1px)}
  .btn-ghost{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:12px;background:#fff;color:var(--muted);border:1.5px solid var(--b2);border-radius:12px;font-size:13px;font-weight:600;transition:all .18s}
  .btn-ghost:hover{border-color:var(--blue);color:var(--blue);background:#EBF0FF}
  .card{background:#fff;border:1px solid var(--b1);border-radius:18px;box-shadow:0 2px 10px rgba(15,28,63,.06)}
  .card2{background:#F4F7FD;border:1px solid var(--b1);border-radius:12px}
  .hover{transition:transform .18s,box-shadow .18s,border-color .18s}
  .hover:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(15,28,63,.13);border-color:rgba(26,79,214,.25)}
  .inp{width:100%;padding:11px 14px 11px 40px;border:1.5px solid var(--b2);border-radius:10px;font-size:13px;background:#fff;color:var(--text);outline:none;transition:border-color .18s,box-shadow .18s}
  .inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,79,214,.1)}
  .inp::placeholder{color:var(--muted)}
  .textarea{width:100%;padding:12px 14px;min-height:120px;resize:vertical;border:1.5px solid var(--b2);border-radius:10px;font-size:13px;background:#fff;color:var(--text);outline:none;line-height:1.6}
  .textarea:focus{border-color:var(--blue)}
  .textarea::placeholder{color:var(--muted)}
  .tag{display:inline-flex;padding:3px 8px;border-radius:5px;font-size:10px;font-weight:700;background:#EBF0FF;color:#1A4FD6;border:1px solid rgba(26,79,214,.2);font-family:'JetBrains Mono',monospace}
  .chip{padding:6px 13px;border-radius:50px;border:1.5px solid var(--b2);background:#fff;color:var(--muted);font-size:11px;font-weight:600;transition:all .15s;white-space:nowrap;cursor:pointer}
  .chip.on{background:#EBF0FF;border-color:rgba(26,79,214,.4);color:var(--blue)}
  .xp-bar{height:5px;border-radius:3px;background:rgba(15,28,63,.1);overflow:hidden}
  .xp-fill{height:100%;background:linear-gradient(90deg,#1A4FD6,#3B5CE8);border-radius:3px;transition:width .6s ease}
  .skill-bar{height:4px;border-radius:2px;background:rgba(15,28,63,.1);overflow:hidden;margin-top:4px}
  .skill-fill{height:100%;border-radius:2px;transition:width .8s ease}
  .diff-easy{background:#EDFAF3;color:#0A9B6A;border:1px solid rgba(10,155,106,.3)}
  .diff-medium{background:#FFF8E6;color:#B97200;border:1px solid rgba(185,114,0,.3)}
  .diff-hard{background:#FFF0F0;color:#C02020;border:1px solid rgba(192,32,32,.3)}
  .cat-build{background:#EBF0FF;color:#1A4FD6}
  .cat-research{background:#F3EEFF;color:#6B3FA0}
  .cat-notes{background:#EDFAF3;color:#0A9B6A}
  .cat-solve{background:#FFF8E6;color:#B97200}
  .lb-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;background:#F4F7FD;border:1px solid var(--b1);margin-bottom:6px}
  .ticker-inner{display:flex;gap:48px;width:max-content;animation:ticker 22s linear infinite}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-thumb{background:rgba(15,28,63,.18);border-radius:2px}
  @media(max-width:640px){.auth-panel{display:none!important}}
`;

// ─── Primitives ───────────────────────────────────────────────────────────────
const Av = ({src,size=40,ring,online=false,verified=false}) => (
  <div style={{position:"relative",flexShrink:0,display:"inline-block"}}>
    <img src={src} width={size} height={size} alt="" style={{borderRadius:"50%",border:ring?`2.5px solid ${ring}`:"1.5px solid rgba(15,28,63,.12)",background:"#E8EEF8",display:"block"}}/>
    {online   && <div style={{position:"absolute",bottom:1,right:1,width:Math.max(8,size*.2),height:Math.max(8,size*.2),background:"#0A9B6A",borderRadius:"50%",border:"2px solid white"}} className="pulse-dot"/>}
    {verified && !online && <div style={{position:"absolute",bottom:0,right:0,width:Math.max(14,size*.28),height:Math.max(14,size*.28),background:"#0A9B6A",borderRadius:"50%",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.12,color:"white",fontWeight:900}}>✓</div>}
  </div>
);
const StreamPill = ({stream,size="sm"}) => {
  const s=STREAM[stream]; if(!s) return null;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:size==="sm"?"3px 8px":"5px 11px",borderRadius:50,fontSize:size==="sm"?10:12,fontWeight:700,background:s.light,color:s.color,border:`1px solid ${s.border}`}}>{s.emoji} {s.label}</span>;
};
const XPTag = ({xp,big=false}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:big?"5px 11px":"3px 8px",borderRadius:6,background:"#EBF0FF",border:"1px solid rgba(26,79,214,.2)",fontSize:big?13:10,fontWeight:700,color:"#1A4FD6",fontFamily:"'JetBrains Mono',monospace"}}>⚡{xp}XP</span>
);
const DiffPill = ({d}) => <span className={`diff-${d}`} style={{padding:"3px 9px",borderRadius:50,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:".04em"}}>{d}</span>;
const CatIcon = ({cat}) => {
  const m={build:"🔨",research:"🔬",notes:"📝",solve:"⚡"};
  return <span className={`cat-${cat}`} style={{width:28,height:28,borderRadius:8,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{m[cat]||"🏆"}</span>;
};
const BackBtn = ({onBack}) => (
  <button onClick={onBack} style={{background:"none",border:"none",color:"var(--text)",display:"flex",padding:4,flexShrink:0}}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
  </button>
);
const IcoWrap = ({ch}) => <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--muted)",pointerEvents:"none",display:"flex"}}>{ch}</div>;
const ProofBadge = ({badge,small=false}) => {
  const col=BADGE_COLORS[badge.tier]||"#7988A8";
  return (
    <div style={{display:"flex",alignItems:"center",gap:small?6:8,padding:small?"7px 10px":"10px 12px",borderRadius:small?8:12,background:badge.earned?`${col}18`:"rgba(15,28,63,.04)",border:`1px solid ${badge.earned?col+"40":"rgba(15,28,63,.06)"}`,opacity:badge.earned?1:.45}}>
      <div style={{width:small?24:30,height:small?24:30,borderRadius:small?6:9,background:badge.earned?BADGE_TIERS[badge.tier]:"rgba(15,28,63,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:small?12:16,flexShrink:0}}>{badge.emoji}</div>
      <div style={{minWidth:0}}>
        <div style={{fontSize:small?10:12,fontWeight:700,color:badge.earned?col:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{badge.label}</div>
        {!small&&<div style={{fontSize:9,color:"var(--muted)",marginTop:1}}>{badge.desc}</div>}
      </div>
      {badge.earned&&!small&&<div style={{marginLeft:"auto",fontSize:8,fontWeight:800,color:col,background:`${col}15`,padding:"2px 6px",borderRadius:50,textTransform:"uppercase",letterSpacing:".04em",whiteSpace:"nowrap",flexShrink:0}}>{badge.tier}</div>}
    </div>
  );
};

// ─── Ticker ───────────────────────────────────────────────────────────────────
function CompanyTicker() {
  const msgs=["🎓 Unacademy scouting Top 10% Physics for Content Creator role · 31 profiles","⚡ NVIDIA seeking AI builders for Study Scheduler challenge · 18 profiles","🤖 Scale AI reviewing NEET Challenge submissions · 41 viewed","📊 Embibe shortlisting Analytics Fellows from leaderboard · 12 profiles","🔬 IIT Delhi Lab reviewing Research Assistant candidates · 7 profiles"];
  return (
    <div style={{background:"#EBF2FE",borderBottom:"1px solid rgba(26,79,214,.14)",padding:"6px 0",overflow:"hidden"}}>
      <div className="ticker-inner">
        {[...msgs,...msgs].map((m,i)=>(
          <span key={i} style={{fontSize:11,fontWeight:600,color:"#1A4FD6",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#0A9B6A",display:"inline-block",flexShrink:0}} className="pulse-dot"/>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({onNav,active,notifCount=0}) {
  const tabs=[
    {key:"feed",         label:"Home",       icon:on=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke={on?"#1A4FD6":"#9AA8C5"}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={on?"#EBF0FF":"none"}/><polyline points="9,22 9,12 15,12 15,22"/></svg>},
    {key:"challenges",   label:"Challenges", icon:on=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke={on?"#1A4FD6":"#9AA8C5"}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" fill={on?"#EBF0FF":"none"}/></svg>},
    {key:"opportunities",label:"Jobs",       icon:on=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke={on?"#1A4FD6":"#9AA8C5"}><rect x="2" y="7" width="20" height="14" rx="2" fill={on?"#EBF0FF":"none"}/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
    {key:"showcase",     label:"Showcase",   icon:on=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke={on?"#1A4FD6":"#9AA8C5"}><rect x="3" y="3" width="18" height="18" rx="2" fill={on?"#EBF0FF":"none"}/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>},
    {key:"profile",      label:"Me",         icon:on=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke={on?"#1A4FD6":"#9AA8C5"}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill={on?"#EBF0FF":"none"}/><circle cx="12" cy="7" r="4" fill={on?"#EBF0FF":"none"}/></svg>},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,.97)",backdropFilter:"blur(12px)",borderTop:"1px solid var(--b1)",display:"flex"}}>
      {tabs.map(t=>{
        const on=active===t.key;
        return (
          <button key={t.key} onClick={()=>onNav(t.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"9px 0 13px",background:"none",border:"none",position:"relative"}}>
            {on&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:22,height:2,background:"linear-gradient(90deg,#1A4FD6,#3B5CE8)",borderRadius:"0 0 3px 3px"}}/>}
            <div style={{width:38,height:27,borderRadius:9,background:on?"#EBF0FF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              {t.icon(on)}
              {t.key==="challenges"&&<span style={{position:"absolute",top:-3,right:-3,width:14,height:14,background:"#1A4FD6",borderRadius:"50%",border:"2px solid white",fontSize:7,color:"white",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{CHALLENGES.length}</span>}
              {t.key==="feed"&&notifCount>0&&<span style={{position:"absolute",top:1,right:1,width:9,height:9,background:"#EF4444",borderRadius:"50%",border:"1.5px solid var(--bg)"}}/>}
            </div>
            <span style={{fontSize:8,fontWeight:on?700:500,color:on?"#1A4FD6":"var(--muted)"}}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Notif Panel ──────────────────────────────────────────────────────────────
function NotifPanel({notifs,onClose,onMarkAllRead}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,28,63,.3)",backdropFilter:"blur(10px)",zIndex:200,display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}} onClick={onClose}>
      <div className="card" style={{width:"100%",maxWidth:360,margin:"55px 12px 0",maxHeight:"72vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"13px 16px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>Notifications</div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span onClick={onMarkAllRead} style={{fontSize:11,color:"var(--blue)",fontWeight:600,cursor:"pointer"}}>Mark all read</span>
            <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",display:"flex"}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {notifs.map(n=>(
            <div key={n.id} style={{display:"flex",gap:10,padding:"11px 15px",borderBottom:"1px solid var(--b1)",background:n.read?"transparent":"#EBF2FE"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{n.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:n.read?"var(--muted)":"var(--sub)",lineHeight:1.55}}>{n.text}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{n.time}</div>
              </div>
              {!n.read&&<div style={{width:6,height:6,borderRadius:"50%",background:"#1A4FD6",flexShrink:0,marginTop:6}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Submission Card ──────────────────────────────────────────────────────────
function SubmissionCard({sub,currentUserId,onVote,onComment}) {
  const [showComments,setShowComments]=useState(false);
  const [commentInput,setCommentInput]=useState("");
  const student=STUDENTS.find(s=>s.id===sub.studentId)||{};
  const voted=sub.votedBy?.includes(currentUserId);
  const handleComment=()=>{ if(!commentInput.trim()) return; onComment&&onComment(sub.id,commentInput); setCommentInput(""); };
  return (
    <div className="card hover" style={{marginBottom:12,padding:"14px 15px"}}>
      {sub.featured&&<div style={{display:"inline-flex",alignItems:"center",gap:5,marginBottom:10,padding:"3px 9px",borderRadius:6,background:"#FFF8E6",border:"1px solid rgba(185,114,0,.2)"}}><span style={{fontSize:10}}>⭐</span><span style={{fontSize:9,fontWeight:800,color:"#B97200",letterSpacing:".04em"}}>FEATURED BY COMMUNITY</span></div>}
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <Av src={student.avatar} size={38} verified={student.verified} online={student.id===1}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <span style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{student.name}</span>
            {student.verified&&<span style={{fontSize:9,fontWeight:800,color:"#0A9B6A",background:"rgba(10,155,106,.1)",padding:"1px 6px",borderRadius:50}}>✔ VERIFIED</span>}
          </div>
          <div style={{fontSize:10,color:"var(--muted)"}}>Rank #{sub.rank} · {sub.timeAgo}</div>
        </div>
        <XPTag xp={sub.xpEarned}/>
      </div>
      <div style={{fontWeight:700,fontSize:12,color:"var(--text)",marginBottom:5}}>{sub.title}</div>
      <p style={{fontSize:11,color:"var(--muted)",lineHeight:1.65,marginBottom:9}}>{sub.desc}</p>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>{sub.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
      <div style={{display:"flex",gap:12,alignItems:"center",paddingTop:9,borderTop:"1px solid var(--b1)"}}>
        <button onClick={()=>!voted&&onVote&&onVote(sub.id)} style={{display:"flex",alignItems:"center",gap:5,background:voted?"#EBF0FF":"transparent",border:voted?"1px solid rgba(26,79,214,.25)":"1px solid transparent",borderRadius:8,padding:"5px 10px",color:voted?"#1A4FD6":"var(--sub)",fontWeight:700,fontSize:12}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={voted?"#1A4FD6":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="17,11 12,6 7,11"/><polyline points="17,18 12,13 7,18"/></svg>
          {sub.votes}
        </button>
        <button onClick={()=>setShowComments(p=>!p)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",color:showComments?"var(--blue)":"var(--muted)",fontWeight:600,fontSize:12,padding:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {sub.comments.length}
        </button>
        <span style={{marginLeft:"auto",fontSize:10,color:"var(--muted)"}}>👁 {sub.votes*4} views</span>
      </div>
      {showComments&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--b1)"}}>
          {sub.comments.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:7,marginBottom:8}}>
              <Av src={c.avatar||ALL_AVATARS[0]} size={24}/>
              <div style={{background:"#F4F7FD",borderRadius:9,padding:"7px 11px",flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--sub)",marginBottom:2}}>{c.name} <span style={{color:"var(--muted)",fontWeight:400}}>· {c.time}</span></div>
                <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{c.text}</div>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:6,marginTop:6}}>
            <Av src={ALL_AVATARS[3]} size={24}/>
            <input value={commentInput} onChange={e=>setCommentInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleComment()} placeholder="Add a comment…" style={{flex:1,background:"#EEF2FF",border:"1.5px solid var(--b2)",borderRadius:50,padding:"6px 12px",fontSize:12,color:"var(--text)",outline:"none"}}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Challenge Card ───────────────────────────────────────────────────────────
function ChallengeCard({c,onClick}) {
  return (
    <div className="card hover" style={{marginBottom:12,overflow:"hidden",cursor:"pointer"}} onClick={onClick}>
      {c.type==="company"&&(
        <div style={{padding:"8px 14px",background:"linear-gradient(135deg,#EBF0FF,#EEF2FF)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>{c.sponsorLogo}</span>
          <span style={{fontSize:10,fontWeight:800,color:"var(--sub)",letterSpacing:".03em"}}>SPONSORED · {c.sponsor.toUpperCase()}</span>
          <span style={{marginLeft:"auto",padding:"2px 7px",borderRadius:50,background:"#1A4FD6",fontSize:9,fontWeight:800,color:"white"}}>REAL COMPANY</span>
        </div>
      )}
      <div style={{padding:"13px 14px"}}>
        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <CatIcon cat={c.category}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:13,color:"var(--text)",lineHeight:1.3,marginBottom:3}}>{c.title}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{c.tagline}</div>
          </div>
        </div>
        <div style={{padding:"8px 11px",borderRadius:10,background:"#EDFAF3",border:"1px solid rgba(10,155,106,.18)",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:14}}>{c.rewardType==="internship"?"💼":c.rewardType==="bounty"?"💰":"⚡"}</span>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:800,color:"#0A9B6A"}}>{c.reward}</div></div>
          <XPTag xp={c.xpReward}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:10}}>
          <DiffPill d={c.difficulty}/>
          <span style={{fontSize:11,color:c.daysLeft<=2?"#C02020":"var(--muted)",fontWeight:c.daysLeft<=2?700:500}}>⏰ {c.deadline}{c.daysLeft<=2?" · Urgent!":""}</span>
          <span style={{fontSize:10,color:"var(--muted)"}}>👥 {c.participants} joined</span>
          {c.stream&&<span style={{marginLeft:"auto"}}><StreamPill stream={c.stream}/></span>}
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {c.skills.map(sk=><span key={sk} style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5,background:`${SKILL_COLORS[sk]||"#38BDF8"}15`,color:SKILL_COLORS[sk]||"#38BDF8",border:`1px solid ${SKILL_COLORS[sk]||"#38BDF8"}30`}}>{sk}</span>)}
        </div>
        <div style={{padding:"9px 11px",borderRadius:10,background:"#F4F7FD",border:"1px solid var(--b1)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:7,display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#0A9B6A",display:"inline-block"}} className="pulse-dot"/>
            LIVE LEADERBOARD
          </div>
          <div style={{display:"flex",gap:6}}>
            {c.liveBoard.slice(0,3).map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5,flex:1,minWidth:0}}>
                <span style={{fontSize:12}}>{["🥇","🥈","🥉"][i]}</span>
                <Av src={p.avatar} size={20}/>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:9,fontWeight:700,color:"var(--sub)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name.split(" ")[0]}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"var(--muted)"}}>{p.xp}xp</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary" style={{marginTop:10}}>View Challenge →</button>
      </div>
    </div>
  );
}

// ─── Challenge Detail ─────────────────────────────────────────────────────────
function ChallengeDetail({c,onBack,user,submissions,onVoteSubmission,onCommentSubmission,onSubmitChallenge}) {
  const [tab,setTab]=useState("brief");
  const [subTitle,setSubTitle]=useState("");
  const [subText,setSubText]=useState("");
  const [liveBoard,setLiveBoard]=useState([...c.liveBoard]);
  const submitted=user.submittedChallenges?.includes(c.id);
  const mySubs=submissions.filter(s=>s.challengeId===c.id);

  useEffect(()=>{
    if(tab!=="leaderboard") return;
    const t=setInterval(()=>setLiveBoard(p=>p.map(x=>({...x,xp:x.xp+Math.floor(Math.random()*3)}))),2000);
    return ()=>clearInterval(t);
  },[tab]);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
          <BackBtn onBack={onBack}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:13,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>⏰ {c.deadline} left · {c.participants} participants</div>
          </div>
          <DiffPill d={c.difficulty}/>
        </div>
        <div style={{maxWidth:600,margin:"8px auto 0",display:"flex",gap:0,borderRadius:9,overflow:"hidden",border:"1px solid var(--b2)"}}>
          {[["brief","📋 Brief"],["submit","✏️ Submit"],["leaderboard","🏆 Live"],["showcase","🌐 Showcase"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} style={{flex:1,padding:"8px 4px",background:tab===v?"#EBF0FF":"transparent",color:tab===v?"var(--blue)":"var(--muted)",border:"none",fontWeight:700,fontSize:10}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"14px 14px 90px"}}>
        {tab==="brief"&&(
          <div className="fu">
            {c.type==="company"&&<div style={{marginBottom:12,padding:"12px 14px",borderRadius:12,background:"#EBF0FF",border:"1px solid rgba(26,79,214,.2)",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>{c.sponsorLogo}</span><div><div style={{fontSize:9,fontWeight:800,color:"var(--sub)",letterSpacing:".06em",marginBottom:2}}>SPONSORED · {c.sponsor.toUpperCase()}</div><div style={{fontSize:11,fontWeight:700,color:"var(--blue)"}}>{c.sponsor} · Real company project</div></div><span style={{marginLeft:"auto",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:50,background:"#1A4FD6",color:"white"}}>REAL COMPANY</span></div>}
            <div className="card" style={{padding:"14px 16px",marginBottom:12,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.7)",letterSpacing:".05em",marginBottom:8}}>🏆 REWARD</div>
              <div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:8}}>{c.reward}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><XPTag xp={c.xpReward} big/>{c.rewardType==="internship"&&<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.8)"}}>💼 Internship track</span>}</div>
            </div>
            <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:8}}>📋 BRIEF</div>
              <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.7,marginBottom:14}}>{c.description}</p>
              <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:8}}>✅ REQUIREMENTS</div>
              {c.requirements.map((r,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"#EBF0FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"var(--blue)",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5,marginTop:2}}>{r}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={()=>setTab("submit")}>Start Challenge →</button>
          </div>
        )}
        {tab==="submit"&&(
          <div className="fu">
            {submitted?(
              <div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:48,marginBottom:12}}>🎉</div><div style={{fontWeight:800,fontSize:16,color:"var(--text)",marginBottom:6}}>Submitted!</div><div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Your solution is live. Community votes determine ranking.</div><button className="btn-primary" onClick={()=>setTab("leaderboard")}>View Live Board →</button></div>
            ):(
              <>
                <div style={{padding:"10px 12px",borderRadius:10,background:"#EBF2FE",border:"1px solid rgba(26,79,214,.15)",marginBottom:14,display:"flex",gap:8}}><span>👁</span><span style={{fontSize:11,fontWeight:600,color:"var(--blue)"}}>Your submission will be public. Other students and companies will vote on it.</span></div>
                <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:8}}>SUBMISSION TITLE</div>
                  <input className="inp" style={{paddingLeft:14}} placeholder="Give your submission a clear title…" value={subTitle} onChange={e=>setSubTitle(e.target.value)}/>
                </div>
                <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:8}}>{c.format==="code"?"GITHUB / DEMO LINK + DESCRIPTION":"FINDINGS & METHODOLOGY"}</div>
                  <textarea className="textarea" placeholder="Describe your approach, methodology, and results…" value={subText} onChange={e=>setSubText(e.target.value)}/>
                </div>
                <button className="btn-primary" onClick={()=>{if(subTitle.trim()&&subText.trim()){onSubmitChallenge(c.id,subTitle,subText);setTab("leaderboard");}}} disabled={!subTitle.trim()||!subText.trim()}>Submit → +{c.xpReward} XP</button>
              </>
            )}
          </div>
        )}
        {tab==="leaderboard"&&(
          <div className="fu">
            <div style={{padding:"9px 12px",borderRadius:10,background:"#EDFAF3",border:"1px solid rgba(10,155,106,.2)",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#0A9B6A",flexShrink:0}} className="pulse-dot"/>
              <span style={{fontSize:11,fontWeight:700,color:"#0A9B6A"}}>Live · Updates every few seconds</span>
            </div>
            {liveBoard.map((p,i)=>(
              <div key={i} className="lb-row live-pop" style={{animationDelay:`${i*.08}s`}}>
                <span style={{fontSize:16,width:24,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</span>
                <Av src={p.avatar} size={36} online={i<2}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{p.name}</div><div className="xp-bar" style={{marginTop:4,maxWidth:160}}><div className="xp-fill" style={{width:`${Math.min(100,(p.xp/700)*100)}%`}}/></div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--blue)"}}>{p.xp} XP</div><div style={{fontSize:9,color:"var(--muted)"}}>Rank #{i+1}</div></div>
              </div>
            ))}
            <div style={{margin:"12px 0 4px",borderTop:"1px solid var(--b1)",paddingTop:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:8}}>YOUR POSITION</div>
              <div className="lb-row" style={{background:"#EBF0FF",border:"1px solid rgba(26,79,214,.22)"}}>
                <span style={{fontSize:14,width:24,textAlign:"center"}}>#4</span>
                <Av src={user.avatar} size={36}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:"#1A4FD6"}}>{user.name} <span style={{fontSize:8,fontWeight:800,color:"white",background:"#1A4FD6",padding:"1px 6px",borderRadius:50}}>YOU</span></div><div className="xp-bar" style={{marginTop:4,maxWidth:160}}><div className="xp-fill" style={{width:"49%"}}/></div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--blue)"}}>320 XP</div><div style={{fontSize:9,color:"var(--muted)"}}>Submit to climb ↑</div></div>
              </div>
            </div>
            {!submitted&&<button onClick={()=>setTab("submit")} className="btn-primary" style={{marginTop:12}}>Submit & Climb →</button>}
          </div>
        )}
        {tab==="showcase"&&(
          <div className="fu">
            <div style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:10}}>{mySubs.length} public submissions · Voting open</div>
            {mySubs.map(sub=><SubmissionCard key={sub.id} sub={sub} currentUserId={user.id} onVote={onVoteSubmission} onComment={onCommentSubmission}/>)}
            {mySubs.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}><div style={{fontSize:40,marginBottom:10}}>🚀</div><div style={{fontWeight:700,color:"var(--sub)",marginBottom:4}}>No submissions yet</div><div style={{fontSize:12}}>Be the first — get early community votes!</div></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Challenges Screen ────────────────────────────────────────────────────────
function Challenges({onNav,onOpenChallenge,user,notifs,onMarkAllRead}) {
  const [filter,setFilter]=useState("all");
  const [catFilter,setCatFilter]=useState("all");
  const [showNotifs,setShowNotifs]=useState(false);
  const unread=notifs.filter(n=>!n.read).length;
  const filtered=CHALLENGES.filter(c=>{
    const typeOk=filter==="all"||(filter==="company"&&c.type==="company")||(filter==="weekly"&&c.type==="weekly");
    const catOk=catFilter==="all"||c.category===catFilter;
    return typeOk&&catOk;
  });
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      {showNotifs&&<NotifPanel notifs={notifs} onClose={()=>setShowNotifs(false)} onMarkAllRead={()=>{onMarkAllRead();setShowNotifs(false);}}/>}
      <CompanyTicker/>
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div><div style={{fontWeight:900,fontSize:15,color:"var(--text)",letterSpacing:"-.02em"}}>Challenges</div><div style={{fontSize:10,color:"var(--muted)"}}>Build · Solve · Get hired</div></div>
            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>onNav("challenge-portfolio")} style={{padding:"7px 12px",borderRadius:9,background:"#EBF0FF",border:"1px solid rgba(26,79,214,.2)",color:"#1A4FD6",fontSize:11,fontWeight:700}}>📂 Portfolio</button>
              <button onClick={()=>setShowNotifs(true)} style={{position:"relative",width:36,height:36,borderRadius:"50%",background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unread>0&&<span style={{position:"absolute",top:7,right:7,width:8,height:8,background:"#EF4444",borderRadius:"50%",border:"1.5px solid var(--bg)"}}/>}
              </button>
            </div>
          </div>
          <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid var(--b2)",marginBottom:10}}>
            {[["all","All",CHALLENGES.length],["company","🏢 Sponsored",CHALLENGES.filter(c=>c.type==="company").length],["weekly","🔥 Weekly",CHALLENGES.filter(c=>c.type==="weekly").length]].map(([v,l,cnt])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{flex:1,padding:"8px 6px",background:filter===v?"#EBF0FF":"transparent",color:filter===v?"var(--blue)":"var(--muted)",border:"none",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                {l}<span style={{padding:"1px 5px",borderRadius:50,background:filter===v?"rgba(26,79,214,.2)":"rgba(15,28,63,.08)",fontSize:9,fontWeight:800}}>{cnt}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:5,overflowX:"auto",scrollbarWidth:"none"}}>
            {[["all","All"],["build","🔨 Build"],["research","🔬 Research"],["notes","📝 Notes"],["solve","⚡ Solve"]].map(([v,l])=>(
              <button key={v} className={`chip${catFilter===v?" on":""}`} onClick={()=>setCatFilter(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"12px 14px 90px"}}>
        <div style={{marginBottom:12,padding:"11px 14px",borderRadius:12,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:22}}>🏆</div>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:800,color:"#FFFFFF"}}>Top 20 performers get internship interviews this month</div><div style={{fontSize:10,color:"rgba(255,255,255,.65)",marginTop:1}}>You're #{user.rank} overall · Win any challenge to jump to Top 3</div></div>
          <XPTag xp={user.xp} big/>
        </div>
        {filtered.map(c=><ChallengeCard key={c.id} c={c} onClick={()=>onOpenChallenge(c)}/>)}
      </div>
      <BottomNav onNav={onNav} active="challenges" notifCount={unread}/>
    </div>
  );
}

// ─── Showcase ─────────────────────────────────────────────────────────────────
function Showcase({onNav,submissions,user,onVoteSubmission,onCommentSubmission}) {
  const [cf,setCf]=useState("all");
  const filtered=cf==="all"?submissions:submissions.filter(s=>s.challengeId===parseInt(cf));
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <CompanyTicker/>
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:14,color:"var(--text)",marginBottom:3}}>Challenge Showcase 🌐</div>
          <div style={{fontSize:10,color:"var(--muted)",marginBottom:10}}>Public submissions · Vote · Learn · Get inspired</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
            <button className={`chip${cf==="all"?" on":""}`} onClick={()=>setCf("all")}>All Challenges</button>
            {CHALLENGES.filter(c=>submissions.some(s=>s.challengeId===c.id)).map(c=>(
              <button key={c.id} onClick={()=>setCf(String(c.id))} style={{padding:"6px 12px",borderRadius:50,border:`1.5px solid ${cf===String(c.id)?"rgba(26,79,214,.4)":"rgba(15,28,63,.1)"}`,background:cf===String(c.id)?"#EBF0FF":"rgba(15,28,63,.04)",color:cf===String(c.id)?"var(--blue)":"var(--muted)",fontSize:11,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer"}}>{c.sponsorLogo} {c.title.split(" ").slice(0,3).join(" ")}…</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"12px 14px 90px"}}>
        <div style={{marginBottom:12,padding:"9px 12px",borderRadius:10,background:"#EDFAF3",border:"1px solid rgba(10,155,106,.18)",display:"flex",gap:8,alignItems:"center"}}>
          <span className="pulse-dot" style={{width:6,height:6,borderRadius:"50%",background:"#0A9B6A",flexShrink:0}}/>
          <span style={{fontSize:11,fontWeight:700,color:"#0A9B6A"}}>Companies browse this showcase to shortlist talent.</span>
        </div>
        {filtered.map(sub=><SubmissionCard key={sub.id} sub={sub} currentUserId={user.id} onVote={onVoteSubmission} onComment={onCommentSubmission}/>)}
      </div>
      <BottomNav onNav={onNav} active="showcase"/>
    </div>
  );
}

// ─── Challenge Portfolio ──────────────────────────────────────────────────────
function ChallengePortfolio({onBack,user,history}) {
  const totalXP=history.reduce((s,h)=>s+h.xpEarned,0);
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10}}>
        <BackBtn onBack={onBack}/>
        <div><div style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>Challenge Portfolio</div><div style={{fontSize:10,color:"var(--muted)"}}>Your proof of skill · Public to companies</div></div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"14px 14px 90px"}}>
        <div className="card" style={{padding:"16px",marginBottom:14,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)"}}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.5)",letterSpacing:".05em",marginBottom:12}}>📂 YOUR CHALLENGE RECORD</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
            {[[history.length,"Completed"],[history.filter(h=>h.result.includes("Top")).length,"Top 10%"],[totalXP,"XP Earned"]].map(([v,l])=>(
              <div key={l} className="card2" style={{padding:"10px",textAlign:"center"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:18,color:"var(--blue)"}}>{v}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,.15)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min(100,(totalXP/1000)*100)}%`,background:"linear-gradient(90deg,#60A5FA,#93C5FD)",borderRadius:3}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:"rgba(255,255,255,.4)"}}>
            <span>{totalXP} XP earned</span><span>1000 XP = Challenge Winner badge</span>
          </div>
        </div>
        <div className="card" style={{padding:"14px 16px",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:12}}>Challenge Badges</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
            {CHALLENGE_BADGES.map(b=><ProofBadge key={b.id} badge={b}/>)}
          </div>
        </div>
        <div className="card" style={{padding:"14px 16px"}}>
          <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:12}}>Completed Challenges</div>
          {history.map((h,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"12px 0",borderBottom:i<history.length-1?"1px solid var(--b1)":"none"}}>
              <div style={{width:36,height:36,borderRadius:10,background:"#EBF0FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏆</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:12,color:"var(--text)",marginBottom:2}}>{h.title}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginBottom:6}}>{h.sponsor} · {h.completedAgo}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50,background:"#EBF0FF",color:"var(--blue)",border:"1px solid rgba(26,79,214,.2)"}}>{h.result}</span>
                  {h.badge&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50,background:"#FFF8E6",color:"#B97200",border:"1px solid rgba(185,114,0,.2)"}}>{h.badge}</span>}
                  <XPTag xp={h.xpEarned}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Opportunities ────────────────────────────────────────────────────────────
function Opportunities({onNav,user}) {
  const [applied,setApplied]=useState([]);
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <CompanyTicker/>
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",borderBottom:"1px solid var(--b1)",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>Opportunities 💼</div><div style={{fontSize:10,color:"var(--muted)"}}>Apply with your profile · No CV needed</div></div>
          <div style={{fontSize:11,fontWeight:700,color:"#0A9B6A"}}>● {OPPORTUNITIES.length} companies hiring now</div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"12px 14px 90px"}}>
        <div className="card" style={{padding:"12px 14px",marginBottom:12,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:24}}>🏆</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:800,color:"#FFFFFF"}}>Win a challenge → get fast-tracked for interviews</div><div style={{fontSize:10,color:"rgba(255,255,255,.65)",marginTop:1}}>{user.challengesWon===0?"You haven't won a challenge yet.":` You've won ${user.challengesWon} challenge${user.challengesWon>1?"s":""}!`}</div></div>
            <button onClick={()=>onNav("challenges")} className="btn-sm">Compete</button>
          </div>
        </div>
        {OPPORTUNITIES.map(o=>{
          const isApplied=applied.includes(o.id);
          return (
            <div key={o.id} className="card hover" style={{marginBottom:12,padding:"15px"}}>
              <div style={{display:"flex",gap:10,marginBottom:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{o.logo}</div>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,color:"var(--text)",marginBottom:2}}>{o.title}</div><div style={{fontSize:10,color:"var(--muted)"}}>{o.company} · {o.type}</div></div>
                <span style={{padding:"3px 9px",borderRadius:50,background:o.match>=90?"rgba(10,155,106,.1)":"rgba(185,114,0,.1)",color:o.match>=90?"#0A9B6A":"#B97200",fontSize:10,fontWeight:800,alignSelf:"flex-start",flexShrink:0,border:`1px solid ${o.match>=90?"rgba(10,155,106,.25)":"rgba(185,114,0,.2)"}`}}>{o.match}% match</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                <StreamPill stream={o.stream}/>
                {o.skills.map(sk=><span key={sk} style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5,background:`${SKILL_COLORS[sk]||"#38BDF8"}15`,color:SKILL_COLORS[sk]||"#38BDF8",border:`1px solid ${SKILL_COLORS[sk]||"#38BDF8"}30`}}>{sk}</span>)}
                <span style={{fontSize:10,color:"var(--muted)",marginLeft:"auto"}}>{o.stipend} · {o.duration}</span>
              </div>
              <button onClick={()=>setApplied(p=>p.includes(o.id)?p.filter(x=>x!==o.id):[...p,o.id])} style={{width:"100%",padding:"10px",borderRadius:10,background:isApplied?"#EDFAF3":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",color:isApplied?"#0A9B6A":"#FFFFFF",border:isApplied?"1px solid rgba(10,155,106,.3)":"none",fontWeight:800,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                {isApplied?"✔ Applied · Profile Sent":"Apply with LearnLoop Profile →"}
              </button>
            </div>
          );
        })}
      </div>
      <BottomNav onNav={onNav} active="opportunities"/>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function Profile({onNav,user,history}) {
  const [tab,setTab]=useState("overview");
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div style={{position:"relative",background:"linear-gradient(135deg,#0F1C3F 0%,#1A4FD6 60%,#1e3a8a 100%)",padding:"46px 15px 52px",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
        <button onClick={()=>onNav("feed")} style={{position:"absolute",top:12,left:14,width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"white"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <div style={{position:"absolute",bottom:-40,left:15}}><Av src={user.avatar} size={76} ring="#60A5FA" online/></div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"50px 15px 90px"}}>
        <div style={{marginBottom:14}}>
          <div style={{fontWeight:800,fontSize:18,color:"var(--text)",marginBottom:5}}>{user.name}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:5}}>
            <StreamPill stream={user.stream} size="md"/>
            <span style={{fontSize:11,fontWeight:700,color:"#1A4FD6",background:"#EBF0FF",padding:"3px 10px",borderRadius:50,border:"1px solid rgba(26,79,214,.2)"}}>🎯 {user.exam}</span>
            <span style={{fontSize:11,fontWeight:700,color:"#B97200",background:"#FFF8E6",padding:"3px 10px",borderRadius:50,border:"1px solid rgba(185,114,0,.2)"}}>⭐ {user.rankLabel}</span>
          </div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:12}}>IIT Bombay CSE · Delhi · Class 12</div>
          <div style={{display:"flex",gap:7}}>
            <button className="btn-sm" style={{flex:2}}>🌟 Talent Profile</button>
            <button onClick={()=>onNav("challenge-portfolio")} className="btn-sm" style={{flex:2,background:"linear-gradient(135deg,#1e3a8a,#3B5CE8)"}}>📂 Challenge Portfolio</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14}}>
          {[["🔥",user.streak,"Streak"],["⚡",user.xp,"XP"],["🏆",user.challengesWon,"Challenges"],["📥",user.noteDownloads>999?(user.noteDownloads/1000).toFixed(1)+"k":user.noteDownloads,"Downloads"]].map(([em,n,l])=>(
            <div key={l} className="card" style={{padding:"10px 6px",textAlign:"center"}}>
              <div style={{fontSize:14}}>{em}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:15,color:"var(--text)",marginTop:2}}>{n}</div>
              <div style={{fontSize:9,color:"var(--muted)",marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",borderBottom:"1px solid var(--b1)",marginBottom:12}}>
          {[["overview","Overview"],["badges","Badges"],["portfolio","Portfolio"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px",background:"none",border:"none",borderBottom:tab===k?"2px solid var(--blue)":"2px solid transparent",color:tab===k?"var(--blue)":"var(--muted)",fontWeight:tab===k?700:500,fontSize:12}}>{l}</button>
          ))}
        </div>
        {tab==="overview"&&(
          <div className="fi">
            <div className="card" style={{padding:"14px 16px",marginBottom:12,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(147,197,253,.9)",letterSpacing:".04em",marginBottom:6}}>🎯 GOAL</div>
              <div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:10}}>{user.goal}</div>
              <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,.15)",overflow:"hidden",marginBottom:4}}>
                <div style={{height:"100%",width:`${user.syllabusPct}%`,background:"linear-gradient(90deg,#60A5FA,#93C5FD)",borderRadius:3}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:"rgba(255,255,255,.5)"}}>
                <span>Syllabus {user.syllabusPct}% complete</span><span>{user.exam} in {user.daysToExam} days</span>
              </div>
            </div>
            {user.skillLevels.map(([sk,pct,col])=>(
              <div key={sk} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600,color:"var(--sub)"}}>{sk}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:col,fontWeight:700}}>{pct}%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{width:`${pct}%`,background:col}}/></div>
              </div>
            ))}
            <div className="card" style={{padding:"14px 16px",marginTop:14}}>
              <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:16}}>Streak Goals 🔥</div>
              <div style={{display:"flex",alignItems:"center",padding:"0 4px"}}>
                {user.streakGoals.map((g,i,arr)=>(
                  <div key={g.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                    {i<arr.length-1&&<div style={{position:"absolute",top:14,left:"50%",right:"-50%",height:2,background:g.done?"#1A4FD6":"#E2E8F4",zIndex:0}}/>}
                    <div style={{width:30,height:30,borderRadius:"50%",background:g.done?"#1A4FD6":"white",border:`2px solid ${g.done?"#1A4FD6":"#C8D4EC"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,zIndex:1,position:"relative",boxShadow:g.done?"0 2px 8px rgba(26,79,214,.3)":"none"}}>{g.done?"✓":g.day<=user.streak?"🔥":"⬜"}</div>
                    <div style={{fontSize:9,fontWeight:700,color:g.done?"#1A4FD6":"var(--muted)",marginTop:5}}>{g.day}d</div>
                    <div style={{fontSize:8,color:"var(--muted)",marginTop:1}}>{g.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="badges"&&(
          <div className="fi">
            <div style={{fontSize:10,color:"var(--muted)",marginBottom:10}}>Earned badges are visible to companies on your Talent Profile.</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>{PROOF_BADGES.map(b=><ProofBadge key={b.id} badge={b}/>)}</div>
          </div>
        )}
        {tab==="portfolio"&&(
          <div className="fi">
            <div style={{marginBottom:12,padding:"10px 12px",borderRadius:10,background:"#EBF0FF",border:"1px solid rgba(26,79,214,.15)"}}><div style={{fontSize:12,fontWeight:700,color:"#1A4FD6",marginBottom:2}}>📂 Challenge Portfolio</div><div style={{fontSize:10,color:"var(--muted)"}}>Each completed challenge is proof of real skill.</div></div>
            {history.map((h,i)=>(
              <div key={i} className="card2" style={{padding:"12px",marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:12,color:"var(--text)",marginBottom:3}}>{h.title}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginBottom:7}}>{h.sponsor} · {h.completedAgo}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50,background:"#EBF0FF",color:"var(--blue)",border:"1px solid rgba(26,79,214,.2)"}}>{h.result}</span>
                  {h.badge&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50,background:"#FFF8E6",color:"#B97200",border:"1px solid rgba(185,114,0,.2)"}}>{h.badge}</span>}
                  <XPTag xp={h.xpEarned}/>
                </div>
              </div>
            ))}
            <button onClick={()=>onNav("challenge-portfolio")} className="btn-ghost" style={{marginTop:8}}>View full portfolio →</button>
          </div>
        )}
      </div>
      <BottomNav onNav={onNav} active="profile"/>
    </div>
  );
}



// ─── Comment Drawer ───────────────────────────────────────────────────────────
function CommentDrawer({post,onClose,onAddComment,currentUser}) {
  const [input,setInput]=useState("");
  const [comments,setComments]=useState(post._comments||[
    {id:1,name:"Priya Menon",  avatar:ALL_AVATARS[0], text:"Great progress! Keep it up 💪", time:"2h ago",  likes:12},
    {id:2,name:"Kavya Reddy",  avatar:ALL_AVATARS[7], text:"Which resource are you using for this?", time:"1h ago", likes:5},
    {id:3,name:"Ishaan Verma", avatar:ALL_AVATARS[2], text:"Same struggle here, it clicked on day 3 for me too!", time:"45m ago",likes:8},
  ]);
  const submit=()=>{
    if(!input.trim()) return;
    const c={id:Date.now(),name:currentUser.name,avatar:currentUser.avatar,text:input.trim(),time:"just now",likes:0};
    setComments(p=>[...p,c]);
    onAddComment&&onAddComment(post.id,c);
    setInput("");
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(15,28,63,.5)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"10px 16px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--b1)"}}>
          <div style={{fontWeight:700,fontSize:14,color:"var(--text)"}}>Comments · {comments.length}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",fontSize:18,lineHeight:1}}>✕</button>
        </div>
        {/* Original post snippet */}
        <div style={{padding:"10px 16px",borderBottom:"1px solid var(--b1)",background:"#F8FAFF"}}>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <Av src={post.avatar} size={30}/>
            <div>
              <div style={{fontWeight:700,fontSize:11,color:"var(--text)"}}>{post.name}</div>
              <div style={{fontSize:11,color:"var(--sub)",lineHeight:1.5,marginTop:2}}>{post.text.slice(0,100)}{post.text.length>100?"…":""}</div>
            </div>
          </div>
        </div>
        {/* Comments list */}
        <div style={{overflowY:"auto",flex:1,padding:"10px 16px"}}>
          {comments.map(c=>(
            <div key={c.id} style={{display:"flex",gap:9,marginBottom:14}}>
              <Av src={c.avatar||ALL_AVATARS[0]} size={32}/>
              <div style={{flex:1}}>
                <div style={{background:"#F4F7FD",borderRadius:"0 12px 12px 12px",padding:"8px 12px"}}>
                  <div style={{fontWeight:700,fontSize:11,color:"var(--text)",marginBottom:3}}>{c.name}</div>
                  <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.55}}>{c.text}</div>
                </div>
                <div style={{display:"flex",gap:12,marginTop:4,paddingLeft:4}}>
                  <span style={{fontSize:10,color:"var(--muted)"}}>{c.time}</span>
                  <span style={{fontSize:10,color:"var(--muted)",cursor:"pointer"}}>❤️ {c.likes}</span>
                  <span style={{fontSize:10,color:"var(--blue)",cursor:"pointer",fontWeight:600}}>Reply</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{padding:"10px 14px 20px",borderTop:"1px solid var(--b1)",display:"flex",gap:8,alignItems:"center",background:"#fff"}}>
          <Av src={currentUser.avatar} size={32}/>
          <div style={{flex:1,display:"flex",gap:6,alignItems:"center",background:"#F4F7FD",borderRadius:50,padding:"6px 14px 6px 12px",border:"1.5px solid var(--b2)"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Add a comment…" style={{flex:1,background:"none",border:"none",outline:"none",fontSize:12,color:"var(--text)"}}/>
            <button onClick={submit} style={{background:"none",border:"none",color:input.trim()?"var(--blue)":"var(--muted)",fontWeight:700,fontSize:12,flexShrink:0}}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Share Sheet ───────────────────────────────────────────────────────────────
function ShareSheet({post,onClose}) {
  const [copied,setCopied]=useState(false);
  const link=`https://learnloop.app/post/${post.id}`;
  const copy=()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const options=[
    {icon:"📋", label:"Copy Link",  action:copy},
    {icon:"💬", label:"WhatsApp",   action:()=>{}},
    {icon:"📸", label:"Instagram",  action:()=>{}},
    {icon:"🐦", label:"Twitter/X",  action:()=>{}},
    {icon:"✉️",  label:"Email",     action:()=>{}},
  ];
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(15,28,63,.5)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",padding:"16px 16px 30px"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,borderRadius:2,background:"#E2E8F4",margin:"0 auto 14px"}}/>
        <div style={{fontWeight:700,fontSize:14,color:"var(--text)",marginBottom:14}}>Share post</div>
        {/* Post preview */}
        <div style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:12,background:"#F4F7FD",border:"1px solid var(--b1)",marginBottom:16}}>
          <Av src={post.avatar} size={36}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{post.name}</div>
            <div style={{fontSize:11,color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.text.slice(0,60)}…</div>
          </div>
        </div>
        {/* Link copy */}
        <div style={{display:"flex",gap:8,alignItems:"center",padding:"9px 12px",borderRadius:10,background:"#EBF0FF",border:"1.5px solid rgba(26,79,214,.2)",marginBottom:16}}>
          <span style={{fontSize:11,color:"var(--blue)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'JetBrains Mono',monospace"}}>{link}</span>
          <button onClick={copy} style={{padding:"5px 12px",borderRadius:7,background:"#1A4FD6",color:"#fff",border:"none",fontSize:11,fontWeight:700,flexShrink:0}}>{copied?"Copied!":"Copy"}</button>
        </div>
        {/* Share options */}
        <div style={{display:"flex",gap:10,justifyContent:"space-around"}}>
          {options.map(o=>(
            <button key={o.label} onClick={()=>{o.action();}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer"}}>
              <div style={{width:48,height:48,borderRadius:14,background:"#F4F7FD",border:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{o.icon}</div>
              <span style={{fontSize:9,color:"var(--muted)",fontWeight:600}}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Student Profile (view any user) ─────────────────────────────────────────
function StudentProfile({studentId,onBack,onFollow,followed}) {
  const s=STUDENTS.find(x=>x.id===studentId)||STUDENTS[0];
  const posts=FEED_POSTS.filter(p=>p.studentId===s.id);
  const isFollowed=followed.includes(s.id);
  const [tab,setTab]=useState("posts");
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"var(--bg)",overflowY:"auto",animation:"slideInRight .25s ease"}}>
      {/* Cover banner */}
      <div style={{position:"relative",height:160,background:`linear-gradient(135deg,${STREAM[s.stream]?.color||"#1A4FD6"}cc,#0F1C3F)`,overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
        {/* decorative circles */}
        <div style={{position:"absolute",right:-40,top:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
        <div style={{position:"absolute",right:40,bottom:-30,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        {/* back button */}
        <button onClick={onBack} style={{position:"absolute",top:14,left:14,width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,.3)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",zIndex:2}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        {/* stream badge top right */}
        <div style={{position:"absolute",top:14,right:14,zIndex:2}}>
          <StreamPill stream={s.stream} size="sm"/>
        </div>
        {/* exam countdown pill */}
        <div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.35)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.15)",borderRadius:50,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:10,fontWeight:800,color:"#FFD580"}}>⏳</span>
          <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.9)"}}>{s.daysToExam} days to {s.exam}</span>
        </div>
      </div>

      {/* Avatar row — pops out of banner */}
      <div style={{maxWidth:600,margin:"0 auto",padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginTop:-44,marginBottom:12,position:"relative",zIndex:2}}>
          <div style={{position:"relative"}}>
            <img src={s.avatar} width={88} height={88} alt="" style={{borderRadius:"50%",border:"4px solid var(--bg)",background:"#E8EEF8",display:"block",boxShadow:"0 4px 20px rgba(15,28,63,.18)"}}/>
            {(s.id===1||s.id===8)&&<div style={{position:"absolute",bottom:4,right:4,width:16,height:16,background:"#0A9B6A",borderRadius:"50%",border:"2.5px solid var(--bg)"}} className="pulse-dot"/>}
            {s.verified&&<div style={{position:"absolute",bottom:2,right:2,width:22,height:22,background:"#0A9B6A",borderRadius:"50%",border:"2.5px solid var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"white",fontWeight:900}}>✓</div>}
          </div>
          <div style={{display:"flex",gap:8,paddingBottom:6}}>
            <button onClick={()=>onFollow(s.id)} style={{padding:"9px 20px",borderRadius:50,background:isFollowed?"#fff":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",color:isFollowed?"#1A4FD6":"#fff",border:isFollowed?"1.5px solid rgba(26,79,214,.3)":"none",fontWeight:800,fontSize:12,boxShadow:isFollowed?"none":"0 3px 12px rgba(26,79,214,.3)"}}>
              {isFollowed?"✓ Following":"+ Follow"}
            </button>
          </div>
        </div>

        {/* Name + meta */}
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
            <span style={{fontWeight:900,fontSize:20,color:"var(--text)",letterSpacing:"-.02em"}}>{s.name}</span>
            {s.verified&&<span style={{fontSize:9,fontWeight:800,color:"#0A9B6A",background:"rgba(10,155,106,.12)",padding:"2px 8px",borderRadius:50,border:"1px solid rgba(10,155,106,.2)",letterSpacing:".02em"}}>✔ VERIFIED</span>}
            <span style={{fontSize:10,fontWeight:700,color:"#B97200",background:"#FFF8E6",padding:"2px 9px",borderRadius:50,border:"1px solid rgba(185,114,0,.2)"}}>{s.rankLabel}</span>
          </div>
          <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>📍 {s.city} &nbsp;·&nbsp; 🎯 {s.goal}</div>
          {/* Syllabus progress bar */}
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:600,color:"var(--sub)"}}>Syllabus Progress</span>
              <span style={{fontSize:11,fontWeight:800,color:"var(--blue)",fontFamily:"'JetBrains Mono',monospace"}}>{s.syllabusPct}%</span>
            </div>
            <div style={{height:7,borderRadius:4,background:"rgba(15,28,63,.08)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${s.syllabusPct}%`,background:`linear-gradient(90deg,${STREAM[s.stream]?.color||"#1A4FD6"},#3B5CE8)`,borderRadius:4,transition:"width .8s ease"}}/>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {[["🔥",s.streak,"Streak"],["⚡",s.xp>999?(s.xp/1000).toFixed(1)+"k":s.xp,"XP"],["🏆",s.challengesWon,"Won"],["📥",s.noteDownloads>999?(s.noteDownloads/1000).toFixed(1)+"k":s.noteDownloads,"DLs"]].map(([em,n,l])=>(
            <div key={l} style={{background:"#fff",borderRadius:14,padding:"12px 6px",textAlign:"center",border:"1px solid var(--b1)",boxShadow:"0 1px 6px rgba(15,28,63,.05)"}}>
              <div style={{fontSize:16,marginBottom:3}}>{em}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:15,color:"var(--text)"}}>{n}</div>
              <div style={{fontSize:9,color:"var(--muted)",marginTop:2,fontWeight:600,letterSpacing:".02em",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>{/* end avatar row container */}

      <div style={{maxWidth:600,margin:"0 auto",padding:"0 16px 90px"}}>
        {/* Goal card */}
        <div className="card" style={{padding:"14px 16px",marginBottom:14,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)"}}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(147,197,253,.9)",letterSpacing:".04em",marginBottom:5}}>🎯 GOAL</div>
          <div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:8}}>{s.goal}</div>
          <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,.15)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${s.syllabusPct}%`,background:"linear-gradient(90deg,#60A5FA,#93C5FD)",borderRadius:2}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:"rgba(255,255,255,.4)"}}>
            <span>{s.syllabusPct}% complete</span><span>{s.daysToExam} days left</span>
          </div>
        </div>
        {/* Skills */}
        <div className="card" style={{padding:"14px 16px",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:10}}>Skills</div>
          {s.skillLevels.map(([sk,pct,col])=>(
            <div key={sk} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600,color:"var(--sub)"}}>{sk}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:col,fontWeight:700}}>{pct}%</span></div>
              <div className="skill-bar"><div className="skill-fill" style={{width:`${pct}%`,background:col}}/></div>
            </div>
          ))}
        </div>
        {/* Tabs: Posts */}
        <div style={{display:"flex",borderBottom:"1px solid var(--b1)",marginBottom:12}}>
          {[["posts",`📝 Posts (${posts.length})`],["about","About"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px",background:"none",border:"none",borderBottom:tab===k?"2px solid var(--blue)":"2px solid transparent",color:tab===k?"var(--blue)":"var(--muted)",fontWeight:tab===k?700:500,fontSize:12}}>{l}</button>
          ))}
        </div>
        {tab==="posts"&&(
          <div className="fi">
            {posts.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"var(--muted)",fontSize:12}}>No posts yet</div>}
            {posts.map(p=>(
              <div key={p.id} className="card" style={{marginBottom:10,overflow:"hidden"}}>
                {p.imageUrl&&<img src={p.imageUrl} alt="" style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>}
                <div style={{padding:"10px 13px"}}>
                  <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>{p.subject} · {p.time}</div>
                  <p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,marginBottom:6}}>{p.text}</p>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>{p.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
                  <div style={{display:"flex",gap:12,fontSize:11,color:"var(--muted)"}}>
                    <span>❤️ {p.likes}</span><span>💬 {p.comments}</span><span>🔖 {p.saves}</span>
                    <span style={{marginLeft:"auto"}}><XPTag xp={p.xp}/></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="about"&&(
          <div className="fi card" style={{padding:"14px 16px"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[["📍","City",s.city],["🎯","Exam",s.exam],["📅","Streak",`${s.streak} days`],["⚡","Total XP",`${s.xp.toLocaleString()} XP`],["📥","Note Downloads",s.noteDownloads.toLocaleString()],["✅","Syllabus",`${s.syllabusPct}% done`]].map(([ic,l,v])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16,width:26,textAlign:"center"}}>{ic}</span>
                  <span style={{fontSize:12,color:"var(--muted)",minWidth:100}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
function Feed({onNav,user,notifs,notifCount,onMarkAllRead,challenges,submissions,onViewProfile,followed,onFollow}) {
  const [showNotifs,setShowNotifs]=useState(false);
  const [liked,setLiked]=useState([]);
  const [commentPost,setCommentPost]=useState(null);
  const [sharePost,setSharePost]=useState(null);
  const [postComments,setPostComments]=useState({});
  const addComment=(postId,c)=>setPostComments(p=>({...p,[postId]:[...(p[postId]||[]),c]}));
  const toggleFollow=id=>onFollow(id);
  // Infinite shuffled feed — Instagram-style random every time
  const shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const shuffledRef=useRef(shuffle(FEED_POSTS));
  const loaderRef=useRef(null);
  const indexRef=useRef(0);
  const keyRef=useRef(0);
  const [displayPosts,setDisplayPosts]=useState(()=>{
    const batch=shuffledRef.current.slice(0,15);
    indexRef.current=15;
    keyRef.current=15;
    return batch.map((p,i)=>({...p,_key:i}));
  });

  // Append next shuffled batch, re-shuffle when deck exhausted
  const appendMore=useCallback(()=>{
    setDisplayPosts(prev=>{
      const next=[];
      for(let i=0;i<8;i++){
        if(indexRef.current>=shuffledRef.current.length){
          shuffledRef.current=shuffle(FEED_POSTS); // re-shuffle for next cycle
          indexRef.current=0;
        }
        const src=shuffledRef.current[indexRef.current];
        next.push({...src,_key:keyRef.current});
        indexRef.current++;
        keyRef.current++;
      }
      return [...prev,...next];
    });
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting) appendMore();
    },{threshold:0.1});
    if(loaderRef.current) obs.observe(loaderRef.current);
    return ()=>obs.disconnect();
  },[appendMore]);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      {showNotifs&&<NotifPanel notifs={notifs} onClose={()=>setShowNotifs(false)} onMarkAllRead={()=>{onMarkAllRead();setShowNotifs(false);}}/>}
      <CompanyTicker/>
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>onViewProfile(user.id)}>
            <Av src={user.avatar} size={38} ring="#60A5FA" online/>
            <div><div style={{fontSize:10,color:"var(--muted)"}}>Hello 🌟</div><div style={{fontSize:15,fontWeight:800,color:"var(--text)",letterSpacing:"-.02em"}}>{user.name}</div></div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>onNav("challenges")} style={{padding:"7px 11px",borderRadius:9,background:"#EBF0FF",border:"1px solid rgba(26,79,214,.25)",color:"var(--blue)",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",gap:4}}>
              🏆 <span>Challenges</span><span style={{padding:"1px 5px",borderRadius:50,background:"rgba(26,79,214,.2)",fontSize:9,fontWeight:900}}>{challenges.length}</span>
            </button>
            <button onClick={()=>setShowNotifs(true)} style={{position:"relative",width:36,height:36,borderRadius:"50%",background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifCount>0&&<span style={{position:"absolute",top:7,right:7,width:9,height:9,background:"#EF4444",borderRadius:"50%",border:"1.5px solid var(--bg)"}}/>}
            </button>
          </div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",paddingBottom:90}}>
        <div style={{margin:"12px 14px 0"}}>
          <div style={{borderRadius:16,background:"linear-gradient(135deg,#0F1C3F,#1A4FD6)",padding:"16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-30,top:-30,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
            <div style={{display:"flex",gap:12,alignItems:"center",position:"relative"}}>
              <div style={{width:46,height:46,borderRadius:13,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>⚡</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:3,lineHeight:1.3}}>NVIDIA posted a ₹50,000 challenge — 12 days left</div><div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>Build an AI Study Scheduler. Winner gets internship track.</div></div>
              <button onClick={()=>onNav("challenges")} style={{padding:"9px 14px",borderRadius:10,background:"#FFFFFF",color:"#1A4FD6",border:"none",fontWeight:800,fontSize:12,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>Enter →</button>
            </div>
          </div>
        </div>
        <div style={{margin:"10px 14px 0"}}>
          <div className="card" style={{padding:"13px 15px",display:"flex",gap:12,alignItems:"center",border:"1.5px solid rgba(224,87,32,.18)"}}>
            <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#E85D20,#C2185B)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 3px 10px rgba(232,93,32,.3)"}}>🔥</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:800,color:"var(--text)"}}>{user.streak}-Day Streak · Don't break it!</div>
              <div style={{height:5,borderRadius:3,background:"rgba(232,93,32,.12)",overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${Math.min(100,(user.streak/100)*100)}%`,background:"linear-gradient(90deg,#E85D20,#1A4FD6)",borderRadius:3}}/></div>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:800,color:"#E85D20"}}>{user.streak}</div>
          </div>
        </div>
        <div style={{padding:"10px 14px 0"}}>
          {displayPosts.map(p=>{
            const s=STUDENTS.find(st=>st.id===p.studentId)||{};
            const isLiked=liked.includes(p._key);
            const isFollowed=followed.includes(p.studentId);
            return (
              <div key={p._key} className="card hover" style={{marginBottom:12,overflow:"hidden"}}>
                {p.imageUrl&&(
                  <div style={{position:"relative"}}>
                    <img src={p.imageUrl} alt="" style={{width:"100%",height:210,objectFit:"cover",display:"block"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.15) 0%,transparent 35%,transparent 55%,rgba(0,0,0,.38) 100%)"}}/>
                    <div style={{position:"absolute",top:10,left:11,display:"flex",gap:6}}>
                      <span style={{background:"rgba(0,0,0,.45)",backdropFilter:"blur(6px)",color:"#FFD580",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:50}}>🔥 {p.day}</span>
                      <span style={{background:"rgba(0,0,0,.45)",backdropFilter:"blur(6px)",color:"#6EE8B4",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:50}}>⏱ {p.hours}h</span>
                    </div>
                    <div style={{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{display:"flex",alignItems:"center"}}>
                        {[0,1,2].map(i=>(
                          <img key={i} src={STUDENTS[(p.studentId+i)%STUDENTS.length].avatar} width={24} height={24} alt="" style={{borderRadius:"50%",border:"2px solid rgba(255,255,255,.9)",marginLeft:i===0?0:-8,display:"block"}}/>
                        ))}
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,.5)"}}>
                        {(p.likes+(isLiked?1:0))>=1000?((p.likes+(isLiked?1:0))/1000).toFixed(0)+"K":(p.likes+(isLiked?1:0)).toLocaleString()} Liked
                      </span>
                    </div>
                  </div>
                )}
                <div style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:9}}>
                    <div style={{cursor:"pointer"}} onClick={()=>onViewProfile(p.studentId)}>
                      <Av src={p.avatar} size={34} ring={STREAM[p.stream]?.color} online={p.studentId===1} verified={s.verified}/>
                    </div>
                    <div style={{flex:1,cursor:"pointer"}} onClick={()=>onViewProfile(p.studentId)}>
                      <div style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{p.name}</div>
                      <div style={{fontSize:10,color:"var(--muted)"}}>{p.subject} · {p.time}</div>
                    </div>
                    <XPTag xp={p.xp}/>
                    <button onClick={()=>toggleFollow(p.studentId)} style={{padding:"6px 14px",borderRadius:20,background:isFollowed?"#F0F2F5":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",border:"none",color:isFollowed?"#888":"#fff",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                      {isFollowed?"Following":"+ Follow"}
                    </button>
                  </div>
                  <p style={{fontSize:12,lineHeight:1.65,color:"#3D5280",marginBottom:8,whiteSpace:"pre-line"}}>{p.text}</p>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:9}}>{p.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
                  {/* ── Engagement Row ── */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                    {/* Left: icons gap:18px */}
                    <div style={{display:"flex",alignItems:"center",gap:18}}>
                      <button onClick={()=>setLiked(l=>l.includes(p._key)?l.filter(x=>x!==p._key):[...l,p._key])} style={{background:"none",border:"none",padding:0,cursor:"pointer",lineHeight:0}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill={isLiked?"#E0245E":"none"} stroke={isLiked?"#E0245E":"#1A1A1A"} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                      <button onClick={()=>setCommentPost(p)} style={{background:"none",border:"none",padding:0,cursor:"pointer",lineHeight:0}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </button>
                      <button onClick={()=>setSharePost(p)} style={{background:"none",border:"none",padding:0,cursor:"pointer",lineHeight:0}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                      <button style={{background:"none",border:"none",padding:0,cursor:"pointer",lineHeight:0}}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><line x1="18" y1="8" x2="20" y2="6"/><line x1="19" y1="6" x2="20" y2="8"/></svg>
                      </button>
                    </div>

                  </div>
                  {/* ── Time + liked-by line ── */}
                  <div style={{marginTop:6}}>
                    <div style={{fontSize:11,color:"#aaa",marginBottom:2}}>{p.time}</div>
                    <div style={{fontSize:12,color:"#555"}}>
                      <span style={{fontWeight:700,color:"var(--text)"}}>{STUDENTS[(p.studentId+1)%STUDENTS.length].name.split(" ")[0]}</span>
                      {", "}
                      <span style={{fontWeight:700,color:"var(--text)"}}>{STUDENTS[(p.studentId+3)%STUDENTS.length].name.split(" ")[0]}</span>
                      {" and others liked this post"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} style={{height:60,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:24,height:24,borderRadius:"50%",border:"2.5px solid var(--b2)",borderTopColor:"var(--blue)",animation:"spin .7s linear infinite"}}/>
          </div>
        </div>
      </div>
      {commentPost&&<CommentDrawer post={commentPost} onClose={()=>setCommentPost(null)} onAddComment={addComment} currentUser={user}/>}
      {sharePost&&<ShareSheet post={sharePost} onClose={()=>setSharePost(null)}/>}
      <BottomNav onNav={k=>k==="profile"?onViewProfile(user.id):onNav(k)} active="feed" notifCount={notifCount}/>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <div className="auth-panel" style={{width:440,flexShrink:0,background:"#0F1C3F",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 40px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:42}}>
            <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,#1A4FD6,#3B5CE8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🔁</div>
            <div><div style={{color:"white",fontWeight:900,fontSize:21,letterSpacing:"-.03em"}}>LearnLoop</div><div style={{color:"rgba(255,255,255,.3)",fontSize:9,fontWeight:700,letterSpacing:".07em"}}>STUDY · BUILD · COMPETE · GET HIRED</div></div>
          </div>
          <h2 style={{color:"white",fontSize:26,fontWeight:900,lineHeight:1.1,letterSpacing:"-.03em",marginBottom:12}}>Study → Build → Win<br/>→ Get hired.</h2>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:13,lineHeight:1.75,marginBottom:28}}>The platform where NEET & JEE preparation builds a verifiable career portfolio.</p>
          {[["📅","Daily streaks build verified study history"],["🏆","Challenges = real proof of skill"],["🔨","Build projects companies actually use"],["💼","Companies hire from the challenge leaderboard"]].map(([ic,tx])=>(
            <div key={tx} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ic}</div>
              <span style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{tx}</span>
            </div>
          ))}
        </div>
        <div style={{position:"relative",zIndex:1,background:"rgba(255,255,255,.07)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,.12)"}}>
          <p style={{color:"rgba(255,255,255,.75)",fontSize:12,lineHeight:1.6,marginBottom:6}}>"Won the Unacademy Physics Challenge while still studying for JEE. Got hired before my board exams."</p>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:11}}>— Ishaan V., LearnLoop 2024</p>
        </div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px",background:"#EFF4FB",overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:360}} className="fu">
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:28}}>
            <div style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#1A4FD6,#3B5CE8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🔁</div>
            <div><div style={{fontWeight:900,fontSize:15,color:"var(--text)",letterSpacing:"-.03em"}}>LearnLoop</div><div style={{fontSize:9,color:"var(--muted)",fontWeight:700,letterSpacing:".06em"}}>STUDY · BUILD · COMPETE · GET HIRED</div></div>
          </div>
          <h1 style={{fontSize:20,fontWeight:800,color:"var(--text)",marginBottom:4}}>Welcome back 👋</h1>
          <p style={{color:"var(--muted)",fontSize:12,marginBottom:22}}>Your streak, challenges, and rank are waiting.</p>
          <button onClick={onLogin} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"11px",background:"#EEF2FF",border:"1.5px solid var(--b2)",borderRadius:11,fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:16,cursor:"pointer"}}>
            <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34D399"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{flex:1,height:1,background:"#EBF0FF"}}/><span style={{color:"var(--muted)",fontSize:11}}>or</span><div style={{flex:1,height:1,background:"#EBF0FF"}}/>
          </div>
          {[["Email","email","you@example.com",email,setEmail],["Password","password","Your password",pw,setPw]].map(([l,t,ph,v,sv])=>(
            <div key={l} style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"var(--sub)",marginBottom:5}}>{l}</label>
              <input className="inp" style={{paddingLeft:14}} type={t} placeholder={ph} value={v} onChange={e=>sv(e.target.value)}/>
            </div>
          ))}
          <button className="btn-primary" onClick={onLogin} style={{marginTop:6}}>Sign in →</button>
          <p style={{textAlign:"center",marginTop:16,fontSize:11,color:"var(--muted)"}}>New? <span style={{color:"var(--blue)",fontWeight:700,cursor:"pointer"}} onClick={onLogin}>Create free account</span></p>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("login");
  const [activeChallenge,setActiveChallenge]=useState(null);
  const [user,setUser]=useState(INIT_USER);
  const [notifs,setNotifs]=useState(INIT_NOTIFS);
  const [submissions,setSubmissions]=useState(INIT_SUBMISSIONS);
  const [history,setHistory]=useState(INIT_HISTORY);
  const [viewStudentId,setViewStudentId]=useState(null);
  const [followed,setFollowed]=useState([]);
  const toggleFollow=id=>setFollowed(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);

  useEffect(()=>{
    // Inject Google Fonts
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap";
    document.head.appendChild(link);
    // Inject CSS
    const style=document.createElement("style");
    style.textContent=css;
    document.head.appendChild(style);
    return()=>{document.head.removeChild(link);document.head.removeChild(style);};
  },[]);

  const navigate=p=>{setActiveChallenge(null);setPage(p);};
  const unread=notifs.filter(n=>!n.read).length;
  const markAllRead=()=>setNotifs(n=>n.map(x=>({...x,read:true})));

  const voteSubmission=id=>setSubmissions(p=>p.map(s=>{
    if(s.id!==id||s.votedBy?.includes(user.id)) return s;
    return {...s,votes:s.votes+1,votedBy:[...(s.votedBy||[]),user.id]};
  }));

  const commentOnSubmission=(subId,text)=>setSubmissions(p=>p.map(s=>{
    if(s.id!==subId) return s;
    return {...s,comments:[...s.comments,{name:user.name,avatar:user.avatar,text,time:"just now"}]};
  }));

  const submitChallenge=(challengeId,title,text)=>{
    const c=CHALLENGES.find(ch=>ch.id===challengeId); if(!c) return;
    setSubmissions(p=>[...p,{id:p.length+1,challengeId,studentId:user.id,title,desc:text.slice(0,200),votes:0,comments:[],xpEarned:c.xpReward,rank:p.filter(s=>s.challengeId===challengeId).length+1,timeAgo:"just now",tags:c.skills.map(sk=>`#${sk.toLowerCase().replace(" ","")}`),featured:false,votedBy:[]}]);
    setUser(p=>({...p,xp:p.xp+c.xpReward,submittedChallenges:[...(p.submittedChallenges||[]),challengeId]}));
    setHistory(p=>[{id:p.length+1,title:c.title,sponsor:c.sponsor||"Weekly",result:"Submitted",xpEarned:c.xpReward,badge:null,completedAgo:"just now"},...p]);
    setNotifs(p=>[{id:p.length+1,text:`Submitted to ${c.title} — +${c.xpReward} XP!`,time:"just now",read:false,icon:"⚡"},...p]);
  };

  const shared={onNav:navigate,user,notifs,notifCount:unread,submissions,challenges:CHALLENGES,onMarkAllRead:markAllRead,onVoteSubmission:voteSubmission,onCommentSubmission:commentOnSubmission,onViewProfile:setViewStudentId,followed,onFollow:toggleFollow};

  if(activeChallenge) return (
    <><ChallengeDetail c={activeChallenge} onBack={()=>setActiveChallenge(null)} user={user} submissions={submissions} onVoteSubmission={voteSubmission} onCommentSubmission={commentOnSubmission} onSubmitChallenge={submitChallenge}/></>
  );

  const pages={
    login:                ()=><Login onLogin={()=>navigate("feed")}/>,
    feed:                 ()=><Feed {...shared}/>,
    challenges:           ()=><Challenges {...shared} onOpenChallenge={setActiveChallenge}/>,
    opportunities:        ()=><Opportunities {...shared}/>,
    showcase:             ()=><Showcase {...shared}/>,
    profile:              ()=><Profile {...shared} history={history}/>,
    "challenge-portfolio":()=><ChallengePortfolio onBack={()=>navigate("profile")} user={user} history={history}/>,
  };

  const Page=pages[page]||pages["login"];
  return <>
    <Page/>
    {viewStudentId!=null&&<StudentProfile studentId={viewStudentId} onBack={()=>setViewStudentId(null)} onFollow={toggleFollow} followed={followed}/>}
  </>;
}
