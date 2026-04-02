import { useState, useEffect, useRef, useCallback, Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{padding:24,fontFamily:"monospace",background:"#fff0f0",minHeight:"100vh"}}>
        <h2 style={{color:"#c00",marginBottom:12}}>Runtime Error</h2>
        <pre style={{whiteSpace:"pre-wrap",fontSize:13,color:"#333"}}>{this.state.error?.message}</pre>
        <pre style={{whiteSpace:"pre-wrap",fontSize:11,color:"#888",marginTop:12}}>{this.state.error?.stack}</pre>
      </div>
    );
    return this.props.children;
  }
}

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
    text:"WON THE UNACADEMY PHYSICS CHALLENGE. 🥇\n\nRank 1 out of 312 submissions.\n\nBuilt the projectile simulator in React + Canvas API. Got an email from Unacademy HR this morning for an internship interview.\n\nI was just a student 3 months ago.\n\nInfinity literally changed the trajectory (pun intended 🎯) of my life.\n\nBuilding in public works. Submit to challenges. GET. SEEN.",
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
  { id:6, text:"🔥 Don't break your 47-day streak! Log your study session today before midnight.", time:"4h ago", read:false, icon:"🔥" },
  { id:7, text:"⚠️ You dropped from #2 to #4 on the JEE Physics leaderboard. Ishaan Verma overtook you!", time:"5h ago", read:false, icon:"⚠️" },
  { id:8, text:"Kavya Reddy commented on your answer: \"This is the clearest explanation I've seen 🔥\"", time:"6h ago", read:false, icon:"💬" },
];

const DAILY_QUESTIONS = [
  {
    id:1,
    date:"Today",
    category:"🧠 Focus & Attention",
    question:"You sit down to study. Within 5 minutes your phone buzzes. What do you do?",
    options:["Check it immediately — might be important","Ignore it and keep studying","Check it quickly then get back","Put it face-down but keep thinking about it"],
    insights:[
      {title:"Impulse Responder",emoji:"⚡",color:"#EF4444",insight:"You prioritise immediate stimuli over long-term goals. Your brain's reward circuit fires strongly. Practice: 25-min phone-free blocks. Start with 1 per day.",tip:"Your dopamine system is highly reactive. Use it — reward yourself AFTER the block."},
      {title:"Deep Focuser",emoji:"🎯",color:"#0A9B6A",insight:"Strong prefrontal cortex control. You can delay gratification — a key predictor of exam success. Your brain enters flow states more easily.",tip:"You have a rare cognitive edge. Protect your deep work time fiercely — it's your superpower."},
      {title:"Balanced Checker",emoji:"⚖️",color:"#F59E0B",insight:"You compromise between focus and social awareness. Moderate impulse control. The 'quick check' often becomes 5 minutes — build stricter rules.",tip:"Try the 'parking lot' method: write down what you want to check, do it only after the session."},
      {title:"Anxious Ignorer",emoji:"😰",color:"#7C3AED",insight:"You resist the urge but it occupies mental bandwidth — a form of 'cognitive leakage'. Your willpower is draining just by resisting.",tip:"Remove the temptation entirely. Phone in another room = 40% better focus. Don't fight your brain — design around it."},
    ],
    xp:50, participants:1247,
  },
  {
    id:2,
    date:"Yesterday",
    category:"😴 Memory & Sleep",
    question:"You studied a topic last night. This morning you can barely recall it. Your first thought is:",
    options:["I'm just bad at this subject","I didn't study hard enough","I probably didn't sleep enough","The topic is genuinely difficult"],
    insights:[
      {title:"Self-Doubter",emoji:"😔",color:"#EF4444",insight:"You attribute memory failure to fixed ability. This is the 'fixed mindset' pattern. Memory is a skill, not a trait — it's trainable.",tip:"Reframe: 'I haven't learned HOW to retain this yet.' Spaced repetition is your fix, not more hours."},
      {title:"Effort Blamer",emoji:"📚",color:"#F59E0B",insight:"You believe in effort — good! But you may be studying inefficiently. More hours ≠ better retention without the right techniques.",tip:"Add active recall: close the book, write what you remember. This doubles retention vs rereading."},
      {title:"Sleep Scientist",emoji:"🌙",color:"#0A9B6A",insight:"You're right. Memory consolidation happens during sleep — specifically in REM. Without 7-8 hours, memories don't transfer to long-term storage.",tip:"Sleep is not laziness. It's when your brain literally saves your study session to disk."},
      {title:"Task Analyst",emoji:"🔬",color:"#1A4FD6",insight:"Objective thinking — good. But difficulty alone doesn't explain forgetting. The brain forgets 80% of new info within 24hrs without review.",tip:"Use the Ebbinghaus curve: review at 1 day, 3 days, 7 days, 21 days. This beats all other methods."},
    ],
    xp:45, participants:1089,
  },
  {
    id:3,
    date:"2 days ago",
    category:"😤 Stress & Performance",
    question:"Mock exam tomorrow. You feel your heart rate rising while studying tonight. You:",
    options:["Push through — no time for feelings","Tell yourself to calm down","Take 5 deep breaths and refocus","Convince yourself exams don't matter"],
    insights:[
      {title:"Suppressor",emoji:"💪",color:"#EF4444",insight:"Pushing through anxiety spikes cortisol, which directly impairs memory encoding. What you study while highly stressed is harder to recall under pressure.",tip:"Your body is signalling overload. Ignoring it costs performance. Stress management = exam performance."},
      {title:"Verbal Calmer",emoji:"🗣️",color:"#F59E0B",insight:"Telling yourself to calm down often backfires — it focuses attention on the anxiety. Research shows this raises heart rate further.",tip:"Instead say: 'I'm excited.' Reframing anxiety as excitement uses the same physiological state but improves performance by 22%."},
      {title:"Physiological Reset",emoji:"🫁",color:"#0A9B6A",insight:"5 deep breaths activates the vagus nerve, switching your nervous system from fight-or-flight to rest-and-digest. This is the single fastest evidence-based stress tool.",tip:"Try box breathing: 4 counts in, hold 4, out 4, hold 4. Used by Navy SEALs before high-stakes situations."},
      {title:"Minimiser",emoji:"🙈",color:"#7C3AED",insight:"Minimising the importance protects ego short-term but reduces motivation. Your brain won't allocate resources to things you've told it don't matter.",tip:"Healthy reframe: 'This matters AND I can handle it.' Both truths together build resilience without avoidance."},
    ],
    xp:55, participants:1356,
  },
  {
    id:4,
    date:"3 days ago",
    category:"🎯 Goal Setting",
    question:"You set a goal to study 10 hours today. By evening you've done 6. You feel:",
    options:["Like a failure — missed by 40%","Okay — 6 hours is still good","Motivated to make up tomorrow","Disappointed but analysing why"],
    insights:[
      {title:"All-or-Nothing Thinker",emoji:"⬛",color:"#EF4444",insight:"Binary thinking — you either hit the goal or failed. This cognitive pattern leads to the 'what-the-hell effect': since I failed, might as well quit entirely.",tip:"Progress > perfection. 6 hours of quality study beats 10 hours of distracted grinding. Measure consistency, not daily maximums."},
      {title:"Compassionate Realist",emoji:"✅",color:"#0A9B6A",insight:"Healthy self-assessment. You acknowledge effort without catastrophising. This emotional regulation pattern correlates with long-term study consistency.",tip:"This is the mindset of toppers. They don't beat themselves up — they adjust and continue."},
      {title:"Tomorrow Optimizer",emoji:"🔄",color:"#1A4FD6",insight:"Future-focused — good resilience signal. Watch for 'tomorrow' becoming a pattern. Consistent daily effort beats compensation spikes.",tip:"Ask: can I do 30 more minutes tonight instead? Small completions matter more than big catch-ups."},
      {title:"Analytical Reflector",emoji:"🔍",color:"#7C3AED",insight:"Self-awareness combined with analysis is a rare and powerful combination. You're using failure as data, not identity.",tip:"Keep a 2-line study journal: what worked, what didn't. This metacognitive habit can raise exam scores by 15-20%."},
    ],
    xp:50, participants:978,
  },
  {
    id:5,
    date:"4 days ago",
    category:"🧩 Learning Style",
    question:"You've read the same paragraph 4 times and still don't understand it. You:",
    options:["Read it a 5th time, slower","Skip it and come back later","Try to explain it aloud to yourself","Search for a video or diagram"],
    insights:[
      {title:"Persistence Looper",emoji:"🔁",color:"#EF4444",insight:"Re-reading the same text is the least effective study method (ranked last in cognitive science studies). More repetition of the same input = diminishing returns.",tip:"Switch input modality. If reading isn't working, your brain needs a different encoding pathway."},
      {title:"Strategic Skipper",emoji:"⏭️",color:"#F59E0B",insight:"Context-switching can help — sometimes later content clarifies earlier content. But avoidance disguised as strategy is common here.",tip:"Come back with a time limit: 'I'll revisit this in 10 mins.' If still stuck, that's your signal to change approach."},
      {title:"Verbal Processor",emoji:"🗣️",color:"#0A9B6A",insight:"Explaining aloud (the Feynman Technique) is one of the most powerful learning methods. It forces you to identify exactly where your understanding breaks down.",tip:"Can't explain it simply? That's where to focus. Teach it to an imaginary 10-year-old. Works for every subject."},
      {title:"Visual Learner",emoji:"🎨",color:"#7C3AED",insight:"Seeking visual context activates different neural pathways. Combining text + visual = dual-coding, which significantly improves retention.",tip:"Draw a diagram of every concept you study. Even a rough sketch activates spatial memory alongside verbal memory."},
    ],
    xp:45, participants:1123,
  },
];

const BATTLE_LEADERBOARD=[
  {rank:1,name:"Priya Menon",   avatar:ALL_AVATARS[0], streak:18, xp:900,  badge:"🥇"},
  {rank:2,name:"Kavya Reddy",   avatar:ALL_AVATARS[7], streak:15, xp:750,  badge:"🥈"},
  {rank:3,name:"Ishaan Verma",  avatar:ALL_AVATARS[2], streak:14, xp:700,  badge:"🥉"},
  {rank:4,name:"Aarav Sharma",  avatar:ALL_AVATARS[3], streak:12, xp:600,  badge:""},
  {rank:5,name:"Neha Gupta",    avatar:ALL_AVATARS[1], streak:11, xp:550,  badge:""},
  {rank:6,name:"Simran Kaur",   avatar:ALL_AVATARS[4], streak:9,  xp:450,  badge:""},
  {rank:7,name:"Rohan Desai",   avatar:ALL_AVATARS[5], streak:7,  xp:350,  badge:""},
  {rank:8,name:"Tanvi Shah",    avatar:ALL_AVATARS[8], streak:6,  xp:300,  badge:""},
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
  @keyframes slideDown{from{transform:translateY(-16px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
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

// ─── Chat Data ────────────────────────────────────────────────────────────────
const CHAT_THREADS = [
  {
    id:1, studentId:1,
    name:"Priya Menon", avatar:ALL_AVATARS[0], verified:true, online:true,
    lastMsg:"Did you finish the Organic Chem mock? 🔥", lastTime:"Just now", unread:3,
    msgs:[
      {id:1,  from:"them", text:"Hey Aarav! Have you started the Unacademy challenge?",        time:"10:02 AM"},
      {id:2,  from:"me",   text:"Just started it last night. The Physics section is tough 😅",  time:"10:04 AM"},
      {id:3,  from:"them", text:"Same! The wave optics problem took me 20 min",                 time:"10:05 AM"},
      {id:4,  from:"me",   text:"I got 68% on the mock. Not happy lol",                         time:"10:06 AM"},
      {id:5,  from:"them", text:"That's still better than me 😭 I got 61%",                     time:"10:08 AM"},
      {id:6,  from:"them", text:"Did you finish the Organic Chem mock? 🔥",                     time:"10:09 AM"},
    ]
  },
  {
    id:2, studentId:3,
    name:"Ishaan Verma", avatar:ALL_AVATARS[2], verified:true, online:true,
    lastMsg:"Bro the JEE paper leak rumours are wild 💀", lastTime:"3:24 PM", unread:1,
    msgs:[
      {id:1,  from:"them", text:"Yo did you see the new JEE mains schedule?",                   time:"3:10 PM"},
      {id:2,  from:"me",   text:"Yeah Jan 22 session. I'm nervous ngl",                         time:"3:12 PM"},
      {id:3,  from:"them", text:"Bro the JEE paper leak rumours are wild 💀",                   time:"3:24 PM"},
    ]
  },
  {
    id:3, studentId:8,
    name:"Kavya Reddy", avatar:ALL_AVATARS[7], verified:true, online:false,
    lastMsg:"Thank you!! Good luck to you too 💪", lastTime:"Yesterday", unread:0,
    msgs:[
      {id:1,  from:"me",   text:"Kavya your Bio notes are insane, saved my NEET prep 🙏",       time:"Yesterday"},
      {id:2,  from:"them", text:"Haha glad they helped! Took me weeks to make those",           time:"Yesterday"},
      {id:3,  from:"me",   text:"All the best for NEET! You're gonna crush it 🔥",              time:"Yesterday"},
      {id:4,  from:"them", text:"Thank you!! Good luck to you too 💪",                          time:"Yesterday"},
    ]
  },
];

// ─── Chat List ────────────────────────────────────────────────────────────────
function ChatList({onNav,user,onPost}) {
  const [openThread,setOpenThread]=useState(null);
  if(openThread!=null) return <ChatThread thread={CHAT_THREADS.find(t=>t.id===openThread)} user={user} onBack={()=>setOpenThread(null)}/>;
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{padding:"56px 20px 16px",position:"relative"}}>

        <div style={{position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <div style={{fontSize:26,fontWeight:900,color:"var(--text)",letterSpacing:"-.03em"}}>Messages</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)",marginTop:2}}>Stay connected with your study crew</div>
            </div>
            <button style={{width:40,height:40,borderRadius:"50%",background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
          {/* Search bar */}
          <div style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:14,padding:"11px 14px",border:"1px solid var(--b1)",boxShadow:"0 1px 4px rgba(15,28,63,.06)"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{fontSize:13,color:"rgba(255,255,255,.25)"}}>Search messages...</span>
          </div>
        </div>
      </div>

      {/* Active now row */}
      <div style={{padding:"0 20px 18px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:12}}>Active Now</div>
        <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:4}}>
          {/* New message button */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"#EEF2FF",border:"1.5px dashed rgba(26,79,214,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:600}}>New</span>
          </div>
          {CHAT_THREADS.filter(t=>t.online).map(t=>(
            <div key={t.id} onClick={()=>setOpenThread(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0,cursor:"pointer"}}>
              <div style={{position:"relative"}}>
                <div style={{width:56,height:56,borderRadius:"50%",padding:2,background:`conic-gradient(${STREAM[STUDENTS.find(s=>s.id===t.studentId)?.stream]?.color||"#1A4FD6"},#7C3AED,${STREAM[STUDENTS.find(s=>s.id===t.studentId)?.stream]?.color||"#1A4FD6"})`}}>
                  <img src={t.avatar} width={52} height={52} style={{borderRadius:"50%",display:"block",border:"2px solid #0D0F1A",objectFit:"cover"}}/>
                </div>
                <div style={{position:"absolute",bottom:2,right:2,width:12,height:12,borderRadius:"50%",background:"#0A9B6A",border:"2px solid #0D0F1A"}} className="pulse-dot"/>
              </div>
              <span style={{fontSize:10,color:"var(--sub)",fontWeight:600,maxWidth:56,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{height:1,background:"var(--b1)",margin:"0 0 4px"}}/>

      {/* Thread list */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",padding:"14px 20px 8px"}}>All Messages</div>
        {CHAT_THREADS.map(t=>(
          <div key={t.id} onClick={()=>setOpenThread(t.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",cursor:"pointer",borderBottom:"1px solid var(--b1)",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            {/* Avatar */}
            <div style={{position:"relative",flexShrink:0}}>
              <img src={t.avatar} width={54} height={54} style={{borderRadius:"50%",display:"block",border:`2px solid ${t.unread>0?"#1A4FD6":"var(--b1)"}`,objectFit:"cover"}}/>
              {t.online&&<div style={{position:"absolute",bottom:2,right:2,width:12,height:12,borderRadius:"50%",background:"#0A9B6A",border:"2px solid #0D0F1A"}} className="pulse-dot"/>}
            </div>
            {/* Content */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontWeight:t.unread>0?800:600,fontSize:14,color:t.unread>0?"var(--text)":"var(--sub)"}}>{t.name}</span>
                  {t.verified&&<span style={{fontSize:9,color:"#34D399"}}>✔</span>}
                </div>
                <span style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>{t.lastTime}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                <span style={{fontSize:12,color:t.unread>0?"var(--sub)":"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:t.unread>0?600:400}}>{t.lastMsg}</span>
                {t.unread>0&&<div style={{width:20,height:20,borderRadius:"50%",background:"#1A4FD6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{t.unread}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav onNav={onNav} active="chat" user={user} onPost={onPost}/>
    </div>
  );
}

// ─── Chat Thread ──────────────────────────────────────────────────────────────
function ChatThread({thread,user,onBack}) {
  const [msgs,setMsgs]=useState(thread.msgs);
  const [input,setInput]=useState("");
  const endRef=useRef(null);
  const str=STREAM[STUDENTS.find(s=>s.id===thread.studentId)?.stream];

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send=()=>{
    if(!input.trim()) return;
    setMsgs(m=>[...m,{id:Date.now(),from:"me",text:input.trim(),time:"Now"}]);
    setInput("");
  };

  return (
    <div style={{position:"fixed",inset:0,background:"var(--bg)",display:"flex",flexDirection:"column",zIndex:250,animation:"slideInRight .22s ease"}}>
      {/* Header */}
      <div style={{flexShrink:0,padding:"52px 16px 12px",background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.07)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 80% 100% at 50% -20%,${str?.color||"#1A4FD6"}22 0%,transparent 60%)`}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",flexShrink:0,cursor:"pointer"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          {/* Avatar */}
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:44,height:44,borderRadius:"50%",padding:2,background:`conic-gradient(${str?.color||"#1A4FD6"},#7C3AED,${str?.color||"#1A4FD6"})`}}>
              <img src={thread.avatar} width={40} height={40} style={{borderRadius:"50%",display:"block",border:"2px solid #0D0F1A",objectFit:"cover"}}/>
            </div>
            {thread.online&&<div style={{position:"absolute",bottom:1,right:1,width:11,height:11,borderRadius:"50%",background:"#0A9B6A",border:"2px solid #0D0F1A"}} className="pulse-dot"/>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontWeight:800,fontSize:16,color:"var(--text)",letterSpacing:"-.01em"}}>{thread.name}</span>
              {thread.verified&&<span style={{fontSize:11,color:"#34D399"}}>✔</span>}
            </div>
            <div style={{fontSize:11,color:thread.online?"#34D399":"rgba(255,255,255,.35)",fontWeight:600}}>{thread.online?"● Active now":"Last seen recently"}</div>
          </div>
          {/* Action buttons */}
          <div style={{display:"flex",gap:8}}>
            {[
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.61 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.1 4.18 2 2 0 0 1 5.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.91 9a16 16 0 0 0 6 6l.41-.41a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            ].map((ic,i)=>(
              <button key={i} style={{width:38,height:38,borderRadius:"50%",background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{ic}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:6,background:"var(--bg)"}}>
        {msgs.map((m,i)=>{
          const isMe=m.from==="me";
          const showAvatar=!isMe&&(i===0||msgs[i-1]?.from==="me");
          return (
            <div key={m.id} style={{display:"flex",alignItems:"flex-end",gap:8,justifyContent:isMe?"flex-end":"flex-start",marginBottom:showAvatar?4:1}}>
              {!isMe&&(
                showAvatar
                  ?<img src={thread.avatar} width={28} height={28} style={{borderRadius:"50%",flexShrink:0,border:"1.5px solid rgba(255,255,255,.1)",objectFit:"cover"}}/>
                  :<div style={{width:28,flexShrink:0}}/>
              )}
              <div style={{maxWidth:"72%"}}>
                <div style={{
                  padding:"10px 14px",borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
                  background:isMe?`linear-gradient(135deg,#1A4FD6,#7C3AED)`:"#fff",
                  color:isMe?"#fff":"var(--text)",fontSize:13,lineHeight:1.55,
                  border:isMe?"none":"1px solid var(--b1)",
                  boxShadow:isMe?"0 4px 16px rgba(26,79,214,.35)":"none",
                }}>
                  {m.text}
                </div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:3,textAlign:isMe?"right":"left",paddingLeft:isMe?0:4,paddingRight:isMe?4:0}}>{m.time}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>

      {/* Input bar */}
      <div style={{flexShrink:0,padding:"10px 16px 32px",background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",borderTop:"1px solid var(--b1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#F4F7FD",borderRadius:50,padding:"8px 8px 8px 18px",border:"1.5px solid var(--b2)"}}>
          <input
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Your Message..."
            style={{flex:1,background:"none",border:"none",outline:"none",fontSize:13,color:"var(--text)",fontFamily:"inherit"}}
          />
          <button onClick={send} style={{width:38,height:38,borderRadius:"50%",background:input.trim()?"linear-gradient(135deg,#1A4FD6,#7C3AED)":"rgba(255,255,255,.08)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()?"pointer":"default",transition:"all .2s",flexShrink:0,boxShadow:input.trim()?"0 4px 14px rgba(26,79,214,.4)":"none"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────
function NotificationsPage({onNav,user,notifs,notifCount,onMarkAllRead,onPost}) {
  const NOTIF_ICONS={
    "⚡":"linear-gradient(135deg,#F59E0B,#FBBF24)",
    "🏆":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",
    "💬":"linear-gradient(135deg,#1A4FD6,#7C3AED)",
    "🔔":"linear-gradient(135deg,#7C3AED,#A78BFA)",
    "🎯":"linear-gradient(135deg,#EF4444,#F87171)",
    "🔥":"linear-gradient(135deg,#E85D20,#C2185B)",
    "⚠️":"linear-gradient(135deg,#F59E0B,#EF4444)",
    "🔼":"linear-gradient(135deg,#0A9B6A,#34D399)",
    "💼":"linear-gradient(135deg,#0F1C3F,#1A4FD6)",
    "🏅":"linear-gradient(135deg,#F59E0B,#FBBF24)",
    "⬆️":"linear-gradient(135deg,#0A9B6A,#34D399)",
  };
  const groups=[
    {label:"Today",   items:notifs.slice(0,3)},
    {label:"Earlier", items:notifs.slice(3)},
  ].filter(g=>g.items.length>0);
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{flexShrink:0,padding:"52px 18px 16px",position:"relative",overflow:"hidden"}}>

        <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:26,fontWeight:900,color:"var(--text)",letterSpacing:"-.03em"}}>Notifications</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{notifCount>0?`${notifCount} unread`:"All caught up ✓"}</div>
          </div>
          <button onClick={onMarkAllRead} style={{padding:"8px 16px",borderRadius:50,background:"#EEF2FF",border:"1px solid var(--b2)",color:"var(--blue)",fontSize:11,fontWeight:700,cursor:"pointer"}}>
            Mark all read
          </button>
        </div>
      </div>

      {/* Notification threads */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
        {/* NVIDIA Challenge Banner */}
        <div style={{margin:"4px 14px 10px"}}>
          <div style={{borderRadius:16,background:"linear-gradient(135deg,#0F1C3F,#1A4FD6)",padding:"16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-30,top:-30,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
            <div style={{display:"flex",gap:12,alignItems:"center",position:"relative"}}>
              <div style={{width:46,height:46,borderRadius:13,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>⚡</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800,color:"#FFFFFF",marginBottom:3,lineHeight:1.3}}>NVIDIA posted a ₹50,000 challenge — 12 days left</div><div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>Build an AI Study Scheduler. Winner gets internship track.</div></div>
              <button onClick={()=>onNav("challenges")} style={{padding:"9px 14px",borderRadius:10,background:"#FFFFFF",color:"#1A4FD6",border:"none",fontWeight:800,fontSize:12,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>Enter →</button>
            </div>
          </div>
        </div>
        {/* Streak Card */}
        <div style={{margin:"0 14px 10px"}}>
          <div className="card" style={{padding:"13px 15px",display:"flex",gap:12,alignItems:"center",border:"1.5px solid rgba(224,87,32,.18)"}}>
            <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#E85D20,#C2185B)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 3px 10px rgba(232,93,32,.3)"}}>🔥</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:800,color:"var(--text)"}}>{user.streak}-Day Streak · Don't break it!</div>
              <div style={{height:5,borderRadius:3,background:"rgba(232,93,32,.12)",overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${Math.min(100,(user.streak/100)*100)}%`,background:"linear-gradient(90deg,#E85D20,#1A4FD6)",borderRadius:3}}/></div>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:800,color:"#E85D20"}}>{user.streak}</div>
          </div>
        </div>
        {groups.map(g=>(
          <div key={g.label}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",padding:"14px 18px 8px"}}>{g.label}</div>
            {g.items.map(n=>{
              const grad=NOTIF_ICONS[n.icon]||"linear-gradient(135deg,#1A4FD6,#7C3AED)";
              return (
                <div key={n.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:"1px solid var(--b1)",background:n.read?"transparent":"#F5F0FF",transition:"background .15s",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(124,58,237,.05)"}
                >
                  {/* Icon avatar */}
                  <div style={{width:50,height:50,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:`0 4px 14px rgba(0,0,0,.3)`}}>
                    {n.icon}
                  </div>
                  {/* Content */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:n.read?"var(--muted)":"var(--text)",lineHeight:1.5,fontWeight:n.read?400:600,marginBottom:3}}>{n.text}</div>
                    <div style={{fontSize:11,color:"var(--muted)",fontWeight:500}}>{n.time}</div>
                  </div>
                  {/* Unread dot */}
                  {!n.read&&<div style={{width:10,height:10,borderRadius:"50%",background:"#7C3AED",flexShrink:0,boxShadow:"0 0 6px rgba(124,58,237,.4)"}}/>}
                </div>
              );
            })}
          </div>
        ))}
        {notifs.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px",color:"var(--muted)"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔔</div>
            <div style={{fontSize:14,fontWeight:600}}>No notifications yet</div>
          </div>
        )}
      </div>
      <BottomNav onNav={onNav} active="notifications" user={user} onPost={onPost}/>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
// ─── CreatePost ───────────────────────────────────────────────────────────────
function CreatePost({user,onClose,onSubmit}) {
  const [step,setStep]=useState("type"); // type → compose → done
  const [postType,setPostType]=useState(null);
  const [text,setText]=useState("");
  const [hashtags,setHashtags]=useState("");
  const [taggedUsers,setTaggedUsers]=useState([]);
  const [collab,setCollab]=useState(false);
  const [imagePreview,setImagePreview]=useState(null);
  const [posting,setPosting]=useState(false);

  const POST_TYPES=[
    {id:"content",    emoji:"📝", label:"Share Knowledge",   desc:"Notes, concepts, tips"},
    {id:"image",      emoji:"🖼️", label:"Post Image",        desc:"Study photo, diagram, meme"},
    {id:"hashtag",    emoji:"#",  label:"Trending Topic",    desc:"Join a study thread"},
    {id:"collab",     emoji:"🤝", label:"Find Collaborator", desc:"Team up for challenges"},
    {id:"opportunity",emoji:"💼", label:"Opportunity",       desc:"Share a job / internship"},
    {id:"asking",     emoji:"❓", label:"Ask the Community", desc:"Get answers fast"},
  ];

  const SUGGEST_TAGS=["#NEET2026","#JEE2026","#Physics","#Chemistry","#Biology","#Maths","#AIIMS","#IIT","#StudyTips","#MockTest","#Motivation","#DailyStreak"];

  const handlePost=()=>{
    if(!text.trim()) return;
    setPosting(true);
    setTimeout(()=>{
      onSubmit&&onSubmit({type:postType,text,hashtags,taggedUsers,collab});
      setPosting(false);
      onClose();
    },800);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      {/* backdrop */}
      <div style={{position:"absolute",inset:0,background:"rgba(15,28,63,.45)",backdropFilter:"blur(4px)"}} onClick={onClose}/>

      <div style={{position:"relative",background:"#fff",borderRadius:"22px 22px 0 0",maxHeight:"92vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 -8px 40px rgba(15,28,63,.18)"}}>
        {/* Handle bar */}
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"#E0E6F0"}}/>
        </div>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px 12px",borderBottom:"1px solid #F0F4FA"}}>
          {step==="compose"
            ?<button onClick={()=>setStep("type")} style={{background:"none",border:"none",color:"var(--blue)",fontWeight:700,fontSize:14,cursor:"pointer"}}>← Back</button>
            :<div style={{width:40}}/>}
          <div style={{fontWeight:800,fontSize:15,color:"var(--text)"}}>
            {step==="type"?"Create Post":"Compose"}
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",background:"#F0F4FA",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:"#666"}}>✕</button>
        </div>

        {/* Step 1: Pick type */}
        {step==="type"&&(
          <div style={{overflowY:"auto",padding:"14px 16px 30px"}}>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:12,fontWeight:600}}>What do you want to share?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {POST_TYPES.map(t=>(
                <button key={t.id} onClick={()=>{setPostType(t.id);setStep("compose");}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 12px",borderRadius:14,border:"1.5px solid #E8ECF2",background:"#FAFBFD",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
                  <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#EBF0FF,#F0F4FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{t.emoji}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{t.label}</div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Compose */}
        {step==="compose"&&(
          <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{overflowY:"auto",flex:1,padding:"14px 16px"}}>
              {/* User row */}
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
                <img src={user.avatar} width={40} height={40} style={{borderRadius:"50%",border:"2px solid #E8ECF2"}}/>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>{user.name}</div>
                  <div style={{display:"flex",gap:5,marginTop:3}}>
                    <span style={{fontSize:10,background:"#EBF0FF",color:"var(--blue)",borderRadius:50,padding:"2px 8px",fontWeight:600}}>🌐 Anyone</span>
                    {collab&&<span style={{fontSize:10,background:"#E6FAF2",color:"#0A9B6A",borderRadius:50,padding:"2px 8px",fontWeight:600}}>🤝 Collab</span>}
                  </div>
                </div>
              </div>

              {/* Text area */}
              <textarea
                placeholder={
                  postType==="asking"?"Ask your question... (be specific for faster answers)":
                  postType==="collab"?"Describe what you're working on and what help you need...":
                  postType==="opportunity"?"Share the opportunity details — role, company, stipend, deadline...":
                  postType==="hashtag"?"What's trending in your study community?":
                  "Share your knowledge, notes, or thoughts..."
                }
                value={text}
                onChange={e=>setText(e.target.value)}
                style={{width:"100%",minHeight:120,border:"none",outline:"none",fontSize:14,lineHeight:1.7,color:"#1A1A2E",resize:"none",fontFamily:"inherit",background:"transparent",boxSizing:"border-box"}}
              />

              {/* Image preview */}
              {imagePreview&&(
                <div style={{position:"relative",marginTop:10}}>
                  <img src={imagePreview} style={{width:"100%",borderRadius:12,maxHeight:200,objectFit:"cover"}}/>
                  <button onClick={()=>setImagePreview(null)} style={{position:"absolute",top:8,right:8,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,.5)",border:"none",color:"#fff",cursor:"pointer",fontSize:14}}>✕</button>
                </div>
              )}

              {/* Hashtag suggestions */}
              <div style={{marginTop:12}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",marginBottom:6}}>Suggested hashtags</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {SUGGEST_TAGS.map(t=>(
                    <button key={t} onClick={()=>setHashtags(h=>h.includes(t)?h:h+" "+t)} style={{fontSize:10,fontWeight:600,color:hashtags.includes(t)?"var(--blue)":"var(--muted)",background:hashtags.includes(t)?"#EBF0FF":"#F4F7FD",border:`1px solid ${hashtags.includes(t)?"rgba(26,79,214,.2)":"transparent"}`,borderRadius:50,padding:"4px 10px",cursor:"pointer"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag users */}
              <div style={{marginTop:14,borderTop:"1px solid #F0F4FA",paddingTop:12}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",marginBottom:8}}>Tag students</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {STUDENTS.filter(s=>s.id!==user.id).slice(0,8).map(s=>(
                    <button key={s.id} onClick={()=>setTaggedUsers(u=>u.includes(s.id)?u.filter(x=>x!==s.id):[...u,s.id])} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:50,border:`1.5px solid ${taggedUsers.includes(s.id)?"var(--blue)":"#E8ECF2"}`,background:taggedUsers.includes(s.id)?"#EBF0FF":"#FAFBFD",cursor:"pointer"}}>
                      <img src={s.avatar} width={16} height={16} style={{borderRadius:"50%"}}/>
                      <span style={{fontSize:11,fontWeight:600,color:taggedUsers.includes(s.id)?"var(--blue)":"var(--sub)"}}>{s.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom toolbar */}
            <div style={{borderTop:"1px solid #F0F4FA",padding:"10px 16px",background:"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <button style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:5,color:"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",padding:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                  Photo
                </button>
                <button onClick={()=>setCollab(c=>!c)} style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:5,color:collab?"var(--blue)":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",padding:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Collab
                </button>
                <button style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:5,color:"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",padding:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Invite
                </button>
              </div>
              <button onClick={handlePost} disabled={!text.trim()||posting} style={{width:"100%",padding:"13px",borderRadius:14,background:text.trim()?"linear-gradient(135deg,#1A4FD6,#3B5CE8)":"#E8ECF2",border:"none",color:text.trim()?"#fff":"#aaa",fontWeight:800,fontSize:14,cursor:text.trim()?"pointer":"default",transition:"all .2s"}}>
                {posting?"Posting...":"Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Toast Notifications ──────────────────────────────────────────────────────
// Global toast bus — fires events without touching App state
const toastBus={_cbs:[],emit(t){this._cbs.forEach(cb=>cb(t));},on(cb){this._cbs.push(cb);return()=>{this._cbs=this._cbs.filter(x=>x!==cb);};} };

function ToastStack() {
  const [toasts,setToasts]=useState([]);
  useEffect(()=>toastBus.on(toast=>{
    const id=Date.now()+Math.random();
    setToasts(prev=>[...prev,{...toast,id}]);
    setTimeout(()=>setToasts(prev=>prev.filter(x=>x.id!==id)),5000);
  }),[]);
  const ICONS={
    "🔥":"linear-gradient(135deg,#E85D20,#C2185B)",
    "⚠️":"linear-gradient(135deg,#F59E0B,#EF4444)",
    "💬":"linear-gradient(135deg,#1A4FD6,#7C3AED)",
    "⚡":"linear-gradient(135deg,#F59E0B,#FBBF24)",
    "🏆":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",
  };
  if(!toasts.length) return null;
  return (
    <div style={{position:"fixed",top:56,left:0,right:0,zIndex:99999,display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"0 12px",pointerEvents:"none"}}>
      {toasts.map(toast=>(
        <div key={toast.id} style={{width:"100%",maxWidth:400,background:"#1A1A2E",borderRadius:16,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 8px 32px rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.1)",pointerEvents:"auto",animation:"slideDown .3s ease"}}>
          <div style={{width:38,height:38,borderRadius:12,background:ICONS[toast.icon]||"linear-gradient(135deg,#1A4FD6,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
            {toast.icon}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,color:"#fff",lineHeight:1.45,fontWeight:500}}>{toast.text}</div>
          </div>
          <button onClick={()=>setToasts(prev=>prev.filter(x=>x.id!==toast.id))} style={{background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:16,cursor:"pointer",flexShrink:0,padding:"0 4px",lineHeight:1}}>✕</button>
        </div>
      ))}
    </div>
  );
}

function BottomNav({onNav,active,notifCount=0,user,onPost}) {
  const left=[
    {key:"feed",    label:"Home",   icon:on=><svg width="22" height="22" viewBox="0 0 24 24" fill={on?"#1A4FD6":"none"} stroke={on?"#1A4FD6":"#9AA8C5"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>},
    {key:"battle",  label:"Battle", icon:on=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?"#7C3AED":"#9AA8C5"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>},
  ];
  const right=[
    {key:"discover",      label:"Discover", icon:on=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?"#1A4FD6":"#9AA8C5"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/></svg>},
    {key:"profile",       label:"Me",       icon:null},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(0,0,0,.07)",display:"flex",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom,8px)"}}>
      {left.map(t=>{
        const on=active===t.key;
        return (
          <button key={t.key} onClick={()=>onNav(t.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"10px 0 12px",background:"none",border:"none",cursor:"pointer"}}>
            {t.icon(on)}
            <span style={{fontSize:10,fontWeight:on?700:500,color:on?"#1A4FD6":"#9AA8C5"}}>{t.label}</span>
          </button>
        );
      })}
      <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center",paddingBottom:6}}>
        <button onClick={onPost} style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#1A4FD6,#3B5CE8)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 24px rgba(26,79,214,.5)",cursor:"pointer",transform:"translateY(-12px)"}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        </button>
      </div>
      {right.map(t=>{
        const on=active===t.key;
        return (
          <button key={t.key} onClick={()=>onNav(t.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"10px 0 12px",background:"none",border:"none",cursor:"pointer"}}>
            {t.key==="profile"&&user?.avatar
              ?<img src={user.avatar} width={26} height={26} style={{borderRadius:"50%",border:on?"2.5px solid #1A4FD6":"2px solid #E0E6F0",display:"block"}}/>
              :t.icon(on)
            }
            <span style={{fontSize:10,fontWeight:on?700:500,color:on?"#1A4FD6":"#9AA8C5"}}>{t.label}</span>
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
// ─── Daily Battle ─────────────────────────────────────────────────────────────
function DailyBattle({onNav,user,onPost}) {
  const [answered,setAnswered]=useState(null);
  const [showInsight,setShowInsight]=useState(false);
  const [tab,setTab]=useState("question");
  const [timeLeft,setTimeLeft]=useState("");
  const [qIndex,setQIndex]=useState(0);
  const [allAnswers,setAllAnswers]=useState({}); // {qIndex: answerIndex}
  const q=DAILY_QUESTIONS[qIndex]||DAILY_QUESTIONS[0];

  const goNext=()=>{
    const next=qIndex+1;
    if(next<DAILY_QUESTIONS.length){
      setQIndex(next);
      setAnswered(allAnswers[next]??null);
      setShowInsight(allAnswers[next]!=null);
    }
  };
  const goPrev=()=>{
    const prev=qIndex-1;
    if(prev>=0){
      setQIndex(prev);
      setAnswered(allAnswers[prev]??null);
      setShowInsight(allAnswers[prev]!=null);
    }
  };

  // Countdown to next 30-min mark
  useEffect(()=>{
    const tick=()=>{
      const now=new Date();
      const next=new Date(now);
      next.setMinutes(now.getMinutes()<30?30:60,0,0);
      const diff=next-now;
      const m=Math.floor(diff/60000);
      const s=Math.floor((diff%60000)/1000);
      setTimeLeft(`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    tick();
    const iv=setInterval(tick,1000);
    return()=>clearInterval(iv);
  },[]);

  const insight=answered!==null?q.insights[answered]:null;
  const totalAnswered=q.participants+(answered!==null?1:0);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{background:"rgba(255,255,255,.97)",padding:"52px 16px 0",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:"var(--text)",letterSpacing:"-.03em"}}>⚔️ Daily Battle</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>One question. Everyone answers. Know your brain.</div>
            </div>
            <div style={{background:"#0A0A0F",borderRadius:10,padding:"6px 12px",textAlign:"center"}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:700,letterSpacing:".06em"}}>RESETS IN</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:800,color:"#FFD580"}}>{timeLeft}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:0,borderBottom:"2px solid var(--b1)"}}>
            {[["question","🧠 Today"],["leaderboard","🏆 Leaderboard"],["history","📅 History"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",background:"none",border:"none",borderBottom:tab===k?"2px solid #7C3AED":"2px solid transparent",marginBottom:-2,color:tab===k?"#7C3AED":"var(--muted)",fontWeight:tab===k?700:500,fontSize:11,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"16px 14px"}}>

          {/* ── QUESTION TAB ── */}
          {tab==="question"&&(
            <div>
              {/* Participants pill */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{display:"flex"}}>{BATTLE_LEADERBOARD.slice(0,4).map((p,i)=><img key={i} src={p.avatar} width={22} height={22} style={{borderRadius:"50%",border:"2px solid var(--bg)",marginLeft:i?-8:0,display:"block"}}/>)}</div>
                <span style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>{totalAnswered.toLocaleString()} answered</span>
                <span style={{marginLeft:"auto",fontSize:11,fontWeight:800,color:"#7C3AED",background:"rgba(124,58,237,.1)",padding:"3px 10px",borderRadius:50,border:"1px solid rgba(124,58,237,.2)"}}>{qIndex+1} / {DAILY_QUESTIONS.length}</span>
              </div>
              {/* Progress bar */}
              <div style={{height:4,borderRadius:2,background:"var(--b1)",marginBottom:14,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${((Object.keys(allAnswers).length)/DAILY_QUESTIONS.length)*100}%`,background:"linear-gradient(90deg,#7C3AED,#1A4FD6)",borderRadius:2,transition:"width .4s ease"}}/>
              </div>

              {/* Question card */}
              <div style={{borderRadius:20,background:"linear-gradient(135deg,#0A0A0F,#1A0A2E)",padding:"24px 20px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(124,58,237,.15)",filter:"blur(30px)"}}/>
                <div style={{position:"absolute",bottom:-30,left:-20,width:100,height:100,borderRadius:"50%",background:"rgba(26,79,214,.1)",filter:"blur(20px)"}}/>
                <div style={{position:"relative"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".08em"}}>TODAY'S QUESTION</div>
                    <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.5)",background:"rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:50}}>{q.category}</span>
                  </div>
                  <div style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.45,letterSpacing:"-.01em"}}>{q.question}</div>
                </div>
              </div>

              {/* Options */}
              {!showInsight&&(
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {q.options.map((opt,i)=>{
                    const isChosen=answered===i;
                    return (
                      <button key={i} onClick={()=>{if(answered===null){setAnswered(i);setAllAnswers(a=>({...a,[qIndex]:i}));setTimeout(()=>setShowInsight(true),600);}}}
                        style={{padding:"14px 16px",borderRadius:14,background:isChosen?"linear-gradient(135deg,#7C3AED,#1A4FD6)":answered!==null?"rgba(15,28,63,.04)":"#fff",border:isChosen?"none":(answered!==null?"1.5px solid var(--b1)":"1.5px solid var(--b2)"),textAlign:"left",fontSize:13,fontWeight:isChosen?700:500,color:isChosen?"#fff":answered!==null?"var(--muted)":"var(--text)",cursor:answered===null?"pointer":"default",transition:"all .2s",boxShadow:isChosen?"0 4px 20px rgba(124,58,237,.4)":"0 1px 4px rgba(15,28,63,.06)",display:"flex",alignItems:"center",gap:10}}>
                        <span style={{width:24,height:24,borderRadius:"50%",background:isChosen?"rgba(255,255,255,.2)":answered!==null?"rgba(15,28,63,.06)":"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:isChosen?"#fff":"var(--blue)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Insight reveal */}
              {showInsight&&insight&&(
                <div style={{animation:"slideDown .4s ease"}}>
                  {/* Chosen answer */}
                  <div style={{padding:"12px 16px",borderRadius:14,background:"linear-gradient(135deg,#7C3AED,#1A4FD6)",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>{insight.emoji}</span>
                    <div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:600}}>You answered</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{q.options[answered]}</div>
                    </div>
                  </div>

                  {/* Brain insight card */}
                  <div style={{borderRadius:20,background:"#fff",border:"1px solid var(--b1)",overflow:"hidden",marginBottom:14,boxShadow:"0 2px 12px rgba(15,28,63,.08)"}}>
                    <div style={{background:`linear-gradient(135deg,${insight.color}22,${insight.color}11)`,padding:"16px 18px",borderBottom:"1px solid var(--b1)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        <div style={{width:38,height:38,borderRadius:12,background:insight.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{insight.emoji}</div>
                        <div>
                          <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:".06em"}}>YOUR BRAIN TYPE</div>
                          <div style={{fontSize:16,fontWeight:900,color:"var(--text)"}}>{insight.title}</div>
                        </div>
                        <div style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"var(--blue)",background:"#EEF2FF",padding:"4px 10px",borderRadius:50}}>+{q.xp} XP</div>
                      </div>
                    </div>
                    <div style={{padding:"16px 18px"}}>
                      <div style={{fontSize:13,color:"var(--text)",lineHeight:1.65,marginBottom:14}}>{insight.insight}</div>
                      <div style={{background:"#F5F3FF",borderRadius:12,padding:"12px 14px",borderLeft:`3px solid ${insight.color}`}}>
                        <div style={{fontSize:10,fontWeight:800,color:"#7C3AED",letterSpacing:".06em",marginBottom:4}}>💡 IMPROVEMENT TIP</div>
                        <div style={{fontSize:12,color:"var(--text)",lineHeight:1.6}}>{insight.tip}</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress + Navigation */}
                  <div style={{marginTop:4}}>
                    {/* Progress dots */}
                    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
                      {DAILY_QUESTIONS.map((_,i)=>(
                        <div key={i} onClick={()=>{setQIndex(i);setAnswered(allAnswers[i]??null);setShowInsight(allAnswers[i]!=null);}}
                          style={{width:i===qIndex?22:8,height:8,borderRadius:4,background:allAnswers[i]!=null?"#7C3AED":i===qIndex?"#1A4FD6":"var(--b2)",transition:"all .3s",cursor:"pointer"}}/>
                      ))}
                    </div>
                    {/* Nav buttons */}
                    <div style={{display:"flex",gap:8}}>
                      {qIndex>0&&(
                        <button onClick={goPrev} style={{flex:1,padding:"12px",borderRadius:12,background:"#fff",border:"1.5px solid var(--b2)",color:"var(--sub)",fontWeight:700,fontSize:13,cursor:"pointer"}}>← Previous</button>
                      )}
                      {qIndex<DAILY_QUESTIONS.length-1?(
                        <button onClick={goNext} style={{flex:2,padding:"12px",borderRadius:12,background:"linear-gradient(135deg,#7C3AED,#1A4FD6)",border:"none",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 16px rgba(124,58,237,.35)"}}>
                          Next Question ⚔️
                        </button>
                      ):(
                        <button onClick={()=>setTab("leaderboard")} style={{flex:2,padding:"12px",borderRadius:12,background:"linear-gradient(135deg,#F59E0B,#E85D20)",border:"none",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 16px rgba(245,158,11,.35)"}}>
                          See Leaderboard 🏆
                        </button>
                      )}
                    </div>
                    <div style={{textAlign:"center",marginTop:10,fontSize:11,color:"var(--muted)"}}>
                      {Object.keys(allAnswers).length} of {DAILY_QUESTIONS.length} completed · +{Object.keys(allAnswers).length*50} XP earned
                    </div>
                  </div>
                </div>
              )}

              {answered===null&&(
                <div style={{textAlign:"center",padding:"8px 0 4px"}}>
                  <div style={{fontSize:11,color:"var(--muted)"}}>✨ Answer to reveal your brain insight + earn {q.xp} XP</div>
                </div>
              )}
            </div>
          )}

          {/* ── LEADERBOARD TAB ── */}
          {tab==="leaderboard"&&(
            <div>
              <div style={{borderRadius:18,background:"linear-gradient(135deg,#0A0A0F,#1A0A2E)",padding:"16px",marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700,letterSpacing:".08em",marginBottom:6}}>BATTLE STREAK LEADERS</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>Most consecutive days answered</div>
              </div>
              {BATTLE_LEADERBOARD.map((p,i)=>{
                const isMe=p.name===user.name;
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,background:isMe?"linear-gradient(135deg,rgba(124,58,237,.08),rgba(26,79,214,.08))":"#fff",border:isMe?"1.5px solid rgba(124,58,237,.25)":"1px solid var(--b1)",marginBottom:8,boxShadow:"0 1px 6px rgba(15,28,63,.05)"}}>
                    <div style={{width:28,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:15,color:i<3?"#F59E0B":"var(--muted)"}}>{p.badge||`#${p.rank}`}</div>
                    <img src={p.avatar} width={38} height={38} style={{borderRadius:"50%",border:`2px solid ${isMe?"#7C3AED":"var(--b1)"}`}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>{p.name}{isMe&&<span style={{fontSize:10,color:"#7C3AED",fontWeight:800,marginLeft:6}}>YOU</span>}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>🔥 {p.streak}-day streak</div>
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:14,color:"#7C3AED"}}>+{p.xp}</div>
                  </div>
                );
              })}
              {answered===null&&(
                <div style={{textAlign:"center",padding:"16px",borderRadius:14,background:"#F5F3FF",border:"1.5px dashed rgba(124,58,237,.3)",marginTop:8}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#7C3AED",marginBottom:4}}>Answer today's question to join the leaderboard!</div>
                  <button onClick={()=>setTab("question")} style={{background:"linear-gradient(135deg,#7C3AED,#1A4FD6)",border:"none",borderRadius:50,padding:"8px 20px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Answer Now →</button>
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab==="history"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"12px 14px",borderRadius:14,background:"linear-gradient(135deg,rgba(124,58,237,.08),rgba(26,79,214,.08))",border:"1px solid rgba(124,58,237,.15)"}}>
                <span style={{fontSize:22}}>🔥</span>
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>Your Battle Streak: {answered!==null?1:0} day{answered!==null?"":"s"}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>Answer every day to build your streak</div>
                </div>
              </div>
              {DAILY_QUESTIONS.map((q,i)=>(
                <div key={q.id} style={{borderRadius:16,background:"#fff",border:"1px solid var(--b1)",padding:"14px 16px",marginBottom:10,boxShadow:"0 1px 6px rgba(15,28,63,.05)"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".04em"}}>{q.date}</span>
                    <span style={{fontSize:10,fontWeight:700,color:"#7C3AED",background:"rgba(124,58,237,.1)",padding:"2px 8px",borderRadius:50}}>{q.category}</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)",lineHeight:1.45,marginBottom:8}}>{q.question}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:11,color:"var(--muted)"}}>{q.participants.toLocaleString()} answers</span>
                    {i===0?
                      <span style={{fontSize:11,fontWeight:700,color:answered!==null?"#0A9B6A":"#F59E0B"}}>{answered!==null?"✓ Answered":"Pending"}</span>
                      :<span style={{fontSize:11,fontWeight:700,color:"#0A9B6A"}}>✓ Answered</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav onNav={onNav} active="battle" user={user} onPost={onPost}/>
    </div>
  );
}

function Challenges({onNav,onOpenChallenge,user,notifs,onMarkAllRead,onPost}) {
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
      <BottomNav onNav={onNav} active="challenges" notifCount={unread} user={user} onPost={onPost} />
    </div>
  );
}

// ─── Showcase ─────────────────────────────────────────────────────────────────
function Showcase({onNav,submissions,user,onVoteSubmission,onCommentSubmission,onPost}) {
  const [cf,setCf]=useState("all");
  const filtered=cf==="all"?submissions:submissions.filter(s=>s.challengeId===parseInt(cf));
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
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
      <BottomNav onNav={onNav} active="discover" user={user} onPost={onPost} />
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
function Opportunities({onNav,user,onPost}) {
  const [applied,setApplied]=useState([]);
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
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
                {isApplied?"✔ Applied · Profile Sent":"Apply with Infinity Profile →"}
              </button>
            </div>
          );
        })}
      </div>
      <BottomNav onNav={onNav} active="discover" user={user} onPost={onPost} />
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
// ─── Discover (Opportunities + Showcase merged) ───────────────────────────────
function Discover({onNav,user,submissions,onVoteSubmission,onCommentSubmission,onViewProfile,followed,onFollow,onPost}) {
  const [tab,setTab]=useState("showcase");
  const [applied,setApplied]=useState([]);
  const [cf,setCf]=useState("all");
  const filtered=cf==="all"?submissions:submissions.filter(s=>s.challengeId===parseInt(cf));
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      {/* Header */}
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px 0",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:16,color:"var(--text)",marginBottom:10}}>Discover 🌐</div>
          <div style={{display:"flex",gap:0,borderBottom:"2px solid var(--b1)"}}>
            {[["showcase","🎨 Showcase"],["opportunities","💼 Opportunities"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",background:"none",border:"none",borderBottom:tab===k?"2px solid var(--blue)":"2px solid transparent",marginBottom:-2,color:tab===k?"var(--blue)":"var(--muted)",fontWeight:tab===k?700:500,fontSize:12,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {tab==="opportunities"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:"12px 14px 90px"}}>
          <div className="card" style={{padding:"12px 14px",marginBottom:12,background:"linear-gradient(135deg,#0F1C3F,#1A3A8A)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:24}}>🏆</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:800,color:"#FFFFFF"}}>Win a challenge → get fast-tracked for interviews</div><div style={{fontSize:10,color:"rgba(255,255,255,.65)",marginTop:1}}>{user.challengesWon===0?"You haven't won a challenge yet.":`You've won ${user.challengesWon} challenge${user.challengesWon>1?"s":""}!`}</div></div>
            </div>
          </div>
          {OPPORTUNITIES.map(o=>(
            <div key={o.id} className="card" style={{padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:46,height:46,borderRadius:12,background:o.color||"#EBF0FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{o.logo}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:14,color:"var(--text)"}}>{o.company}</div>
                  <div style={{fontSize:12,color:"var(--blue)",fontWeight:600,marginTop:1}}>{o.role}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{o.location} · {o.type}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:7}}>
                    {o.skills.map(sk=><span key={sk} style={{fontSize:10,fontWeight:600,color:"var(--blue)",background:"#EBF0FF",padding:"2px 8px",borderRadius:50,border:"1px solid rgba(26,79,214,.15)"}}>{sk}</span>)}
                  </div>
                </div>
                <button onClick={()=>setApplied(a=>a.includes(o.id)?a:([...a,o.id]))} style={{padding:"7px 14px",borderRadius:50,background:applied.includes(o.id)?"#E6FAF2":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",border:"none",color:applied.includes(o.id)?"#0A9B6A":"#fff",fontSize:11,fontWeight:700,flexShrink:0,cursor:"pointer"}}>
                  {applied.includes(o.id)?"✓ Applied":"Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="showcase"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:"12px 14px 90px"}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:8,marginBottom:4}}>
            <button className={`chip${cf==="all"?" on":""}`} onClick={()=>setCf("all")}>All</button>
            {CHALLENGES.filter(c=>submissions.some(s=>s.challengeId===c.id)).map(c=>(
              <button key={c.id} onClick={()=>setCf(String(c.id))} style={{padding:"5px 12px",borderRadius:50,border:`1.5px solid ${cf===String(c.id)?"rgba(26,79,214,.4)":"rgba(15,28,63,.1)"}`,background:cf===String(c.id)?"#EBF0FF":"rgba(15,28,63,.04)",color:cf===String(c.id)?"var(--blue)":"var(--muted)",fontSize:11,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0}}>{c.sponsorLogo} {c.title.split(" ").slice(0,2).join(" ")}…</button>
            ))}
          </div>
          {filtered.map(s=>{
            const st=STUDENTS.find(x=>x.id===s.studentId)||{};
            return (
              <div key={s.id} className="card" style={{marginBottom:10,overflow:"hidden"}}>
                <div style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:8}}>
                    <div style={{cursor:"pointer"}} onClick={()=>onViewProfile&&onViewProfile(s.studentId)}><Av src={st.avatar||ALL_AVATARS[0]} size={34}/></div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{st.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{s.timeAgo}</div></div>
                    <button onClick={()=>onVoteSubmission(s.id)} style={{padding:"5px 12px",borderRadius:50,background:"#EBF0FF",border:"1px solid rgba(26,79,214,.2)",color:"var(--blue)",fontSize:11,fontWeight:700}}>▲ {s.votes}</button>
                  </div>
                  <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:4}}>{s.title}</div>
                  <p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,marginBottom:7}}>{s.desc}</p>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(s.tags||[]).map(t=><span key={t} className="tag">{t}</span>)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BottomNav onNav={onNav} active="discover" user={user} onPost={onPost} />
    </div>
  );
}


function Profile({onNav,user,history,onPost}) {
  const [tab,setTab]=useState("overview");
  const [activeStatModal,setActiveStatModal]=useState(null); // "streak"|"xp"|"won"|"dls"
  const str=STREAM[user.stream];
  const fmtXP=n=>n>=1000?(n/1000).toFixed(1)+"K":n;
  const streakToRecord=Math.max(0,user.streakGoals.filter(g=>g.done).length>0?
    user.streakGoals.find(g=>!g.done)?.day-user.streak:3);
  const weeklyRankChange=+12;
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",overflowX:"hidden"}}>
      {/* Hero header */}
      <div style={{position:"relative"}}>
        {/* Dark hero bg */}
        <div style={{height:120,overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 120% 100% at 60% 0%,${str?.color||"#1A4FD6"}55 0%,transparent 60%),radial-gradient(ellipse 80% 60% at 0% 100%,#7C3AED33 0%,transparent 55%),linear-gradient(180deg,#0D0F1A 0%,#131629 100%)`}}/>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
          <div style={{position:"absolute",top:-60,right:-40,width:220,height:220,borderRadius:"50%",background:`${str?.color||"#1A4FD6"}22`,filter:"blur(40px)"}}/>
          {/* Back */}
          <button onClick={()=>onNav("feed")} style={{position:"absolute",top:14,left:14,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.08)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",zIndex:3}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          {/* Top-right: stream badge */}
          <div style={{position:"absolute",top:14,right:14,zIndex:3}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:50,background:"rgba(255,255,255,.1)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.18)",fontSize:11,fontWeight:700,color:"#fff"}}>
              {str?.emoji} {str?.label}
            </div>
          </div>




        </div>
        {/* Avatar */}
        <div style={{position:"absolute",bottom:-46,left:20,zIndex:10}}>
          <div style={{position:"relative",display:"inline-block"}}>
            <div style={{width:92,height:92,borderRadius:"50%",padding:3,background:`conic-gradient(${str?.color||"#1A4FD6"},#7C3AED,${str?.color||"#1A4FD6"})`}}>
              <img src={user.avatar} width={86} height={86} style={{borderRadius:"50%",display:"block",border:"3px solid var(--bg)",objectFit:"cover"}}/>
            </div>
            <div style={{position:"absolute",bottom:4,right:2,width:18,height:18,borderRadius:"50%",background:"#0A9B6A",border:"2.5px solid var(--bg)"}} className="pulse-dot"/>
          </div>
        </div>
      </div>

      {/* Identity row */}
      <div style={{padding:"54px 18px 0",maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <span style={{fontWeight:900,fontSize:22,color:"var(--text)",letterSpacing:"-.03em"}}>{user.name}</span>
              {user.verified&&<span style={{fontSize:10,fontWeight:800,color:"#34D399",background:"rgba(52,211,153,.15)",padding:"2px 8px",borderRadius:50,border:"1px solid rgba(52,211,153,.3)"}}>✔ VERIFIED</span>}
            </div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>📍 {user.city} · 🎯 {user.exam}</div>
            {/* Urgency pills row */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:10,fontWeight:800,color:"#FFD580",background:"rgba(255,213,128,.12)",padding:"3px 9px",borderRadius:50,border:"1px solid rgba(255,213,128,.25)"}}>{user.rankLabel}</span>
              <span style={{fontSize:10,fontWeight:800,color:"#4ADE80",background:"rgba(74,222,128,.1)",padding:"3px 9px",borderRadius:50,border:"1px solid rgba(74,222,128,.2)"}}>Top {user.percentile}th percentile</span>
              <span style={{fontSize:10,fontWeight:800,color:"#F87171",background:"rgba(248,113,113,.1)",padding:"3px 9px",borderRadius:50,border:"1px solid rgba(248,113,113,.2)"}}>🔴 LIVE</span>
            </div>
          </div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:900,color:"var(--text)"}}>2.4K</div>
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:600,marginTop:1}}>FOLLOWERS</div>
          </div>
        </div>

        {/* Competitive pressure bar */}
        {(()=>{
          const nextMilestone=Math.ceil(user.syllabusPct/10)*10;
          const chaptersLeft=Math.round((nextMilestone-user.syllabusPct)/10*4);
          const aheadOf=Math.min(97,100-user.percentile+Math.floor(user.syllabusPct*.7));
          const emoji=user.syllabusPct>=80?"🔥":user.syllabusPct>=60?"⚡":"📈";
          return (
            <div style={{borderRadius:16,background:"linear-gradient(135deg,#0D0F1A,#1A0A2E)",padding:"14px 16px",marginBottom:14,border:"1px solid rgba(255,255,255,.08)"}}>
              {/* Top row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:".05em"}}>SYLLABUS PROGRESS</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:900,color:str?.color||"#1A4FD6"}}>{user.syllabusPct}%</span>
              </div>
              {/* Bar with milestone marker */}
              <div style={{position:"relative",height:10,borderRadius:5,background:"rgba(255,255,255,.08)",overflow:"visible",marginBottom:10}}>
                <div style={{height:"100%",width:`${user.syllabusPct}%`,background:`linear-gradient(90deg,${str?.color||"#1A4FD6"},#7C3AED)`,borderRadius:5,boxShadow:`0 0 12px ${str?.color||"#1A4FD6"}88`,transition:"width .6s ease"}}/>
                {/* Milestone marker */}
                <div style={{position:"absolute",top:-3,left:`${nextMilestone}%`,transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                  <div style={{width:3,height:16,background:"#FFD580",borderRadius:2,boxShadow:"0 0 6px rgba(255,213,128,.8)"}}/>
                </div>
              </div>
              {/* Emotion label */}
              <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:6}}>
                {emoji} {user.syllabusPct}% — Ahead of {aheadOf}% of students
              </div>
              {/* Next milestone */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,213,128,.1)",borderRadius:8,padding:"5px 10px",border:"1px solid rgba(255,213,128,.2)"}}>
                  <span style={{fontSize:11}}>🎯</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#FFD580"}}>Next: {nextMilestone}% — {chaptersLeft} chapter{chaptersLeft!==1?"s":""} left</span>
                </div>
                <span style={{fontSize:10,color:"#4ADE80",fontWeight:700}}>on track ✓</span>
              </div>
            </div>
          );
        })()}

        {/* Stats cards — tap to explore */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          {[
            {key:"streak",em:"🔥",n:user.streak,  l:"Streak",bg:"#FFF3EC",col:"#E85D20"},
            {key:"xp",    em:"⚡",n:fmtXP(user.xp),l:"XP",   bg:"#FFFBEB",col:"#F59E0B"},
            {key:"won",   em:"🏆",n:user.challengesWon,l:"Won",bg:"#EFF6FF",col:"#1A4FD6"},
            {key:"dls",   em:"📥",n:fmtXP(user.noteDownloads),l:"DLs",bg:"#F5F3FF",col:"#7C3AED"},
          ].map(({key,em,n,l,bg,col})=>(
            <button key={key} onClick={()=>setActiveStatModal(key)}
              style={{background:bg,borderRadius:14,padding:"12px 4px",textAlign:"center",border:`1.5px solid ${col}33`,boxShadow:"0 2px 8px rgba(15,28,63,.06)",cursor:"pointer",position:"relative",transition:"transform .15s, box-shadow .15s"}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.94)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onTouchStart={e=>e.currentTarget.style.transform="scale(.94)"}
              onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{fontSize:18,marginBottom:2}}>{em}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:16,color:col}}>{n}</div>
              <div style={{fontSize:8,color:"#aaa",marginTop:2,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>{l}</div>
              <div style={{position:"absolute",bottom:4,right:5,fontSize:7,color:col,opacity:.5}}>▼</div>
            </button>
          ))}
        </div>

        {/* Stat Modals */}
        {activeStatModal&&(
          <div onClick={()=>setActiveStatModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex",alignItems:"flex-end",animation:"fadeIn .2s"}}>
            <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:600,margin:"0 auto",background:"#fff",borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",animation:"slideUp .3s ease"}}>

              {/* Streak Modal */}
              {activeStatModal==="streak"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontSize:18,fontWeight:900,color:"#1A1A2E"}}>🔥 Streak Calendar</div><div style={{fontSize:12,color:"#aaa",marginTop:2}}>{user.streak} days and counting</div></div>
                    <button onClick={()=>setActiveStatModal(null)} style={{background:"#F4F7FD",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,color:"#888"}}>✕</button>
                  </div>
                  {/* Mini heatmap — last 35 days */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:16}}>
                    {Array.from({length:35},(_,i)=>{
                      const daysAgo=34-i;
                      const active=daysAgo<user.streak;
                      const isToday=daysAgo===0;
                      return <div key={i} style={{aspectRatio:"1",borderRadius:6,background:active?"linear-gradient(135deg,#E85D20,#C2185B)":isToday?"#FFE0D0":"#F4F7FD",border:isToday?"2px solid #E85D20":"none",boxShadow:active?"0 2px 6px rgba(232,93,32,.3)":"none"}}/>;
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:16}}>
                    {[["🔥","Current",`${user.streak}d`,"#FFF3EC","#E85D20"],["⭐","Best","88d","#FFFBEB","#F59E0B"],["📅","This Month","28/30","#EFF6FF","#1A4FD6"]].map(([em,l,v,bg,col])=>(
                      <div key={l} style={{flex:1,background:bg,borderRadius:12,padding:"10px 8px",textAlign:"center",border:`1px solid ${col}22`}}>
                        <div style={{fontSize:16,marginBottom:2}}>{em}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:13,color:col}}>{v}</div>
                        <div style={{fontSize:9,color:"#aaa",fontWeight:600}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"linear-gradient(135deg,#FFF3EC,#FFE8D8)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(232,93,32,.15)"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#E85D20",marginBottom:2}}>🎯 Next milestone</div>
                    <div style={{fontSize:13,color:"#1A1A2E"}}>{streakToRecord} more days to beat your best streak of 88!</div>
                  </div>
                </div>
              )}

              {/* XP Modal */}
              {activeStatModal==="xp"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontSize:18,fontWeight:900,color:"#1A1A2E"}}>⚡ XP Breakdown</div><div style={{fontSize:12,color:"#aaa",marginTop:2}}>How you earned {fmtXP(user.xp)} XP</div></div>
                    <button onClick={()=>setActiveStatModal(null)} style={{background:"#F4F7FD",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,color:"#888"}}>✕</button>
                  </div>
                  {[
                    {label:"Daily Streaks",xp:Math.floor(user.xp*.38),icon:"🔥",pct:38,col:"#E85D20"},
                    {label:"Challenges",xp:Math.floor(user.xp*.28),icon:"🏆",pct:28,col:"#1A4FD6"},
                    {label:"Post Likes",xp:Math.floor(user.xp*.18),icon:"❤️",pct:18,col:"#EF4444"},
                    {label:"Notes Downloads",xp:Math.floor(user.xp*.11),icon:"📥",pct:11,col:"#7C3AED"},
                    {label:"Comments",xp:Math.floor(user.xp*.05),icon:"💬",pct:5,col:"#0A9B6A"},
                  ].map(item=>(
                    <div key={item.label} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <span style={{fontSize:14}}>{item.icon}</span>
                          <span style={{fontSize:12,fontWeight:600,color:"#1A1A2E"}}>{item.label}</span>
                        </div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:800,color:item.col}}>+{fmtXP(item.xp)} XP</span>
                      </div>
                      <div style={{height:6,borderRadius:3,background:"#F4F7FD",overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${item.pct}%`,background:item.col,borderRadius:3,boxShadow:`0 0 8px ${item.col}55`}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{background:"#FFFBEB",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(245,158,11,.2)",marginTop:4}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#F59E0B"}}>⚡ This week</div>
                    <div style={{fontSize:13,color:"#1A1A2E",marginTop:2}}>+320 XP · Top 8% weekly earners</div>
                  </div>
                </div>
              )}

              {/* Won Modal */}
              {activeStatModal==="won"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontSize:18,fontWeight:900,color:"#1A1A2E"}}>🏆 Challenge Wins</div><div style={{fontSize:12,color:"#aaa",marginTop:2}}>{user.challengesWon} competitions won</div></div>
                    <button onClick={()=>setActiveStatModal(null)} style={{background:"#F4F7FD",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,color:"#888"}}>✕</button>
                  </div>
                  {user.challengesWon===0?(
                    <div style={{textAlign:"center",padding:"20px 0"}}>
                      <div style={{fontSize:40,marginBottom:12}}>🎯</div>
                      <div style={{fontSize:15,fontWeight:800,color:"#1A1A2E",marginBottom:6}}>No wins yet — but you're close</div>
                      <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>You've submitted to {history?.length||0} challenges. Winners are in the top 10%.</div>
                      <button onClick={()=>{setActiveStatModal(null);onNav("challenges");}} style={{padding:"12px 24px",borderRadius:50,background:"linear-gradient(135deg,#1A4FD6,#7C3AED)",border:"none",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>Enter a Challenge →</button>
                    </div>
                  ):(history||[]).slice(0,3).map((h,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,background:"#F8FAFD",border:"1px solid #E8ECF4",marginBottom:8}}>
                      <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#1A4FD6,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏆</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,color:"#1A1A2E"}}>{h.title}</div>
                        <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{h.completedAgo} · {h.result}</div>
                      </div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:12,color:"#1A4FD6"}}>+{h.xpEarned}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* DLs Modal */}
              {activeStatModal==="dls"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontSize:18,fontWeight:900,color:"#1A1A2E"}}>📥 Note Downloads</div><div style={{fontSize:12,color:"#aaa",marginTop:2}}>{fmtXP(user.noteDownloads)} students use your notes</div></div>
                    <button onClick={()=>setActiveStatModal(null)} style={{background:"#F4F7FD",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,color:"#888"}}>✕</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                    {[["📥","Total Downloads",fmtXP(user.noteDownloads),"#F5F3FF","#7C3AED"],["📝","Notes Shared",`${user.notes}`,"#EFF6FF","#1A4FD6"],["⭐","Avg Rating","4.8","#FFFBEB","#F59E0B"],["🌍","Cities Reached","47","#ECFDF5","#0A9B6A"]].map(([em,l,v,bg,col])=>(
                      <div key={l} style={{background:bg,borderRadius:14,padding:"14px 12px",border:`1px solid ${col}22`}}>
                        <div style={{fontSize:20,marginBottom:4}}>{em}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:18,color:col}}>{v}</div>
                        <div style={{fontSize:10,color:"#aaa",fontWeight:600,marginTop:2}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"linear-gradient(135deg,#F5F3FF,#EDE9FE)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(124,58,237,.15)"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#7C3AED",marginBottom:2}}>🚀 Impact</div>
                    <div style={{fontSize:13,color:"#1A1A2E"}}>Your notes helped {fmtXP(user.noteDownloads)} students prepare for their exams 💙</div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* "Compete with me" CTA */}
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          <button onClick={()=>onNav("challenges")} style={{flex:3,padding:"11px 0",borderRadius:50,background:"linear-gradient(135deg,#0D0F1A,#1A0A2E)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            ⚔️ Challenge Me
          </button>
          <button onClick={()=>onNav("challenge-portfolio")} style={{flex:2,padding:"11px 0",borderRadius:50,background:"#fff",border:"1.5px solid var(--b2)",color:"var(--sub)",fontSize:12,fontWeight:700,cursor:"pointer"}}>📂 Portfolio</button>
        </div>
        <div style={{display:"flex",gap:2,background:"#E8ECF4",borderRadius:14,padding:4,marginBottom:18}}>
          {[["overview","Overview"],["badges","Badges"],["portfolio","Portfolio"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px",borderRadius:11,background:tab===k?"#fff":"none",border:"none",color:tab===k?"var(--text)":"var(--muted)",fontWeight:tab===k?700:500,fontSize:12,transition:"all .18s"}}>
              {l}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab==="overview"&&(
          <div className="fi">
            {/* Goal card */}
            <div style={{borderRadius:20,overflow:"hidden",marginBottom:12,background:"#fff",border:"1px solid var(--b1)",padding:"16px",boxShadow:"0 2px 8px rgba(15,28,63,.05)"}}>
              <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",letterSpacing:".06em",marginBottom:6}}>🎯 EXAM GOAL</div>
              <div style={{fontSize:15,fontWeight:800,color:"var(--text)",marginBottom:12}}>{user.goal}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:700,color:"var(--sub)"}}>Syllabus Progress</span>
                <span style={{fontSize:11,fontWeight:800,color:str?.color||"#1A4FD6"}}>{user.syllabusPct}%</span>
              </div>
              <div style={{height:6,borderRadius:3,background:"rgba(15,28,63,.08)",overflow:"hidden",marginBottom:6}}>
                <div style={{height:"100%",width:`${user.syllabusPct}%`,background:`linear-gradient(90deg,${str?.color||"#1A4FD6"},#7C3AED)`,borderRadius:3}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)"}}>
                <span>{user.syllabusPct}% complete</span><span>{user.daysToExam} days left</span>
              </div>
            </div>
            {/* Skills */}
            <div style={{borderRadius:20,padding:"16px",background:"#fff",border:"1px solid var(--b1)",marginBottom:12,boxShadow:"0 2px 8px rgba(15,28,63,.05)"}}>
              <div style={{fontWeight:800,fontSize:13,color:"var(--text)",marginBottom:12}}>Skills</div>
              {user.skillLevels.map(([sk,pct,col])=>(
                <div key={sk} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:600,color:"var(--sub)"}}>{sk}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:col,fontWeight:700}}>{pct}%</span>
                  </div>
                  <div style={{height:5,borderRadius:3,background:"rgba(15,28,63,.08)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:3,boxShadow:`0 0 8px ${col}66`}}/>
                  </div>
                </div>
              ))}
            </div>
            {/* Streak timeline */}
            <div style={{borderRadius:20,padding:"16px",background:"#fff",border:"1px solid var(--b1)",marginBottom:12,boxShadow:"0 2px 8px rgba(15,28,63,.05)"}}>
              <div style={{fontWeight:800,fontSize:13,color:"var(--text)",marginBottom:14}}>Streak Goals 🔥</div>
              <div style={{display:"flex",alignItems:"center",padding:"0 4px"}}>
                {user.streakGoals.map((g,i,arr)=>(
                  <div key={g.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                    {i<arr.length-1&&<div style={{position:"absolute",top:14,left:"50%",right:"-50%",height:2,background:g.done?str?.color||"#1A4FD6":"#E8ECF4",zIndex:0}}/>}
                    <div style={{width:30,height:30,borderRadius:"50%",background:g.done?str?.color||"#1A4FD6":"rgba(255,255,255,.08)",border:`2px solid ${g.done?str?.color||"#1A4FD6":"rgba(255,255,255,.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,zIndex:1,position:"relative",boxShadow:g.done?`0 0 12px ${str?.color||"#1A4FD6"}66`:"none"}}>{g.done?"✓":"·"}</div>
                    <div style={{fontSize:9,fontWeight:700,color:"var(--sub)",marginTop:5}}>{g.day}d</div>
                    <div style={{fontSize:8,color:"var(--muted)",marginTop:1}}>{g.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="badges"&&(
          <div className="fi">
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:12,fontWeight:500}}>Earned badges are visible to companies on your Talent Profile.</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {PROOF_BADGES.map(b=>{
                const col=BADGE_COLORS[b.tier]||"#7988A8";
                return (
                  <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:18,background:b.earned?"#fff":"#F8FAFC",border:`1px solid ${b.earned?col+"40":"var(--b1)"}`,opacity:b.earned?1:.4}}>
                    <div style={{width:44,height:44,borderRadius:14,background:b.earned?BADGE_TIERS[b.tier]:"#F0F4FA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{b.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:b.earned?col:"var(--muted)"}}>{b.label}</div>
                      <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{b.desc}</div>
                    </div>
                    {b.earned&&<div style={{fontSize:9,fontWeight:800,color:col,background:`${col}18`,padding:"3px 8px",borderRadius:50,textTransform:"uppercase",letterSpacing:".04em"}}>{b.tier}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tab==="portfolio"&&(
          <div className="fi">
            <div style={{padding:"11px 14px",borderRadius:14,background:"#EEF4FF",border:"1px solid rgba(26,79,214,.15)",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1A4FD6",marginBottom:2}}>📂 Challenge Portfolio</div>
              <div style={{fontSize:10,color:"var(--muted)"}}>Each completed challenge is proof of real skill.</div>
            </div>
            {history.map((h,i)=>(
              <div key={i} style={{padding:"14px 16px",borderRadius:18,background:"#fff",border:"1px solid var(--b1)",marginBottom:8,boxShadow:"0 2px 6px rgba(15,28,63,.05)"}}>
                <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:3}}>{h.title}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginBottom:8}}>{h.sponsor} · {h.completedAgo}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:50,background:"rgba(26,79,214,.2)",color:"#93C5FD",border:"1px solid rgba(26,79,214,.3)"}}>{h.result}</span>
                  {h.badge&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:50,background:"rgba(185,114,0,.15)",color:"#FFD580",border:"1px solid rgba(185,114,0,.25)"}}>{h.badge}</span>}
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:50,background:"rgba(26,79,214,.15)",color:"#93C5FD",border:"1px solid rgba(26,79,214,.2)",fontFamily:"'JetBrains Mono',monospace"}}>⚡{h.xpEarned}XP</span>
                </div>
              </div>
            ))}
            <button onClick={()=>onNav("challenge-portfolio")} style={{width:"100%",padding:"13px",borderRadius:14,background:"#fff",border:"1.5px solid var(--b2)",color:"var(--sub)",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:4}}>View full portfolio →</button>
          </div>
        )}
        <div style={{height:100}}/>
      </div>
      <BottomNav onNav={onNav} active="profile" user={user} onPost={onPost} />
    </div>
  );
}


// ─── Comment Drawer ───────────────────────────────────────────────────────────
// Helper to get comments for a post
function getPostComments(postId, extraComments) {
  const seed = (INIT_POST_COMMENTS[postId]||[]);
  return [...seed, ...(extraComments||[])];
}


function CommentDrawer({post,onClose,onAddComment,currentUser,extraComments,liked,setLiked}) {
  const [input,setInput]=useState("");
  const [likedComments,setLikedComments]=useState([]);
  const allComments=getPostComments(post.id, extraComments||[]);
  const userAdded=(extraComments||[]).length;
  const totalCount=post.comments+userAdded;

  const submit=()=>{
    if(!input.trim()) return;
    const c={id:Date.now(),studentId:currentUser.id,name:currentUser.name,avatar:currentUser.avatar,text:input.trim(),time:"just now",likes:0};
    onAddComment&&onAddComment(post.id,c);
    setInput("");
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(15,28,63,.5)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",background:"#fff",borderRadius:"22px 22px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",paddingTop:10}}>
          <div style={{width:36,height:4,borderRadius:2,background:"#E0E6F0"}}/>
        </div>
        {/* Header */}
        <div style={{padding:"10px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #F0F4FA"}}>
          <div style={{fontWeight:800,fontSize:15,color:"var(--text)"}}>Comments <span style={{color:"var(--muted)",fontWeight:500,fontSize:13}}>({totalCount})</span></div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"#F0F4FA",border:"none",fontSize:14,color:"#666",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* Original post snippet */}
        <div style={{padding:"10px 16px 10px",borderBottom:"1px solid #F0F4FA",background:"#FAFBFF"}}>
          <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
            <img src={post.avatar} width={34} height={34} style={{borderRadius:"50%",border:"1.5px solid #E8ECF2",flexShrink:0}}/>
            <div style={{minWidth:0}}>
              <span style={{fontWeight:700,fontSize:12,color:"var(--text)"}}>{post.name}</span>
              <span style={{fontSize:12,color:"var(--sub)",marginLeft:6,lineHeight:1.5}}>{post.text.slice(0,110)}{post.text.length>110?"…":""}</span>
            </div>
          </div>
        </div>
        {/* Comments list */}
        <div style={{overflowY:"auto",flex:1,padding:"12px 16px 8px"}}>
          {totalCount>allComments.length&&(
            <div style={{textAlign:"center",padding:"8px 0 14px",fontSize:11,color:"var(--muted)"}}>
              Showing top comments · {totalCount.toLocaleString()} total
            </div>
          )}
          {allComments.length===0&&(
            <div style={{textAlign:"center",padding:"30px 0",color:"var(--muted)",fontSize:13}}>No comments yet. Be the first! 💬</div>
          )}
          {allComments.map(c=>(
            <div key={c.id} style={{display:"flex",gap:9,marginBottom:16}}>
              <img src={c.avatar||ALL_AVATARS[0]} width={34} height={34} style={{borderRadius:"50%",flexShrink:0,border:"1.5px solid #E8ECF2"}}/>
              <div style={{flex:1}}>
                <div style={{background:"#F4F7FD",borderRadius:"0 14px 14px 14px",padding:"9px 13px"}}>
                  <div style={{fontWeight:700,fontSize:12,color:"var(--text)",marginBottom:3}}>{c.name}</div>
                  <div style={{fontSize:13,color:"#1A1A2E",lineHeight:1.55}}>{c.text}</div>
                </div>
                <div style={{display:"flex",gap:14,marginTop:5,paddingLeft:4,alignItems:"center"}}>
                  <span style={{fontSize:10,color:"#bbb"}}>{c.time}</span>
                  <button onClick={()=>setLikedComments(l=>l.includes(c.id)?l.filter(x=>x!==c.id):[...l,c.id])} style={{background:"none",border:"none",padding:0,fontSize:10,color:likedComments.includes(c.id)?"#E0245E":"var(--muted)",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
                    {likedComments.includes(c.id)?"❤️":"🤍"} {c.likes+(likedComments.includes(c.id)?1:0)}
                  </button>
                  <button style={{background:"none",border:"none",padding:0,fontSize:10,color:"var(--blue)",fontWeight:700,cursor:"pointer"}}>Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{padding:"10px 14px 24px",borderTop:"1px solid #F0F4FA",display:"flex",gap:8,alignItems:"center",background:"#fff"}}>
          <img src={currentUser.avatar} width={34} height={34} style={{borderRadius:"50%",border:"1.5px solid #E8ECF2",flexShrink:0}}/>
          <div style={{flex:1,display:"flex",gap:6,alignItems:"center",background:"#F4F7FD",borderRadius:50,padding:"8px 14px",border:"1.5px solid #E8ECF2"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder={`Reply as ${currentUser.name.split(" ")[0]}…`} style={{flex:1,background:"none",border:"none",outline:"none",fontSize:13,color:"var(--text)"}}/>
            <button onClick={submit} style={{background:"none",border:"none",color:input.trim()?"var(--blue)":"#ccc",fontWeight:800,fontSize:13,flexShrink:0,cursor:input.trim()?"pointer":"default"}}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Share Sheet ───────────────────────────────────────────────────────────────
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

// ─── Follow Button ────────────────────────────────────────────────────────────
function FollowButton({id,name,isFollowed,onFollow,followers=800}) {
  const [justFollowed,setJustFollowed]=useState(false);
  const [showToast,setShowToast]=useState(false);
  const count=followers+(isFollowed?1:0);
  const fmt=n=>n>=1000?(n/1000).toFixed(1)+"K":n;

  const handle=()=>{
    onFollow(id);
    if(!isFollowed){
      setJustFollowed(true);
      setShowToast(true);
      setTimeout(()=>setShowToast(false),3000);
    } else {
      setJustFollowed(false);
    }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0,position:"relative"}}>
      {/* Micro-feedback toast */}
      {showToast&&(
        <div style={{position:"absolute",top:-52,right:0,background:"#0D0F1A",borderRadius:12,padding:"7px 12px",whiteSpace:"nowrap",fontSize:11,fontWeight:600,color:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,.35)",border:"1px solid rgba(255,255,255,.1)",animation:"slideDown .3s ease",zIndex:50}}>
          You'll see {name}'s progress 🔥
          <div style={{position:"absolute",bottom:-5,right:18,width:10,height:10,background:"#0D0F1A",transform:"rotate(45deg)",border:"0 solid transparent",borderRight:"1px solid rgba(255,255,255,.1)",borderBottom:"1px solid rgba(255,255,255,.1)"}}/>
        </div>
      )}
      <button onClick={handle} style={{padding:"10px 20px",borderRadius:50,background:isFollowed?"#F0F4FB":"linear-gradient(135deg,#1A4FD6,#7C3AED)",color:isFollowed?"var(--muted)":"#fff",border:isFollowed?"1.5px solid var(--b2)":"none",fontWeight:800,fontSize:12,cursor:"pointer",boxShadow:isFollowed?"none":"0 4px 16px rgba(26,79,214,.4)",transition:"all .2s",transform:justFollowed&&!isFollowed?"scale(1.08)":"scale(1)"}}>
        {isFollowed?"✓ Following":"+ Follow"}
      </button>
      <div style={{fontSize:10,color:"var(--muted)",fontWeight:600,letterSpacing:".02em"}}>{fmt(count)} followers</div>
    </div>
  );
}

// ─── Student Profile (view any user) ─────────────────────────────────────────
function StudentProfile({studentId,onBack,onFollow,followed}) {
  const s=STUDENTS.find(x=>x.id===studentId)||STUDENTS[0];
  const posts=FEED_POSTS.filter(p=>p.studentId===s.id);
  const isFollowed=followed.includes(s.id);
  const [tab,setTab]=useState("posts");
  const [showMsg,setShowMsg]=useState(false);
  const str=STREAM[s.stream];
  const fmtXP=n=>n>=1000?(n/1000).toFixed(1)+"K":n;
  const nextMilestone=Math.ceil(s.syllabusPct/10)*10;
  const chaptersLeft=Math.round((nextMilestone-s.syllabusPct)/10*4);
  const aheadOf=Math.min(97,100-s.percentile+Math.floor(s.syllabusPct*.7));
  const firstName=s.name.split(" ")[0];

  // Personalised invite messages
  const inviteMsgs=[
    `Hey ${firstName}! 👋 Saw your ${s.skillLevels[0][0]} score (${s.skillLevels[0][1]}%) — that's impressive. Would love to study together! 🔥`,
    `${firstName}, your ${s.streak}-day streak is insane 💪 I'm on a ${Math.floor(s.streak*.6)}-day streak — let's push each other to the top!`,
    `Hey! I'm also preparing for ${s.exam} 🎯 Your notes on ${s.skillLevels[0][0]} helped me a lot. Can we connect?`,
    `${firstName} you're Rank #${s.rank} — I want to learn from the best! Would you be open to a quick study session? ⚡`,
  ];
  const [selectedMsg,setSelectedMsg]=useState(0);
  const [customMsg,setCustomMsg]=useState("");
  const [sent,setSent]=useState(false);

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"var(--bg)",overflowY:"auto",animation:"slideInRight .25s ease"}}>
      {/* Hero */}
      <div style={{position:"relative"}}>
        <div style={{height:120,overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 130% 100% at 65% -10%,${str?.color||"#1A4FD6"}55 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 10% 110%,#7C3AED33 0%,transparent 55%),linear-gradient(180deg,#131629 0%,#0D0F1A 100%)`}}/>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
          <div style={{position:"absolute",top:-50,right:-30,width:200,height:200,borderRadius:"50%",background:`${str?.color||"#1A4FD6"}1a`,filter:"blur(40px)"}}/>
          <button onClick={onBack} style={{position:"absolute",top:14,left:14,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.08)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",zIndex:3}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          <div style={{position:"absolute",top:14,right:14,zIndex:3}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:50,background:"rgba(255,255,255,.1)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.18)",fontSize:11,fontWeight:700,color:"#fff"}}>
              {str?.emoji} {str?.label}
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:-46,left:18,zIndex:10}}>
          <div style={{position:"relative",display:"inline-block"}}>
            <div style={{width:92,height:92,borderRadius:"50%",padding:3,background:`conic-gradient(${str?.color||"#1A4FD6"},#7C3AED,${str?.color||"#1A4FD6"})`}}>
              <img src={s.avatar} width={86} height={86} alt="" style={{borderRadius:"50%",display:"block",border:"3px solid var(--bg)",objectFit:"cover"}}/>
            </div>
            {s.verified&&<div style={{position:"absolute",bottom:4,right:2,width:20,height:20,background:"#0A9B6A",borderRadius:"50%",border:"2.5px solid var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"white",fontWeight:900}}>✓</div>}
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"56px 18px 0"}}>
        {/* Identity + follow */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontWeight:900,fontSize:21,color:"var(--text)",letterSpacing:"-.03em"}}>{s.name}</span>
              {s.verified&&<span style={{fontSize:10,fontWeight:800,color:"#34D399",background:"rgba(52,211,153,.15)",padding:"2px 8px",borderRadius:50,border:"1px solid rgba(52,211,153,.3)"}}>✔ VERIFIED</span>}
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>📍 {s.city} · 🎯 {s.exam}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <span style={{fontSize:10,fontWeight:800,color:"#FFD580",background:"rgba(255,213,128,.12)",padding:"3px 9px",borderRadius:50,border:"1px solid rgba(255,213,128,.25)"}}>{s.rankLabel}</span>
              <span style={{fontSize:10,fontWeight:800,color:"#4ADE80",background:"rgba(74,222,128,.1)",padding:"3px 9px",borderRadius:50,border:"1px solid rgba(74,222,128,.2)"}}>Top {s.percentile}th %ile</span>
            </div>
          </div>
          <FollowButton id={s.id} name={firstName} isFollowed={isFollowed} onFollow={onFollow} followers={s.noteDownloads?Math.floor(s.noteDownloads/3):800}/>
        </div>

        {/* Message Button */}
        <button onClick={()=>setShowMsg(true)} style={{width:"100%",padding:"12px",borderRadius:14,background:isFollowed?"linear-gradient(135deg,#1A4FD6,#7C3AED)":"#fff",border:isFollowed?"none":"1.5px solid var(--b2)",color:isFollowed?"#fff":"var(--text)",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14,boxShadow:isFollowed?"0 4px 16px rgba(26,79,214,.3)":"0 1px 4px rgba(15,28,63,.06)"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {isFollowed?`Message ${firstName}`:`Send ${firstName} a Study Invite 💌`}
        </button>

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
          {[["🔥",s.streak,"Streak","#FFF3EC","#E85D20"],["⚡",fmtXP(s.xp),"XP","#FFFBEB","#F59E0B"],["🏆",s.challengesWon,"Won","#EFF6FF","#1A4FD6"],["📥",fmtXP(s.noteDownloads),"DLs","#F5F3FF","#7C3AED"]].map(([em,n,l,bg,col])=>(
            <div key={l} style={{background:bg,borderRadius:14,padding:"12px 4px",textAlign:"center",border:`1px solid ${col}22`,boxShadow:"0 2px 6px rgba(15,28,63,.05)"}}>
              <div style={{fontSize:18,marginBottom:2}}>{em}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:15,color:col}}>{n}</div>
              <div style={{fontSize:9,color:"var(--muted)",marginTop:2,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{borderRadius:16,background:"linear-gradient(135deg,#0D0F1A,#1A0A2E)",padding:"14px 16px",marginBottom:14,border:"1px solid rgba(255,255,255,.08)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:".05em"}}>SYLLABUS PROGRESS</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:900,color:str?.color||"#1A4FD6"}}>{s.syllabusPct}%</span>
          </div>
          <div style={{position:"relative",height:8,borderRadius:4,background:"rgba(255,255,255,.08)",overflow:"visible",marginBottom:8}}>
            <div style={{height:"100%",width:`${s.syllabusPct}%`,background:`linear-gradient(90deg,${str?.color||"#1A4FD6"},#7C3AED)`,borderRadius:4,boxShadow:`0 0 10px ${str?.color||"#1A4FD6"}88`}}/>
            <div style={{position:"absolute",top:-2,left:`${nextMilestone}%`,transform:"translateX(-50%)",width:3,height:12,background:"#FFD580",borderRadius:2,boxShadow:"0 0 6px rgba(255,213,128,.8)"}}/>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:5}}>
            {s.syllabusPct>=80?"🔥":s.syllabusPct>=60?"⚡":"📈"} {s.syllabusPct}% — Ahead of {aheadOf}% of students
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,213,128,.1)",borderRadius:8,padding:"5px 10px",border:"1px solid rgba(255,213,128,.2)"}}>
            <span style={{fontSize:11}}>🎯</span>
            <span style={{fontSize:10,fontWeight:700,color:"#FFD580"}}>Next: {nextMilestone}% — {chaptersLeft} chapter{chaptersLeft!==1?"s":""} left</span>
          </div>
        </div>

        {/* Skills */}
        <div style={{padding:"14px 16px",borderRadius:18,background:"#fff",border:"1px solid var(--b1)",marginBottom:16,boxShadow:"0 2px 6px rgba(15,28,63,.05)"}}>
          <div style={{fontWeight:800,fontSize:13,color:"var(--text)",marginBottom:12}}>Skills</div>
          {s.skillLevels.map(([sk,pct,col])=>(
            <div key={sk} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:600,color:"var(--sub)"}}>{sk}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:col,fontWeight:700}}>{pct}%</span>
              </div>
              <div style={{height:5,borderRadius:3,background:"rgba(15,28,63,.08)",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:3,boxShadow:`0 0 8px ${col}66`}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:2,background:"#E8ECF4",borderRadius:14,padding:4,marginBottom:16}}>
          {[["posts",`📝 Posts (${posts.length})`],["about","About"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px",borderRadius:11,background:tab===k?"#fff":"none",border:"none",color:tab===k?"var(--text)":"var(--muted)",fontWeight:tab===k?700:500,fontSize:12,transition:"all .18s"}}>{l}</button>
          ))}
        </div>

        {tab==="posts"&&(
          <div className="fi">
            {posts.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"var(--muted)",fontSize:12}}>No posts yet</div>}
            {posts.map(p=>(
              <div key={p.id} style={{borderRadius:18,overflow:"hidden",marginBottom:10,background:"#fff",border:"1px solid var(--b1)",boxShadow:"0 2px 8px rgba(15,28,63,.05)"}}>
                {p.imageUrl&&<img src={p.imageUrl} alt="" style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>}
                <div style={{padding:"12px 14px"}}>
                  <div style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>{p.subject} · {p.time}</div>
                  <p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,marginBottom:8}}>{p.text}</p>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{p.tags.map(t=><span key={t} style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:5,background:"#EEF2FF",color:"var(--blue)",border:"1px solid rgba(26,79,214,.15)",fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}</div>
                  <div style={{display:"flex",gap:12,fontSize:11,color:"var(--muted)"}}>
                    <span>❤️ {p.likes>=1000?(p.likes/1000).toFixed(1)+"K":p.likes}</span>
                    <span>💬 {p.comments>=1000?(p.comments/1000).toFixed(1)+"K":p.comments}</span>
                    <span>🔖 {p.saves>=1000?(p.saves/1000).toFixed(1)+"K":p.saves}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="about"&&(
          <div className="fi" style={{padding:"16px",borderRadius:18,background:"#fff",border:"1px solid var(--b1)",boxShadow:"0 2px 8px rgba(15,28,63,.05)"}}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["📍","City",s.city],["🎯","Exam",s.exam],["📅","Streak",`${s.streak} days`],["⚡","Total XP",`${s.xp.toLocaleString()} XP`],["📥","Downloads",s.noteDownloads.toLocaleString()],["✅","Syllabus",`${s.syllabusPct}% done`]].map(([ic,l,v])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:18,width:28,textAlign:"center"}}>{ic}</span>
                  <span style={{fontSize:12,color:"var(--muted)",minWidth:90}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{height:60}}/>
      </div>

      {/* Message / Invite Sheet */}
      {showMsg&&(
        <div onClick={()=>{setShowMsg(false);setSent(false);}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"flex-end",animation:"fadeIn .2s"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:600,margin:"0 auto",background:"#fff",borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",animation:"slideUp .3s ease"}}>
            {sent?(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                <div style={{fontSize:18,fontWeight:900,color:"var(--text)",marginBottom:6}}>Message Sent!</div>
                <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>{firstName} will see your message and can accept your study invite.</div>
                <button onClick={()=>{setShowMsg(false);setSent(false);}} style={{padding:"12px 32px",borderRadius:50,background:"linear-gradient(135deg,#1A4FD6,#7C3AED)",border:"none",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Done ✓</button>
              </div>
            ):(
              <>
                {/* Header */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <img src={s.avatar} width={40} height={40} alt="" style={{borderRadius:"50%",border:"2px solid var(--b2)"}}/>
                    <div>
                      <div style={{fontWeight:800,fontSize:15,color:"var(--text)"}}>{isFollowed?`Message ${firstName}`:`Study Invite to ${firstName}`}</div>
                      <div style={{fontSize:11,color:"var(--muted)"}}>{isFollowed?"Send a direct message":"They'll get a request to connect"}</div>
                    </div>
                  </div>
                  <button onClick={()=>setShowMsg(false)} style={{background:"#F4F7FD",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,color:"#888"}}>✕</button>
                </div>

                {/* If not followed — show invite templates */}
                {!isFollowed&&(
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:8}}>✨ PERSONALISED TEMPLATES</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {inviteMsgs.map((msg,i)=>(
                        <button key={i} onClick={()=>{setSelectedMsg(i);setCustomMsg("");}}
                          style={{padding:"10px 12px",borderRadius:12,background:selectedMsg===i&&!customMsg?"linear-gradient(135deg,rgba(26,79,214,.08),rgba(124,58,237,.08))":"#F8FAFD",border:selectedMsg===i&&!customMsg?"1.5px solid rgba(26,79,214,.3)":"1.5px solid var(--b1)",textAlign:"left",fontSize:12,color:"var(--text)",cursor:"pointer",lineHeight:1.5,fontWeight:selectedMsg===i&&!customMsg?600:400}}>
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom message input */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".04em",marginBottom:6}}>{isFollowed?"MESSAGE":"OR WRITE YOUR OWN"}</div>
                  <textarea
                    value={customMsg||(!isFollowed?inviteMsgs[selectedMsg]:"")}
                    onChange={e=>setCustomMsg(e.target.value)}
                    placeholder={isFollowed?`Write a message to ${firstName}...`:"Customise your invite..."}
                    style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1.5px solid var(--b2)",fontSize:13,color:"var(--text)",outline:"none",background:"#F8FAFD",resize:"none",height:90,fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.5}}
                  />
                </div>

                {/* Send button */}
                <button onClick={()=>setSent(true)}
                  style={{width:"100%",padding:"14px",borderRadius:50,background:"linear-gradient(135deg,#1A4FD6,#7C3AED)",border:"none",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 16px rgba(26,79,214,.35)"}}>
                  {isFollowed?"Send Message 💬":"Send Study Invite 💌"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Initial Comments per Post (real users, real content) ──────────────────────
const INIT_POST_COMMENTS = {
  1:[
    {id:101,studentId:8, name:"Kavya Reddy",  avatar:ALL_AVATARS[7],  text:"p53 is SO important for NEET — saw it in 3 questions last year's paper! 🔥",           time:"45m ago", likes:18, liked:false},
    {id:102,studentId:2, name:"Neha Gupta",   avatar:ALL_AVATARS[1],  text:"Wait so it's technically a transcription factor not an enzyme? That's a classic NCERT trap 😭", time:"30m ago", likes:9, liked:false},
    {id:103,studentId:5, name:"Simran Kaur",  avatar:ALL_AVATARS[4],  text:"Bookmarking this. My bio teacher never explained it this clearly.", time:"12m ago", likes:6, liked:false},
  ],
  2:[
    {id:201,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"This exact question came in JEE Mains 2023 Session 2! 🎯", time:"1h ago", likes:34, liked:false},
    {id:202,studentId:10,name:"Dev Patel",     avatar:ALL_AVATARS[9],  text:"Energy conservation questions are my weakness — saving this derivation", time:"50m ago", likes:11, liked:false},
    {id:203,studentId:14,name:"Karan Bhatia",  avatar:ALL_AVATARS[13], text:"h/4 caught me off guard the first time. Thanks for the step-by-step!", time:"20m ago", likes:5, liked:false},
  ],
  3:[
    {id:301,studentId:1, name:"Priya Menon",  avatar:ALL_AVATARS[0],  text:"CF₃COOH was in NEET 2022! Fluorine's electronegativity = key concept 💪", time:"2h ago", likes:22, liked:false},
    {id:302,studentId:9, name:"Tanvi Shah",   avatar:ALL_AVATARS[8],  text:"Finally someone explains this properly instead of just giving the answer 🙏", time:"1h ago", likes:15, liked:false},
    {id:303,studentId:13,name:"Shriya Agarwal",avatar:ALL_AVATARS[12], text:"Inductive effect clarity: EN ∝ electron withdrawal ∝ acid strength. Got it!", time:"30m ago", likes:8, liked:false},
  ],
  4:[
    {id:401,studentId:6, name:"Rohan Desai",  avatar:ALL_AVATARS[5],  text:"Python loop variable scoping is a nightmare for beginners 😂 great question!", time:"3h ago", likes:19, liked:false},
    {id:402,studentId:18,name:"Siddharth Joshi",avatar:ALL_AVATARS[17],text:"This is literally an Amazon SDE interview question I got last month 😅",         time:"2h ago", likes:27, liked:false},
  ],
  5:[
    {id:501,studentId:2, name:"Neha Gupta",   avatar:ALL_AVATARS[1],  text:"720/720!!! This is insane. What mock test series were you using?? 🤯",   time:"4h ago", likes:89, liked:false},
    {id:502,studentId:8, name:"Kavya Reddy",  avatar:ALL_AVATARS[7],  text:"The schedule is 🔥 Stealing this for the next 48 days. Thank you Priya!",  time:"3h ago", likes:67, liked:false},
    {id:503,studentId:5, name:"Simran Kaur",  avatar:ALL_AVATARS[4],  text:"This post just gave me the push I needed at 2am. Not sleeping. Opening Bio notes.", time:"2h ago", likes:45, liked:false},
    {id:504,studentId:13,name:"Shriya Agarwal",avatar:ALL_AVATARS[12], text:"Following for more motivation posts. The weekly breakdown is gold 🥇",   time:"1h ago", likes:31, liked:false},
  ],
  6:[
    {id:601,studentId:1, name:"Priya Menon",  avatar:ALL_AVATARS[0],  text:"Day 61-88 feels automatic — YES. That's exactly what happened to me too!", time:"5h ago", likes:41, liked:false},
    {id:602,studentId:15,name:"Meera Pillai", avatar:ALL_AVATARS[14], text:"Current streak: 73 days. Day 31-60 phase almost destroyed me 😭 pushing through!", time:"3h ago", likes:28, liked:false},
    {id:603,studentId:7, name:"Arjun Nair",   avatar:ALL_AVATARS[6],  text:"My streak: 21 days. You just gave me motivation to reach 88. Thank you 🙏", time:"1h ago", likes:14, liked:false},
  ],
  7:[
    {id:701,studentId:12,name:"Aditya Kumar",  avatar:ALL_AVATARS[11], text:"This motivation post hit different at 2am before my mock 😭 thank you 🙏", time:"3h ago", likes:56, liked:false},
    {id:702,studentId:19,name:"Riya Joshi",    avatar:ALL_AVATARS[18], text:"Day 142 here — it DOES get automatic. You've got this bestie 💪", time:"2h ago", likes:43, liked:false},
    {id:703,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"Cried after my mock too. 61%. This post literally saved my night 🤝", time:"1h ago", likes:29, liked:false},
  ],
  8:[
    {id:801,studentId:11,name:"Ananya Singh",  avatar:ALL_AVATARS[10], text:"The JEE win challenge saga is so inspiring — congrats on the internship!! 🎉", time:"6h ago", likes:38, liked:false},
    {id:802,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"Which company? This is huge motivation for all of us coding track students 🔥", time:"4h ago", likes:22, liked:false},
    {id:803,studentId:17,name:"Vikram Nair",   avatar:ALL_AVATARS[16], text:"Challenge mode unlocked. Starting my submission tonight!", time:"2h ago", likes:18, liked:false},
  ],
  9:[
    {id:901,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"DNA replication questions are 5-6 marks in NEET every year. This is gold 🧬", time:"8h ago", likes:31, liked:false},
    {id:902,studentId:20,name:"Pooja Sharma",  avatar:ALL_AVATARS[19], text:"Semi-conservative replication was SO confusing until I read this 💡", time:"5h ago", likes:19, liked:false},
    {id:903,studentId:16,name:"Sana Sheikh",   avatar:ALL_AVATARS[15], text:"Meselson-Stahl experiment explanation is perfect here. Saving this forever 📌", time:"2h ago", likes:12, liked:false},
  ],
  10:[
    {id:1001,studentId:8, name:"Kavya Reddy",  avatar:ALL_AVATARS[7],  text:"GOC resonance at 11pm was my villain origin story 😂 this helps so much", time:"10h ago", likes:24, liked:false},
    {id:1002,studentId:14,name:"Karan Bhatia", avatar:ALL_AVATARS[13], text:"Mesomeric effect > inductive effect in resonance — that clarity is 🔥", time:"7h ago", likes:17, liked:false},
    {id:1003,studentId:9, name:"Tanvi Shah",   avatar:ALL_AVATARS[8],  text:"Can you do one on hyperconjugation next? Always mix them up!", time:"3h ago", likes:9, liked:false},
  ],
  11:[
    {id:1101,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"Hardy-Weinberg is literally 4-5 marks in NEET every year. Saving this 🧬", time:"1d ago", likes:31, liked:false},
    {id:1102,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"The banana DNA fact just ended me 🍌😭 sharing this with everyone", time:"22h ago", likes:19, liked:false},
    {id:1103,studentId:8, name:"Kavya Reddy",   avatar:ALL_AVATARS[7],  text:"Miller-Urey explanation is spot on. This is how NCERT wants you to think about it 💯", time:"18h ago", likes:14, liked:false},
  ],
  12:[
    {id:1201,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"InOrder = LNR not LRN — I always mix this up. The alphabetical trick is genius 🤯", time:"1d ago", likes:28, liked:false},
    {id:1202,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"Can you do graphs next? BFS vs DFS always confuses me", time:"20h ago", likes:17, liked:false},
    {id:1203,studentId:15,name:"Meera Pillai",  avatar:ALL_AVATARS[14], text:"30-second test done ✅ Got it! The mnemonic is GOATED", time:"14h ago", likes:11, liked:false},
  ],
  13:[
    {id:1301,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"January → March arc is TOO real 😭 crying but also motivated somehow", time:"2d ago", likes:89, liked:false},
    {id:1302,studentId:8, name:"Kavya Reddy",   avatar:ALL_AVATARS[7],  text:"Day 34 AND you're already reflecting like this? You're going to be fine 💪", time:"2d ago", likes:67, liked:false},
    {id:1303,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"'The students who make it aren't the smartest' — printing this and sticking it to my wall", time:"1d ago", likes:52, liked:false},
  ],
  14:[
    {id:1401,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"'I think I understand Genetics' → fails every Hardy-Weinberg' 💀 this is me every single time", time:"2d ago", likes:112, liked:false},
    {id:1402,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"My revision tip: solve previous year papers before finishing the chapter. Forces you to see gaps 🔥", time:"2d ago", likes:78, liked:false},
    {id:1403,studentId:15,name:"Meera Pillai",  avatar:ALL_AVATARS[14], text:"'One more mock and I'm done' currently on mock 4 😭 story of my life", time:"1d ago", likes:61, liked:false},
  ],
  15:[
    {id:1501,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"🙋 Day 29 solidarity from Day 47. It DOES get clearer. Keep going!", time:"2d ago", likes:67, liked:false},
    {id:1502,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"🙋 Day 21 here. The 'feeling dumb' phase is so real. Thank you for posting this", time:"2d ago", likes:43, liked:false},
    {id:1503,studentId:11,name:"Ananya Singh",  avatar:ALL_AVATARS[10], text:"Stop comparing your chapter 1 to someone's chapter 20 — this advice is literally gold 🥇", time:"1d ago", likes:38, liked:false},
  ],
  16:[
    {id:1601,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"3-2-1 method literally changed my retention. I use it for everything now. Bio score went from 71% to 89%!", time:"2d ago", likes:94, liked:false},
    {id:1602,studentId:8, name:"Kavya Reddy",   avatar:ALL_AVATARS[7],  text:"'MCQs expose gaps; reading creates false confidence' — this sentence deserves its own post 🔥", time:"2d ago", likes:71, liked:false},
    {id:1603,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"I struggle most with Genetics numericals. Any tips specifically for Hardy-Weinberg calc?", time:"1d ago", likes:29, liked:false},
  ],
  17:[
    {id:1701,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"'No studying after 9pm' is underrated. I used to study till midnight and retained nothing 😭", time:"3d ago", likes:87, liked:false},
    {id:1702,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"The 30 min walk is non-negotiable for me too. Brain genuinely works better after it 💯", time:"3d ago", likes:64, liked:false},
    {id:1703,studentId:9, name:"Tanvi Shah",    avatar:ALL_AVATARS[8],  text:"Mistake analysis at 5pm is the move. That hour made my score jump 12% in one month", time:"2d ago", likes:48, liked:false},
  ],
  18:[
    {id:1801,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"FINALLY someone explains it with the LOGIC not just the diagram. Krebs clicked for me just now 🧠", time:"3d ago", likes:54, liked:false},
    {id:1802,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"1 turn = 2CO₂, 3NADH, 1FADH₂, 1GTP — screenshot saved. This is the cleanest summary I've seen", time:"3d ago", likes:39, liked:false},
    {id:1803,studentId:11,name:"Ananya Singh",  avatar:ALL_AVATARS[10], text:"Drawn from memory ✅ Actually worked! The visual logic approach > rote memorisation always", time:"2d ago", likes:27, liked:false},
  ],
  19:[
    {id:1901,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"JEE 2023 Session 2 had this EXACT form! You're not wrong, this literally saved me 90 seconds 🙏", time:"3d ago", likes:67, liked:false},
    {id:1902,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"e^[lim(f(x)-1)·g(x)] form — I've been doing L'Hopital on every 1^∞ like a fool 😭", time:"3d ago", likes:51, liked:false},
    {id:1903,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"Bro saved my Maths paper with this one post. Grateful 🤝", time:"2d ago", likes:38, liked:false},
  ],
  20:[
    {id:2001,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"🤝 I needed this. Scoring 58% on mocks and feeling like giving up. Thank you Simran 💙", time:"4d ago", likes:178, liked:false},
    {id:2002,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"🤝 Cried after 61% mock last week. You're not alone. The bounce back is always worth it 💪", time:"4d ago", likes:134, liked:false},
    {id:2003,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"🤝 Day 34 here. Scored 49% today. Opened this post. Feel slightly less like quitting. Thank you.", time:"3d ago", likes:98, liked:false},
  ],
  21:[
    {id:2101,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"Got it right! Endosymbiont theory = mitochondria + chloroplast have their own DNA 🧬", time:"4d ago", likes:54, liked:false},
    {id:2102,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"I said C thinking 'mitochondria is membrane-bound' — the trap got me 😭 never again", time:"4d ago", likes:38, liked:false},
    {id:2103,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"NEET 2022 question!! You just saved me from losing 4 marks in 2026. Thank you 🙏", time:"3d ago", likes:29, liked:false},
  ],
  22:[
    {id:2201,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"C — got it right! The perpendicular force trick is so clean once you understand it", time:"4d ago", likes:49, liked:false},
    {id:2202,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"I said D thinking 'it depends on charge sign' — thank you for the explanation 😭", time:"4d ago", likes:33, liked:false},
    {id:2203,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"Work = F·d·cos90° = 0. So simple, so beautiful, so many people get it wrong 💀", time:"3d ago", likes:27, liked:false},
  ],
  23:[
    {id:2301,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"#6 is a legit NEET trap every year. Cornea = no blood supply. Saving this forever 📌", time:"5d ago", likes:112, liked:false},
    {id:2302,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"The banana DNA one ended me. 50% shared with a banana. My crisis is complete 🍌😭", time:"5d ago", likes:89, liked:false},
    {id:2303,studentId:9, name:"Tanvi Shah",    avatar:ALL_AVATARS[8],  text:"Neurons at 432 km/h but I still can't think fast enough in the exam hall 💀", time:"4d ago", likes:67, liked:false},
  ],
  24:[
    {id:2401,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"The photon taking 100,000 years to leave the Sun's core broke my brain 🤯", time:"5d ago", likes:89, liked:false},
    {id:2402,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"'Physics isn't hard, it's WEIRD' — this framing changed how I study it completely 🙏", time:"5d ago", likes:63, liked:false},
    {id:2403,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"Heisenberg uncertainty principle post would be amazing. Please make one!", time:"4d ago", likes:47, liked:false},
  ],
  25:[
    {id:2501,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"282 hours of JEE prep. That number is incredible. This is the post I needed today 🔥", time:"5d ago", likes:78, liked:false},
    {id:2502,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"Honest update from me: Day 21, avg 4.8 hrs/day = 100 hours. It's real. It's mine. 💪", time:"5d ago", likes:54, liked:false},
    {id:2503,studentId:15,name:"Meera Pillai",  avatar:ALL_AVATARS[14], text:"Day 104. Was targeting 14hrs. Averaging 9.2. Still way more than I ever did before prep. Progress is progress 🙏", time:"4d ago", likes:43, liked:false},
  ],
  26:[
    {id:2601,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"📥 (Also sharing with 3 friends in my study group right now. Legend move Kavya 💙)", time:"6d ago", likes:234, liked:false},
    {id:2602,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"📥 Day 21, can barely afford textbooks. This means everything. Thank you from the bottom of my heart 🙏", time:"6d ago", likes:187, liked:false},
    {id:2603,studentId:15,name:"Meera Pillai",  avatar:ALL_AVATARS[14], text:"📥 Downloaded AND shared with 5 students in my city who can't afford coaching. Kavya you're a hero 💙", time:"5d ago", likes:156, liked:false},
  ],
  27:[
    {id:2701,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"B — got it! The trick is: both statements can be true but R still doesn't explain A correctly 💡", time:"6d ago", likes:67, liked:false},
    {id:2702,studentId:9, name:"Tanvi Shah",    avatar:ALL_AVATARS[8],  text:"Assertion-Reason questions are free marks once you understand the format. This breakdown is perfect 🎯", time:"6d ago", likes:49, liked:false},
    {id:2703,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"I always panic on A-R questions. Bookmarking this logic pattern. Never losing these 4 marks again!", time:"5d ago", likes:38, liked:false},
  ],
  28:[
    {id:2801,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"4/5 — got the bleaching powder formula wrong 😭 Ca(OCl)Cl not CaOCl₂. Never again!", time:"1w ago", likes:54, liked:false},
    {id:2802,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"5/5 ✅ The Cu(NH₃)₄ deep blue one is a NEET classic. Good prep everyone!", time:"1w ago", likes:41, liked:false},
    {id:2803,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"3/5 😭 Need to go back to p-block elements. Thanks for the reality check!", time:"6d ago", likes:28, liked:false},
  ],
  29:[
    {id:2901,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"CAM plants open stomata at night — I knew this but never understood WHY until now. Thank you! 🌵", time:"1w ago", likes:58, liked:false},
    {id:2902,studentId:8, name:"Kavya Reddy",   avatar:ALL_AVATARS[7],  text:"Compensation point concept is underrated. Came in NEET 2021 and will come again 🎯", time:"1w ago", likes:43, liked:false},
    {id:2903,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"'Net gas exchange = ZERO at compensation point' — writing this on my wall 📌", time:"6d ago", likes:31, liked:false},
  ],
  30:[
    {id:3001,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"The cricket stadium explanation made Doppler click instantly. Finally! 🏏", time:"1w ago", likes:52, liked:false},
    {id:3002,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"Redshift = Doppler for light = universe expanding. Same physics, different scale. Mind = blown 🌌", time:"1w ago", likes:38, liked:false},
    {id:3003,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"The + for numerator when observer moves TOWARDS source trick is gold. Saving this!", time:"6d ago", likes:27, liked:false},
  ],
  31:[
    {id:3101,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"'I stopped memorising the formula and derived it from F=ma' — THIS is real physics 🔥", time:"1w ago", likes:89, liked:false},
    {id:3102,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"Day 34 here. Day 21 Arjun is going to be fine. I can feel it from this post 💪", time:"1w ago", likes:61, liked:false},
    {id:3103,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"sin2θ max at 2θ=90° so θ=45°. I've been told the answer a hundred times but never seen the WHY. Thank you! 💡", time:"6d ago", likes:47, liked:false},
  ],
  32:[
    {id:3201,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"'Failing a mock is data, not destiny' — best thing I've read all week 💙", time:"1w ago", likes:134, liked:false},
    {id:3202,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"Exceptions Notebook is REAL. I have one and it's saved me so many marks. Do it!", time:"1w ago", likes:98, liked:false},
    {id:3203,studentId:8, name:"Kavya Reddy",   avatar:ALL_AVATARS[7],  text:"Anhydrous CoCl₂ blue, hydrated pink — humidity indicator question comes every year! Good catch 🎯", time:"6d ago", likes:74, liked:false},
  ],
  33:[
    {id:3301,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"You SHIPPED IT! Zero to React in 6 weeks to NVIDIA submission is insane. Rooting for you 🚀", time:"1w ago", likes:112, liked:false},
    {id:3302,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"'Whether I win or not — I built something real' — this mindset is going to take you far 🔥", time:"1w ago", likes:89, liked:false},
    {id:3303,studentId:2, name:"Neha Gupta",    avatar:ALL_AVATARS[1],  text:"Top 10% of 312 students gets an interview. You've already won by shipping. Proud of you!", time:"6d ago", likes:67, liked:false},
  ],
  34:[
    {id:3401,studentId:3, name:"Ishaan Verma",  avatar:ALL_AVATARS[2],  text:"5/5 ✅ The water vapour greenhouse one is THE classic NEET trap. Caught me in 2023 mock!", time:"2w ago", likes:98, liked:false},
    {id:3402,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"4/5 — said CO₂ for greenhouse 😭 every single time. Printing this and putting it on my wall", time:"2w ago", likes:76, liked:false},
    {id:3403,studentId:9, name:"Tanvi Shah",    avatar:ALL_AVATARS[8],  text:"3/5 — ATP full form embarrassingly blanked on. That's what panic does 💀 practicing now!", time:"2w ago", likes:54, liked:false},
  ],
  35:[
    {id:3501,studentId:4, name:"Aarav Sharma",  avatar:ALL_AVATARS[3],  text:"i^i = real number = 0.2079 and I'm supposed to just accept this and move on? 🤯", time:"2w ago", likes:87, liked:false},
    {id:3502,studentId:6, name:"Rohan Desai",   avatar:ALL_AVATARS[5],  text:"Euler's formula is in JEE Complex Numbers syllabus and this shows exactly why it matters. Bookmarked! 📌", time:"2w ago", likes:64, liked:false},
    {id:3503,studentId:7, name:"Arjun Nair",    avatar:ALL_AVATARS[6],  text:"Mathematics is the most insane subject. Agreed 100%. This proof is beautiful 🤝", time:"2w ago", likes:48, liked:false},
  ],
  36:[
    {id:3601,studentId:8, name:"Kavya Reddy",   avatar:ALL_AVATARS[7],  text:"'NCERT read 4+ times' is not an exaggeration. It is literally the secret. Screenshot this everyone 📸", time:"2w ago", likes:156, liked:false},
    {id:3602,studentId:1, name:"Priya Menon",   avatar:ALL_AVATARS[0],  text:"'Most organisms' for DNA is the trap — viruses use RNA! One word difference = 4 marks 🔥", time:"2w ago", likes:112, liked:false},
    {id:3603,studentId:5, name:"Simran Kaur",   avatar:ALL_AVATARS[4],  text:"I'm on my 3rd NCERT read. Can confirm: noticing things I never saw before each time. Keep going everyone 💙", time:"2w ago", likes:87, liked:false},
  ],
};


// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({p,liked,setLiked,saved,toggleSave,reposted,toggleRepost,followed,toggleFollow,setCommentPost,setSharePost,postComments,sendCounts,addSend,onViewProfile}) {
  const s=STUDENTS.find(st=>st.id===p.studentId)||{};
  const isLiked=liked.includes(p._key);
  const isSaved=saved.includes(p._key);
  const isReposted=reposted.includes(p._key);
  const isFollowed=followed.includes(p.studentId);
  const allComments=[...(INIT_POST_COMMENTS[p.id]||[]),...(postComments[p.id]||[])];
  const likeCount=p.likes+(isLiked?1:0);
  const userAdded=(postComments[p.id]||[]).length;
  const commentCount=p.comments+userAdded;
  const saveCount=p.saves+(isSaved?1:0);
  const repostCount=(p.reposts||Math.floor(p.likes/8))+(isReposted?1:0);
  const sendCount=(p.sends||Math.floor(p.likes/12))+(sendCounts?.[p._key]||0);
  const fmtNum=n=>n>=1000?(n/1000).toFixed(1)+"K":n.toLocaleString();
  const MAX=160;
  const isLong=p.text.length>MAX;
  const [expanded,setExpanded]=useState(false);
  return (
    <div style={{background:"#fff",marginBottom:8,borderRadius:16,border:"1px solid #E8ECF2",boxShadow:"0 1px 6px rgba(15,28,63,.06)",overflow:"hidden",margin:"0 14px 8px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px 8px"}}>
        <div style={{cursor:"pointer",flexShrink:0}} onClick={()=>onViewProfile(p.studentId)}>
          <Av src={p.avatar} size={42} ring={STREAM[p.stream]?.color} online={p.studentId===1} verified={s.verified}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
            <div style={{cursor:"pointer",minWidth:0}} onClick={()=>onViewProfile(p.studentId)}>
              <div style={{fontWeight:700,fontSize:13,color:"var(--text)",display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                {p.name}{s.verified&&<span style={{color:"#0A9B6A",fontSize:12}}>✔</span>}
                <span style={{fontSize:11,color:"var(--muted)",fontWeight:400}}>· 2nd</span>
              </div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{p.subject}</div>
              <div style={{fontSize:10,color:"#bbb",marginTop:1}}>{p.time} · 🌐</div>
            </div>
            <button onClick={()=>toggleFollow(p.studentId)} style={{padding:"5px 14px",borderRadius:20,background:"none",border:isFollowed?"none":"1.5px solid var(--blue)",color:isFollowed?"var(--muted)":"var(--blue)",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {isFollowed?"Following":"+ Follow"}
            </button>
          </div>
        </div>
      </div>
      {/* Text */}
      <div style={{padding:"0 14px 8px"}}>
        <div style={{fontSize:13,lineHeight:1.65,color:"#1A1A2E"}}>
          {expanded||!isLong?p.text:p.text.slice(0,MAX)+"…"}
        </div>
        {isLong&&<button onClick={()=>setExpanded(e=>!e)} style={{background:"none",border:"none",padding:0,color:"var(--muted)",fontSize:13,fontWeight:600,cursor:"pointer",marginTop:2}}>{expanded?" show less":"...more"}</button>}
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:7}}>{p.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
      </div>
      {/* Image */}
      {p.imageUrl&&(
        <div style={{position:"relative"}}>
          <img src={p.imageUrl} alt="" style={{width:"100%",height:220,objectFit:"cover",display:"block"}}/>
          <div style={{position:"absolute",top:9,left:10,display:"flex",gap:5}}>
            {p.day&&<span style={{background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",color:"#FFD580",fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:50}}>🔥 {p.day}</span>}
            {p.hours>0&&<span style={{background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",color:"#6EE8B4",fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:50}}>⏱ {p.hours}h</span>}
          </div>
          {p.xp>0&&<div style={{position:"absolute",top:9,right:10}}><XPTag xp={p.xp}/></div>}
        </div>
      )}
      {/* Stats line */}
      <div style={{padding:"8px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{display:"flex"}}>
            {[0,1].map(i=><img key={i} src={STUDENTS[(p.studentId+i)%STUDENTS.length].avatar} width={18} height={18} alt="" style={{borderRadius:"50%",border:"1.5px solid #fff",marginLeft:i===0?0:-5,display:"block"}}/>)}
          </div>
          <span style={{fontSize:12,color:"#888"}}>{fmtNum(likeCount)} likes</span>
        </div>
        <div style={{display:"flex",gap:10,fontSize:12,color:"#888"}}>
          <button onClick={()=>setCommentPost(p)} style={{background:"none",border:"none",padding:0,color:"#888",fontSize:12,cursor:"pointer"}}>{fmtNum(commentCount)} comments</button>
          <span>·</span>
          <span>{fmtNum(repostCount)} reposts</span>
          <span>·</span>
          <span>{fmtNum(sendCount)} sends</span>
          <span>·</span>
          <span>{fmtNum(saveCount)} saves</span>
        </div>
      </div>
      {/* Action bar */}
      <div style={{display:"flex",borderTop:"1px solid #E8ECF2",margin:"6px 0 0",padding:"2px 0"}}>
        {/* Like */}
        <button onClick={()=>setLiked(l=>l.includes(p._key)?l.filter(x=>x!==p._key):[...l,p._key])} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",padding:"8px 4px",cursor:"pointer"}}>
          {isLiked?<svg width="18" height="18" viewBox="0 0 24 24" fill="#E0245E" stroke="#E0245E" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          :<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
          <span style={{fontSize:11,fontWeight:600,color:isLiked?"#E0245E":"#555"}}>Like</span>
        </button>
        {/* Comment */}
        <button onClick={()=>setCommentPost(p)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",padding:"8px 4px",cursor:"pointer"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span style={{fontSize:11,fontWeight:600,color:"#555"}}>Comment</span>
        </button>
        {/* Repost */}
        <button onClick={()=>toggleRepost(p._key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",padding:"8px 4px",cursor:"pointer"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isReposted?"#0A9B6A":"#555"} strokeWidth="1.8" strokeLinecap="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          <span style={{fontSize:11,fontWeight:600,color:isReposted?"#0A9B6A":"#555"}}>Repost</span>
        </button>
        {/* Send */}
        <button onClick={()=>{setSharePost(p);addSend&&addSend(p._key);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",padding:"8px 4px",cursor:"pointer"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span style={{fontSize:11,fontWeight:600,color:"#555"}}>Send</span>
        </button>
        {/* Save */}
        <button onClick={()=>toggleSave(p._key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",padding:"8px 4px",cursor:"pointer"}}>
          {isSaved?<svg width="18" height="18" viewBox="0 0 24 24" fill="#1A4FD6" stroke="#1A4FD6" strokeWidth="1.8" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          :<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>}
          <span style={{fontSize:11,fontWeight:600,color:isSaved?"#1A4FD6":"#555"}}>Save</span>
        </button>
      </div>
    </div>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
function Feed({onNav,user,notifs,notifCount,onMarkAllRead,challenges,submissions,onViewProfile,followed,onFollow,onPost}) {
  const [showNotifs,setShowNotifs]=useState(false);
  const [liked,setLiked]=useState([]);
  const [commentPost,setCommentPost]=useState(null);
  const [sharePost,setSharePost]=useState(null);
  const [postComments,setPostComments]=useState({});
  const [saved,setSaved]=useState([]);
  const [reposted,setReposted]=useState([]);
  const [sendCounts,setSendCounts]=useState({});
  const toggleSave=key=>setSaved(s=>s.includes(key)?s.filter(x=>x!==key):[...s,key]);
  const toggleRepost=key=>setReposted(s=>s.includes(key)?s.filter(x=>x!==key):[...s,key]);
  const addComment=(postId,c)=>setPostComments(p=>({...p,[postId]:[...(p[postId]||[]),c]}));
  const addSend=key=>setSendCounts(s=>({...s,[key]:(s[key]||0)+1}));
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
      <div style={{background:"rgba(255,255,255,.97)",padding:"12px 15px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",borderBottom:"1px solid var(--b1)"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#1A4FD6,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="20" height="12" viewBox="0 0 40 24" fill="none"><path d="M20 12C20 12 14 4 8 4C2 4 2 20 8 20C14 20 20 12 20 12Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M20 12C20 12 26 4 32 4C38 4 38 20 32 20C26 20 20 12 20 12Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg></div>
            <div>
              <div style={{fontSize:17,fontWeight:900,color:"var(--text)",letterSpacing:"-.03em",lineHeight:1}}>Infinity</div>
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:600,letterSpacing:".04em"}}>STUDY · BUILD · WIN</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>onNav("notifications")} style={{position:"relative",width:36,height:36,borderRadius:"50%",background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifCount>0&&<span style={{position:"absolute",top:6,right:6,width:9,height:9,background:"#EF4444",borderRadius:"50%",border:"1.5px solid var(--bg)"}}/>}
            </button>
            <button onClick={()=>onNav("chat")} style={{position:"relative",width:36,height:36,borderRadius:"50%",background:"#EEF2FF",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span style={{position:"absolute",top:6,right:6,width:9,height:9,background:"#1A4FD6",borderRadius:"50%",border:"1.5px solid var(--bg)"}}/>
            </button>
          </div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",paddingBottom:90}}>
        <div style={{padding:"10px 0 0"}}>
          {displayPosts.map(p=>(
            <PostCard key={p._key} p={p} liked={liked} setLiked={setLiked} saved={saved} toggleSave={toggleSave} reposted={reposted} toggleRepost={toggleRepost} followed={followed} toggleFollow={toggleFollow} setCommentPost={setCommentPost} setSharePost={setSharePost} postComments={postComments} sendCounts={sendCounts} addSend={addSend} onViewProfile={onViewProfile}/>
          ))}
          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} style={{height:60,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:24,height:24,borderRadius:"50%",border:"2.5px solid var(--b2)",borderTopColor:"var(--blue)",animation:"spin .7s linear infinite"}}/>
          </div>
        </div>
      </div>
      {commentPost&&<CommentDrawer post={commentPost} onClose={()=>setCommentPost(null)} onAddComment={addComment} currentUser={user} extraComments={postComments[commentPost.id]||[]} liked={liked} setLiked={setLiked}/>}
      {sharePost&&<ShareSheet post={sharePost} onClose={()=>setSharePost(null)}/>}
      <BottomNav onNav={k=>k==="profile"?onViewProfile(user.id):onNav(k)} active="feed" notifCount={notifCount} user={user} onPost={onPost} />
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [screen,setScreen]=useState("login");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [name,setName]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [agreed,setAgreed]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const handleGoogle=async()=>{
    setLoading(true); setError("");
    try {
      const result=await signInWithPopup(auth,googleProvider);
      const u=result.user;
      const ref=doc(db,"users",u.uid);
      const snap=await getDoc(ref);
      if(!snap.exists()) await setDoc(ref,{uid:u.uid,name:u.displayName,email:u.email,avatar:u.photoURL,createdAt:serverTimestamp(),streak:0,xp:0});
      onLogin(u);
    } catch(e){ setError("Google sign-in failed. Try again."); }
    setLoading(false);
  };

  const handleEmailLogin=async()=>{
    if(!email.trim()||!pw.trim()){setError("Please enter email and password.");return;}
    setLoading(true); setError("");
    try {
      const {signInWithEmailAndPassword}=await import("firebase/auth");
      await signInWithEmailAndPassword(auth,email,pw);
      onLogin({email});
    } catch(e){ setError(e.code==="auth/invalid-credential"?"Wrong email or password.":"Login failed. Try again."); }
    setLoading(false);
  };

  const handleEmailSignup=async()=>{
    if(!name.trim()||!email.trim()||!pw.trim()){setError("Please fill all fields.");return;}
    if(!agreed){setError("Please agree to the Terms of Service.");return;}
    if(pw.length<6){setError("Password must be at least 6 characters.");return;}
    setLoading(true); setError("");
    try {
      const {createUserWithEmailAndPassword,updateProfile}=await import("firebase/auth");
      const result=await createUserWithEmailAndPassword(auth,email,pw);
      await updateProfile(result.user,{displayName:name});
      const ref=doc(db,"users",result.user.uid);
      await setDoc(ref,{uid:result.user.uid,name,email,avatar:null,createdAt:serverTimestamp(),streak:0,xp:0});
      onLogin(result.user);
    } catch(e){ setError(e.code==="auth/email-already-in-use"?"Email already registered. Sign in instead.":"Signup failed. Try again."); }
    setLoading(false);
  };

  const inputStyle={width:"100%",padding:"13px 14px",borderRadius:12,border:"1.5px solid #E4EAF6",fontSize:13,color:"#1A1A2E",outline:"none",background:"#F8FAFD",boxSizing:"border-box",fontFamily:"inherit"};

  const Wrapper=({children})=>(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#EFF4FB,#E8EDFB)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"52px 20px 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        {screen==="signup"&&<button onClick={()=>{setScreen("login");setError("");}} style={{position:"absolute",left:20,width:34,height:34,borderRadius:"50%",background:"#fff",border:"1px solid #E0E8F4",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>}
        <div style={{fontSize:18,fontWeight:900,color:"#1A4FD6",letterSpacing:"-.02em",display:"flex",alignItems:"center",gap:8}}>
          <svg width="24" height="14" viewBox="0 0 60 34" fill="none"><path d="M30 17C30 17 20 4 10 4C2 4 2 30 10 30C20 30 30 17 30 17Z" stroke="#1A4FD6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 17C30 17 40 4 50 4C58 4 58 30 50 30C40 30 30 17 30 17Z" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Infinity
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"20px 20px 40px"}}>
        <div style={{background:"#fff",borderRadius:24,padding:"28px 24px",boxShadow:"0 4px 24px rgba(15,28,63,.08)"}}>
          {children}
        </div>
      </div>
    </div>
  );

  const GoogleBtn=()=>(
    <button onClick={handleGoogle} disabled={loading} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,width:"100%",padding:"13px",background:loading?"#f5f5f5":"#fff",border:"1.5px solid #E4EAF6",borderRadius:50,fontSize:14,fontWeight:700,color:"#1A1A2E",cursor:loading?"not-allowed":"pointer",boxShadow:"0 2px 8px rgba(15,28,63,.07)",transition:"all .2s"}}>
      <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      {loading?"Signing in...":"Continue with Google"}
    </button>
  );

  const Divider=()=>(
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0"}}>
      <div style={{flex:1,height:1,background:"#EEF2FB"}}/>
      <span style={{fontSize:12,color:"#bbb",fontWeight:500}}>or</span>
      <div style={{flex:1,height:1,background:"#EEF2FB"}}/>
    </div>
  );

  if(screen==="login") return (
    <Wrapper>
      <div style={{fontSize:22,fontWeight:900,color:"#1A1A2E",marginBottom:4,textAlign:"center"}}>Welcome back 👋</div>
      <div style={{fontSize:13,color:"#aaa",textAlign:"center",marginBottom:22}}>Sign in to continue your journey</div>

      <GoogleBtn/>
      <Divider/>

      {error&&<div style={{background:"#FFF0F0",border:"1px solid #FFCDD2",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#C62828",marginBottom:14,textAlign:"center"}}>{error}</div>}

      <div style={{marginBottom:12}}>
        <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>Email</label>
        <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleEmailLogin()}/>
      </div>
      <div style={{marginBottom:10}}>
        <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>Password</label>
        <div style={{position:"relative"}}>
          <input style={{...inputStyle,paddingRight:44}} type={showPw?"text":"password"} placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleEmailLogin()}/>
          <button onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16,padding:0}}>{showPw?"👁":"🙈"}</button>
        </div>
      </div>
      <div style={{textAlign:"right",marginBottom:20}}>
        <span style={{fontSize:12,color:"#1A4FD6",fontWeight:600,cursor:"pointer"}}>Forgot password?</span>
      </div>
      <button onClick={handleEmailLogin} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:50,background:loading?"#9BB4E8":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",boxShadow:"0 4px 20px rgba(26,79,214,.35)"}}>
        {loading?"Signing in...":"Sign In"}
      </button>
      <div style={{textAlign:"center",marginTop:18,fontSize:12,color:"#aaa"}}>
        Don't have an account? <span onClick={()=>{setScreen("signup");setError("");}} style={{color:"#1A4FD6",fontWeight:700,cursor:"pointer"}}>Sign up</span>
      </div>
    </Wrapper>
  );

  return (
    <Wrapper>
      <div style={{fontSize:22,fontWeight:900,color:"#1A1A2E",marginBottom:4,textAlign:"center"}}>Create Account 🚀</div>
      <div style={{fontSize:13,color:"#aaa",textAlign:"center",marginBottom:22}}>Join 12,000+ students on Infinity</div>

      <GoogleBtn/>
      <Divider/>

      {error&&<div style={{background:"#FFF0F0",border:"1px solid #FFCDD2",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#C62828",marginBottom:14,textAlign:"center"}}>{error}</div>}

      <div style={{marginBottom:12}}>
        <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>Full Name</label>
        <input style={inputStyle} type="text" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>Email</label>
        <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:12,fontWeight:600,color:"#555",display:"block",marginBottom:5}}>Password <span style={{color:"#bbb",fontWeight:400}}>(min 6 chars)</span></label>
        <div style={{position:"relative"}}>
          <input style={{...inputStyle,paddingRight:44}} type={showPw?"text":"password"} placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)}/>
          <button onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16,padding:0}}>{showPw?"👁":"🙈"}</button>
        </div>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#888",marginBottom:20,cursor:"pointer"}}>
        <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{accentColor:"#1A4FD6",width:14,height:14}}/>
        I agree to the <span style={{color:"#1A4FD6",fontWeight:600}}>Terms of Service</span>
      </label>
      <button onClick={handleEmailSignup} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:50,background:loading?"#9BB4E8":"linear-gradient(135deg,#1A4FD6,#3B5CE8)",border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",boxShadow:"0 4px 20px rgba(26,79,214,.35)"}}>
        {loading?"Creating account...":"Create Account"}
      </button>
      <div style={{textAlign:"center",marginTop:18,fontSize:12,color:"#aaa"}}>
        Already have an account? <span onClick={()=>{setScreen("login");setError("");}} style={{color:"#1A4FD6",fontWeight:700,cursor:"pointer"}}>Sign in</span>
      </div>
    </Wrapper>
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
  const [showCreate,setShowCreate]=useState(false);
  const toggleFollow=id=>setFollowed(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);

  const pushToast=(toast)=>toastBus.emit(toast);

  const addNotif=(notif)=>toastBus.emit(notif);

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

  // Live notifications disabled

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

  const shared={onNav:navigate,user,notifs,notifCount:unread,submissions,challenges:CHALLENGES,onMarkAllRead:markAllRead,onVoteSubmission:voteSubmission,onCommentSubmission:commentOnSubmission,onViewProfile:setViewStudentId,followed,onFollow:toggleFollow,onPost:()=>setShowCreate(true)};

  if(activeChallenge) return (
    <><ChallengeDetail c={activeChallenge} onBack={()=>setActiveChallenge(null)} user={user} submissions={submissions} onVoteSubmission={voteSubmission} onCommentSubmission={commentOnSubmission} onSubmitChallenge={submitChallenge}/></>
  );

  const pages={
    login:                ()=><Login onLogin={()=>navigate("feed")}/>,
    feed:                 ()=><Feed {...shared}/>,
    battle:               ()=><DailyBattle {...shared}/>,
    challenges:           ()=><Challenges {...shared} onOpenChallenge={setActiveChallenge}/>,
    discover:             ()=><Discover {...shared} onViewProfile={setViewStudentId}/>,
    notifications:        ()=><NotificationsPage {...shared}/>,
    chat:                 ()=><ChatList {...shared}/>,
    profile:              ()=><Profile {...shared} history={history}/>,
    "challenge-portfolio":()=><ChallengePortfolio onBack={()=>navigate("profile")} user={user} history={history}/>,
  };

  const Page=pages[page]||pages["login"];
  return <ErrorBoundary>
    <Page/>
    {viewStudentId!=null&&<StudentProfile studentId={viewStudentId} onBack={()=>setViewStudentId(null)} onFollow={toggleFollow} followed={followed}/>}
    {showCreate&&<CreatePost user={user} onClose={()=>setShowCreate(false)} onSubmit={()=>setShowCreate(false)}/>}
    <ToastStack/>
  </ErrorBoundary>;
}
