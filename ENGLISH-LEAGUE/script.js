import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArZhI2_NjY9AU366tH133vBzVkVtX-7Uo",
  authDomain: "english-league-8584f.firebaseapp.com",
  projectId: "english-league-8584f",
  storageBucket: "english-league-8584f.firebasestorage.app",
  messagingSenderId: "613009575801",
  appId: "1:613009575801:web:bebd40e482975e495a29a8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let firebaseDataLoaded = false;

let teams = [
  // Group A
  { id: "arsenal", name: "Arsenal", group: "A" },
  { id: "chelsea", name: "Chelsea", group: "A" },
  { id: "liverpool", name: "Liverpool", group: "A" },
  { id: "tottenham", name: "Tottenham", group: "A" },
  { id: "everton", name: "Everton", group: "A" },

  // Group B
  { id: "mancity", name: "Man City", group: "B" },
  { id: "manutd", name: "Man United", group: "B" },
  { id: "newcastle", name: "Newcastle", group: "B" },
  { id: "astonvilla", name: "Aston Villa", group: "B" },
  { id: "westham", name: "West Ham", group: "B" },

  // Group C
  { id: "brighton", name: "Brighton", group: "C" },
  { id: "wolves", name: "Wolves", group: "C" },
  { id: "fulham", name: "Fulham", group: "C" },
  { id: "palace", name: "Crystal Palace", group: "C" },
  { id: "brentford", name: "Brentford", group: "C" },

  // Group D
  { id: "leicester", name: "Leicester", group: "D" },
  { id: "forest", name: "Nottingham Forest", group: "D" },
  { id: "bournemouth", name: "Bournemouth", group: "D" },
  { id: "burnley", name: "Burnley", group: "D" },
  { id: "leeds", name: "Leeds United", group: "D" }
];
teams.forEach((team) => {
  if (!team.coach) {
    team.coach = `مدرب ${team.name}`;
  }
});

let players = [
  { id: "p1", name: "حيدر سعد", teamId: "arsenal" },
  { id: "p2", name: "حسن كريم", teamId: "arsenal" },
  { id: "p3", name: "منتظر عادل", teamId: "chelsea" },
  { id: "p4", name: "كرار أحمد", teamId: "liverpool" },
  { id: "p5", name: "مرتضى صالح", teamId: "mancity" },
  { id: "p6", name: "نوري", teamId: "manutd" },
  { id: "p7", name: "عباس فاضل", teamId: "brighton" },
  { id: "p8", name: "سجاد ناصر", teamId: "leicester" }
];

let matches = [
  {
    id: "m1",
    stage: "group",
    group: "A",
    homeTeamId: "arsenal",
    awayTeamId: "chelsea",
    date: "2026-06-01",
    time: "08:00",
    stadium: "ملعب قصي منير",
    status: "finished",
    homeScore: 3,
    awayScore: 1,
    events: [
      { type: "goal", playerId: "p1", teamId: "arsenal" },
      { type: "goal", playerId: "p1", teamId: "arsenal" },
      { type: "goal", playerId: "p2", teamId: "arsenal" },
      { type: "goal", playerId: "p3", teamId: "chelsea" },
      { type: "yellow", playerId: "p3", teamId: "chelsea" }
    ],
    manOfTheMatchId: "p1"
  },
  {
    id: "m2",
    stage: "group",
    group: "A",
    homeTeamId: "liverpool",
    awayTeamId: "tottenham",
    date: "2026-06-01",
    time: "09:00",
    stadium: "ملعب قصي منير",
    status: "finished",
    homeScore: 2,
    awayScore: 2,
    events: [
      { type: "goal", playerId: "p4", teamId: "liverpool" },
      { type: "goal", playerId: "p4", teamId: "liverpool" },
      { type: "yellow", playerId: "p4", teamId: "liverpool" }
    ],
    manOfTheMatchId: "p4"
  },
  {
    id: "m3",
    stage: "group",
    group: "B",
    homeTeamId: "mancity",
    awayTeamId: "manutd",
    date: "2026-06-02",
    time: "08:30",
   stadium: "ملعب قصي منير",
    status: "finished",
    homeScore: 1,
    awayScore: 2,
    events: [
      { type: "goal", playerId: "p5", teamId: "mancity" },
      { type: "goal", playerId: "p6", teamId: "manutd" },
      { type: "goal", playerId: "p6", teamId: "manutd" },
      { type: "red", playerId: "p5", teamId: "mancity" }
    ],
    manOfTheMatchId: "p6"
  },
  {
    id: "m4",
    stage: "group",
    group: "C",
    homeTeamId: "brighton",
    awayTeamId: "wolves",
    date: "2026-06-03",
    time: "07:30",
    stadium: "ملعب قصي منير",
    status: "today",
    homeScore: null,
    awayScore: null,
    events: [],
    manOfTheMatchId: null
  },
  {
    id: "m5",
    stage: "group",
    group: "D",
    homeTeamId: "leicester",
    awayTeamId: "forest",
    date: "2026-06-04",
    time: "08:00",
stadium: "ملعب قصي منير",
    status: "upcoming",
    homeScore: null,
    awayScore: null,
    events: [],
    manOfTheMatchId: null
  }
  ,
{
  id: "qf1",
  stage: "quarter",
  bracketSlot: "QF1",
  group: null,
  homeTeamId: "arsenal",
  awayTeamId: "mancity",
  date: "2026-06-10",
  time: "08:00",
  status: "finished",
  homeScore: 2,
  awayScore: 1,
  events: [
    { type: "goal", playerId: "p1", teamId: "arsenal" },
    { type: "goal", playerId: "p2", teamId: "arsenal" },
    { type: "goal", playerId: "p5", teamId: "mancity" }
  ],
  manOfTheMatchId: "p1"
},
{
  id: "qf2",
  stage: "quarter",
  bracketSlot: "QF2",
  group: null,
  homeTeamId: "manutd",
  awayTeamId: "liverpool",
  date: "2026-06-10",
  time: "09:00",
  status: "finished",
  homeScore: 3,
  awayScore: 2,
  events: [
    { type: "goal", playerId: "p6", teamId: "manutd" },
    { type: "goal", playerId: "p6", teamId: "manutd" },
    { type: "goal", playerId: "p6", teamId: "manutd" },
    { type: "goal", playerId: "p4", teamId: "liverpool" },
    { type: "goal", playerId: "p4", teamId: "liverpool" }
  ],
  manOfTheMatchId: "p6"
},
{
  id: "qf3",
  stage: "quarter",
  bracketSlot: "QF3",
  group: null,
  homeTeamId: "brighton",
  awayTeamId: "forest",
  date: "2026-06-11",
  time: "08:00",
  status: "finished",
  homeScore: 1,
  awayScore: 0,
  events: [
    { type: "goal", playerId: "p7", teamId: "brighton" }
  ],
  manOfTheMatchId: "p7"
},
{
  id: "qf4",
  stage: "quarter",
  bracketSlot: "QF4",
  group: null,
  homeTeamId: "leicester",
  awayTeamId: "wolves",
  date: "2026-06-11",
  time: "09:00",
  status: "finished",
  homeScore: 0,
  awayScore: 2,
  events: [
    { type: "goal", playerId: "p8", teamId: "leicester" }
  ],
  manOfTheMatchId: null
},
{
  id: "sf1",
  stage: "semi",
  bracketSlot: "SF1",
  group: null,
  homeTeamId: "arsenal",
  awayTeamId: "manutd",
  date: "2026-06-14",
  time: "08:30",
  status: "finished",
  homeScore: 1,
  awayScore: 2,
  events: [
    { type: "goal", playerId: "p1", teamId: "arsenal" },
    { type: "goal", playerId: "p6", teamId: "manutd" },
    { type: "goal", playerId: "p6", teamId: "manutd" }
  ],
  manOfTheMatchId: "p6"
},
{
  id: "sf2",
  stage: "semi",
  bracketSlot: "SF2",
  group: null,
  homeTeamId: "brighton",
  awayTeamId: "wolves",
  date: "2026-06-14",
  time: "09:30",
  status: "upcoming",
  homeScore: null,
  awayScore: null,
  events: [],
  manOfTheMatchId: null
},
{
  id: "final",
  stage: "final",
  bracketSlot: "FINAL",
  group: null,
  homeTeamId: "manutd",
  awayTeamId: "brighton",
  date: "2026-06-18",
  time: "09:00",
  status: "upcoming",
  homeScore: null,
  awayScore: null,
  events: [],
  manOfTheMatchId: null
}
];

let lineups = [
  {
    matchId: "m1",
    teamId: "arsenal",
    starters: [
      { playerId: "p1", position: "حارس" },
      { playerId: "p2", position: "مدافع" },
      { playerId: "arsenal_player_3", position: "مدافع" },
      { playerId: "arsenal_player_4", position: "مدافع" },
      { playerId: "arsenal_player_5", position: "وسط" },
      { playerId: "arsenal_player_6", position: "وسط" },
      { playerId: "arsenal_player_7", position: "مهاجم" },
      { playerId: "arsenal_player_8", position: "مهاجم" }
    ],
    substitutes: [
      { playerId: "arsenal_player_6", position: "وسط" },
      { playerId: "arsenal_player_7", position: "مهاجم" }
    ]
  },
  {
    matchId: "m1",
    teamId: "chelsea",
    starters: [
      { playerId: "p3", position: "حارس" },
      { playerId: "chelsea_player_2", position: "مدافع" },
      { playerId: "chelsea_player_3", position: "مدافع" },
      { playerId: "chelsea_player_4", position: "وسط" },
      { playerId: "chelsea_player_5", position: "وسط" },
      { playerId: "chelsea_player_6", position: "وسط" },
      { playerId: "chelsea_player_7", position: "مهاجم" },
      { playerId: "chelsea_player_8", position: "مهاجم" }
    ],
    substitutes: [
      { playerId: "chelsea_player_6", position: "وسط" },
      { playerId: "chelsea_player_7", position: "مهاجم" }
    ]
  },

  {
    matchId: "m4",
    teamId: "brighton",
    starters: [
      { playerId: "p7", position: "حارس" },
      { playerId: "brighton_player_2", position: "مدافع" },
      { playerId: "brighton_player_3", position: "مدافع" },
      { playerId: "brighton_player_4", position: "مدافع" },
      { playerId: "brighton_player_5", position: "وسط" },
      { playerId: "brighton_player_6", position: "وسط" },
      { playerId: "brighton_player_7", position: "مهاجم" },
      { playerId: "brighton_player_8", position: "مهاجم" }
    ],
    substitutes: [
      { playerId: "brighton_player_6", position: "وسط" }
    ]
  },
  {
    matchId: "m4",
    teamId: "wolves",
    starters: [
      { playerId: "wolves_player_1", position: "حارس" },
      { playerId: "wolves_player_2", position: "مدافع" },
      { playerId: "wolves_player_3", position: "مدافع" },
      { playerId: "wolves_player_4", position: "وسط" },
      { playerId: "wolves_player_5", position: "وسط" },
      { playerId: "wolves_player_6", position: "وسط" },
      { playerId: "wolves_player_7", position: "مهاجم" },
      { playerId: "wolves_player_8", position: "مهاجم" }
    ],
    substitutes: [
      { playerId: "wolves_player_6", position: "وسط" }
    ]
  }
];

const groups = ["A", "B", "C", "D"];

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupTabs();
  setupFilters();
  setupPlayersControls();
  exposePublicFunctionsToWindow();

  listenToPublicFirebaseData();
});

function listenToPublicFirebaseData() {
  let teamsLoaded = false;
  let playersLoaded = false;
  let matchesLoaded = false;
  let lineupsLoaded = false;

  let firebaseTeams = [];
  let firebasePlayers = [];
  let firebaseMatches = [];
  let firebaseLineups = [];

  onSnapshot(
    collection(db, "teams"),
    (snapshot) => {
      firebaseTeams = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      teamsLoaded = true;
      applyFirebaseDataIfReady();
    },
    (error) => {
      console.error("خطأ تحميل الفرق:", error);
    }
  );

  onSnapshot(
    collection(db, "players"),
    (snapshot) => {
      firebasePlayers = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      playersLoaded = true;
      applyFirebaseDataIfReady();
    },
    (error) => {
      console.error("خطأ تحميل اللاعبين:", error);
    }
  );

  onSnapshot(
    collection(db, "matches"),
    (snapshot) => {
      firebaseMatches = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          stage: data.stage || "group",
          group: data.group || null,
          bracketSlot: data.bracketSlot || "",
          homeTeamId: data.homeTeamId || "",
          awayTeamId: data.awayTeamId || "",
          date: data.date || "",
          time: data.time || "",
          stadium: data.stadium || "ملعب البطولة",
          status: data.status || "upcoming",
          homeScore: data.homeScore ?? null,
          awayScore: data.awayScore ?? null,
          events: Array.isArray(data.events) ? data.events : [],
          manOfTheMatchId: data.manOfTheMatchId || null,
          manOfTheMatchName: data.manOfTheMatchName || ""
        };
      });

      matchesLoaded = true;
      applyFirebaseDataIfReady();
    },
    (error) => {
      console.error("خطأ تحميل المباريات:", error);
    }
  );

  onSnapshot(
    collection(db, "lineups"),
    (snapshot) => {
      firebaseLineups = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          ...data,
          starters: Array.isArray(data.starters) ? data.starters : [],
          substitutes: Array.isArray(data.substitutes) ? data.substitutes : []
        };
      });

      lineupsLoaded = true;
      applyFirebaseDataIfReady();
    },
    (error) => {
      console.error("خطأ تحميل التشكيلات:", error);
    }
  );

  function applyFirebaseDataIfReady() {
    if (!teamsLoaded || !playersLoaded || !matchesLoaded || !lineupsLoaded) {
      return;
    }

    const hasRealData =
      firebaseTeams.length ||
      firebasePlayers.length ||
      firebaseMatches.length ||
      firebaseLineups.length;

    if (!hasRealData) {
      firebaseDataLoaded = false;
      ensureDemoPlayers();
      renderAllPublicSections();
      return;
    }

    teams = firebaseTeams.sort((a, b) => {
      if ((a.group || "") !== (b.group || "")) {
        return String(a.group || "").localeCompare(String(b.group || ""));
      }

      return String(a.name || "").localeCompare(String(b.name || ""));
    });

    players = firebasePlayers.sort((a, b) => {
      return String(a.name || "").localeCompare(String(b.name || ""), "ar");
    });

    matches = firebaseMatches.sort((a, b) => {
      return String(a.date || "").localeCompare(String(b.date || ""));
    });

    lineups = firebaseLineups;

    firebaseDataLoaded = true;

    refreshPlayersFilterOptions();
    renderAllPublicSections();
  }
}

function renderAllPublicSections() {
  renderHome();
  renderGroups();
  renderMatches("all");
  renderBracket();
  renderStats();
  renderTeams();
  renderPlayers();
}

function refreshPlayersFilterOptions() {
  const teamFilter = document.getElementById("teamFilter");

  if (!teamFilter) return;

  const currentValue = teamFilter.value || "all";

  teamFilter.innerHTML = `
    <option value="all">كل الفرق</option>
    ${teams
      .map(
        (team) => `
          <option value="${team.id}">${team.name}</option>
        `
      )
      .join("")}
  `;

  teamFilter.value = teams.some((team) => team.id === currentValue)
    ? currentValue
    : "all";
}

function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".section");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.section;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      sections.forEach((section) => section.classList.remove("active-section"));

      button.classList.add("active");
      document.getElementById(target).classList.add("active-section");
    });
  });

  document.querySelectorAll("[data-section-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.sectionJump;
      document.querySelector(`.tab-btn[data-section="${target}"]`).click();
    });
  });
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      renderMatches(button.dataset.filter);
    });
  });
}

function getTeam(teamId) {
  return teams.find((team) => team.id === teamId);
}

function getPlayer(playerId) {
  return players.find((player) => player.id === playerId);
}

function getStatusText(status) {
  if (status === "finished") return "منتهية";
  if (status === "today") return "اليوم";
  return "قادمة";
}

function renderHome() {
  const teamsCount = document.getElementById("homeTeamsCount");
  const matchesCount = document.getElementById("homeMatchesCount");

  if (teamsCount) teamsCount.textContent = teams.length;
  if (matchesCount) matchesCount.textContent = matches.length;

  renderHomeFeaturedMatch();
  renderHomeLatestResult();
  renderHomeNextMatch();
  renderHomeQualifiedTeams();
  renderHomeTopScorers();
}

function renderHomeFeaturedMatch() {
  const container = document.getElementById("homeFeaturedMatch");

  if (!container) return;

  const todayMatch = matches.find((match) => match.status === "today");
  const nextMatch = getNextUpcomingMatch();
  const latestResult = getLatestFinishedMatch();

  const featured = todayMatch || nextMatch || latestResult;

  if (!featured) {
    container.innerHTML = `<div class="empty-state">لا توجد مباريات لعرضها</div>`;
    return;
  }

  container.innerHTML = createHomeMatchShowcase(featured);
}

function renderHomeLatestResult() {
  const container = document.getElementById("homeLatestResult");

  if (!container) return;

  const latest = getLatestFinishedMatch();

  container.innerHTML = latest
    ? createHomeCompactMatch(latest)
    : `<div class="empty-state">لا توجد نتائج بعد</div>`;
}

function renderHomeNextMatch() {
  const container = document.getElementById("homeNextMatch");

  if (!container) return;

  const next = getNextUpcomingMatch();

  container.innerHTML = next
    ? createHomeCompactMatch(next)
    : `<div class="empty-state">لا توجد مباريات قادمة</div>`;
}

function renderHomeQualifiedTeams() {
  const container = document.getElementById("homeQualifiedTeams");

  if (!container) return;

  const qualified = getQualifiedTeams();

  const list = groups.flatMap((groupName) => {
    const first = qualified[`${groupName}1`];
    const second = qualified[`${groupName}2`];

    return [
      first ? { ...first, groupName, rank: 1 } : null,
      second ? { ...second, groupName, rank: 2 } : null
    ];
  }).filter(Boolean);

  container.innerHTML = list.length
    ? list
        .map((item) => {
          return `
            <div class="home-qualified-row" onclick="openTeamModal('${item.teamId}')">
              <div class="home-qualified-rank">${item.groupName}${item.rank}</div>

              <div class="home-qualified-info">
                <strong>${item.teamName}</strong>
                <span>المجموعة ${item.groupName}</span>
              </div>

              <div class="home-qualified-points">
                ${item.points} ن
              </div>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-state">لم تتحدد الفرق المتأهلة بعد</div>`;
}

function renderHomeTopScorers() {
  const container = document.getElementById("homeTopScorers");

  if (!container) return;

  const scorers = getTopScorersData().slice(0, 5);

  container.innerHTML = scorers.length
    ? scorers
        .map((player, index) => {
          return `
            <div class="home-scorer-row" onclick="openPlayerModal('${player.playerId}')">
              <div class="home-scorer-rank">${index + 1}</div>

              <div class="home-scorer-info">
                <strong>${player.playerName}</strong>
                <span>${player.teamName}</span>
              </div>

              <div class="home-scorer-goals">
                ${player.count} هدف
              </div>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-state">لا توجد أهداف بعد</div>`;
}

function createHomeMatchShowcase(match) {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  const score =
    match.status === "finished"
      ? `${match.homeScore} - ${match.awayScore}`
      : match.time;

  const label =
    match.stage === "group"
      ? `المجموعة ${match.group}`
      : getStageText(match.stage);

  return `
    <div class="home-match-showcase" onclick="openMatchModal('${match.id}')">
      <div class="home-match-meta">
        <span>${label}</span>
        <span class="home-match-date">${match.date} • ${getStatusText(match.status)}</span>
      </div>

      <div class="home-match-teams">
        <div class="home-team-unit">
          <div class="home-team-logo">${getTeamShortName(homeTeam.name)}</div>
          <strong>${homeTeam.name}</strong>
        </div>

        <div class="home-score-big">${score}</div>

        <div class="home-team-unit">
          <div class="home-team-logo">${getTeamShortName(awayTeam.name)}</div>
          <strong>${awayTeam.name}</strong>
        </div>
      </div>

      <div class="home-match-hint">
        <span>↗ اضغط لعرض التفاصيل</span>
      </div>
    </div>
  `;
}

function createHomeCompactMatch(match) {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  const score =
    match.status === "finished"
      ? `${match.homeScore} - ${match.awayScore}`
      : match.time;

  const label =
    match.stage === "group"
      ? `المجموعة ${match.group}`
      : getStageText(match.stage);

  return `
    <div class="home-compact-match" onclick="openMatchModal('${match.id}')">
      <div class="home-compact-top">
        <span>${label}</span>
        <span>${match.date}</span>
      </div>

      <div class="home-compact-score">
        <span>${homeTeam ? homeTeam.name : "غير معروف"}</span>
        <b>${score}</b>
        <span>${awayTeam ? awayTeam.name : "غير معروف"}</span>
      </div>
    </div>
  `;
}

function getLatestFinishedMatch() {
  const finished = matches.filter((match) => match.status === "finished");

  if (!finished.length) return null;

  return finished[finished.length - 1];
}

function getNextUpcomingMatch() {
  const upcoming = matches.filter(
    (match) => match.status === "today" || match.status === "upcoming"
  );

  if (!upcoming.length) return null;

  return upcoming[0];
}

function calculateGroupStandings(groupName) {
  const groupTeams = teams.filter((team) => team.group === groupName);

  const standings = groupTeams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    played: 0,
    won: 0,
    draw: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  }));

  const groupMatches = matches.filter(
    (match) =>
      match.stage === "group" &&
      match.group === groupName &&
      match.status === "finished"
  );

  groupMatches.forEach((match) => {
    const home = standings.find((row) => row.teamId === match.homeTeamId);
    const away = standings.find((row) => row.teamId === match.awayTeamId);

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;

    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += 3;

      away.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      away.points += 3;

      home.lost += 1;
    } else {
      home.draw += 1;
      away.draw += 1;

      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

function renderGroups() {
  const container = document.getElementById("groupsContainer");

  container.innerHTML = groups
    .map((groupName) => {
      const standings = calculateGroupStandings(groupName);

      return `
        <div class="group-card">
          <div class="group-header">
            <h3>المجموعة ${groupName}</h3>
            <span>Top 2</span>
          </div>

          <div class="table-scroll">
            <table class="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الفريق</th>
                  <th>لعب</th>
                  <th>فاز</th>
                  <th>تعادل</th>
                  <th>خسر</th>
                  <th>له</th>
                  <th>عليه</th>
                  <th>فرق</th>
                  <th>نقاط</th>
                </tr>
              </thead>
              <tbody>
                ${standings
                  .map((row, index) => {
                    const isQualified = index < 2;

                    return `
                      <tr>
                        <td>
                          <span class="rank ${isQualified ? "qualified" : ""}">
                            ${index + 1}
                          </span>
                        </td>
                        <td class="team-name">${row.teamName}</td>
                        <td>${row.played}</td>
                        <td>${row.won}</td>
                        <td>${row.draw}</td>
                        <td>${row.lost}</td>
                        <td>${row.goalsFor}</td>
                        <td>${row.goalsAgainst}</td>
                        <td>${row.goalDifference}</td>
                        <td><strong>${row.points}</strong></td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderMatches(filter) {
  const container = document.getElementById("matchesContainer");

  const filteredMatches =
    filter === "all"
      ? matches
      : matches.filter((match) => match.status === filter);

  container.innerHTML =
    filteredMatches.length > 0
      ? filteredMatches.map(createMatchCard).join("")
      : `<div class="empty-state">لا توجد مباريات بهذا التصنيف</div>`;
}

function createMatchCard(match) {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  if (!homeTeam || !awayTeam) {
    return `
      <div class="match-card pro-match-card">
        <div class="empty-state">مباراة تحتوي على فريق غير موجود</div>
      </div>
    `;
  }

  const score =
    match.status === "finished"
      ? `${match.homeScore} - ${match.awayScore}`
      : match.time;

  const label =
    match.stage === "group"
      ? `المجموعة ${match.group}`
      : getStageText(match.stage);

  const statusText = getStatusText(match.status);

  return `
    <div class="match-card pro-match-card" onclick="openMatchModal('${match.id}')">
      <div class="pro-match-glow"></div>

      <div class="pro-match-top">
        <div>
          <span class="pro-match-stage">${label}</span>
          <span class="pro-match-date">${match.date}</span>
        </div>

        <span class="status-badge status-${match.status}">
          ${statusText}
        </span>
      </div>

      <div class="pro-match-body">
        <div class="pro-team-side">
          <div class="pro-team-logo">${getTeamShortName(homeTeam.name)}</div>
          <strong>${homeTeam.name}</strong>
        </div>

        <div class="pro-score-center ${match.status === "finished" ? "finished-score" : ""}">
          <span>${score}</span>
          <small>${match.status === "finished" ? "النتيجة" : "الوقت"}</small>
        </div>

        <div class="pro-team-side">
          <div class="pro-team-logo">${getTeamShortName(awayTeam.name)}</div>
          <strong>${awayTeam.name}</strong>
        </div>
      </div>

      <div class="pro-match-footer">
        <span>↗ اضغط لعرض التفاصيل</span>
      </div>
    </div>
  `;
}

function getStageText(stage) {
  if (stage === "quarter") return "ربع النهائي";
  if (stage === "semi") return "نصف النهائي";
  if (stage === "final") return "النهائي";
  return "مرحلة غير معروفة";
}

function getQualifiedTeams() {
  const qualified = {};

  groups.forEach((groupName) => {
    const standings = calculateGroupStandings(groupName);

    qualified[`${groupName}1`] = standings[0] || null;
    qualified[`${groupName}2`] = standings[1] || null;
  });

  return qualified;
}

function renderQualifiedPreview() {
  const qualified = getQualifiedTeams();
  const container = document.getElementById("qualifiedPreview");

  container.innerHTML = groups
    .map((groupName) => {
      const first = qualified[`${groupName}1`];
      const second = qualified[`${groupName}2`];

      return `
        <div class="qualified-item">
          <strong>المجموعة ${groupName}</strong>
          <span>1. ${first ? first.teamName : "غير محدد"}</span><br>
          <span>2. ${second ? second.teamName : "غير محدد"}</span>
        </div>
      `;
    })
    .join("");
}
function renderBracket() {
  const qualified = getQualifiedTeams();

  const qf1 = getKnockoutMatch("QF1");
  const qf2 = getKnockoutMatch("QF2");
  const qf3 = getKnockoutMatch("QF3");
  const qf4 = getKnockoutMatch("QF4");

  const sf1 = getKnockoutMatch("SF1");
  const sf2 = getKnockoutMatch("SF2");
  const finalMatch = getKnockoutMatch("FINAL");

  const fallbackQF1 = createVirtualMatch("QF1", qualified.A1, qualified.B2, "ربع النهائي");
  const fallbackQF2 = createVirtualMatch("QF2", qualified.B1, qualified.A2, "ربع النهائي");
  const fallbackQF3 = createVirtualMatch("QF3", qualified.C1, qualified.D2, "ربع النهائي");
  const fallbackQF4 = createVirtualMatch("QF4", qualified.D1, qualified.C2, "ربع النهائي");

  const qfMatchesTop = [
    qf1 || fallbackQF1,
    qf2 || fallbackQF2
  ];

  const qfMatchesBottom = [
    qf3 || fallbackQF3,
    qf4 || fallbackQF4
  ];

  const sf1Home = getWinnerFromMatch(qf1);
  const sf1Away = getWinnerFromMatch(qf2);
  const sf2Home = getWinnerFromMatch(qf3);
  const sf2Away = getWinnerFromMatch(qf4);

  const fallbackSF1 = createVirtualMatch("SF1", sf1Home, sf1Away, "نصف النهائي");
  const fallbackSF2 = createVirtualMatch("SF2", sf2Home, sf2Away, "نصف النهائي");

  const finalHome = getWinnerFromMatch(sf1);
  const finalAway = getWinnerFromMatch(sf2);

  const fallbackFinal = createVirtualMatch("FINAL", finalHome, finalAway, "النهائي");

  const finalData = finalMatch || fallbackFinal;
  const champion = getWinnerFromMatch(finalMatch);

  const container = document.getElementById("bracketContainer");

  container.innerHTML = `
    <div class="vertical-bracket">

      <div class="bracket-exit-pill">مخطط البطولة</div>

      <div class="bracket-stage-title">ربع النهائي</div>

      <div class="bracket-row bracket-row-top">
        ${qfMatchesTop.map(createBracketMiniMatch).join("")}
      </div>

      <div class="connector connector-top"></div>

      <div class="bracket-stage-title">نصف النهائي</div>

      <div class="bracket-center">
        ${createBracketMiniMatch(sf1 || fallbackSF1)}
      </div>

      <div class="connector connector-middle"></div>

      <div class="bracket-stage-title final-title">النهائي</div>

      ${createFinalCard(finalData, champion)}

      <div class="connector connector-middle"></div>

      <div class="bracket-stage-title">نصف النهائي</div>

      <div class="bracket-center">
        ${createBracketMiniMatch(sf2 || fallbackSF2)}
      </div>

      <div class="connector connector-bottom"></div>

      <div class="bracket-stage-title">ربع النهائي</div>

      <div class="bracket-row bracket-row-bottom">
        ${qfMatchesBottom.map(createBracketMiniMatch).join("")}
      </div>

    </div>
  `;
}

function getKnockoutMatch(slot) {
  return matches.find((match) => match.bracketSlot === slot) || null;
}

function createVirtualMatch(slot, teamA, teamB, title) {
  return {
    id: slot,
    stage: title,
    bracketSlot: slot,
    homeTeamId: teamA ? teamA.teamId : null,
    awayTeamId: teamB ? teamB.teamId : null,
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    virtualTitle: title
  };
}

function getWinnerFromMatch(match) {
  if (!match || match.status !== "finished") return null;

  if (match.homeScore === null || match.awayScore === null) return null;

  if (match.homeScore > match.awayScore) {
    const team = getTeam(match.homeTeamId);
    return team
      ? { teamId: team.id, teamName: team.name }
      : null;
  }

  if (match.awayScore > match.homeScore) {
    const team = getTeam(match.awayTeamId);
    return team
      ? { teamId: team.id, teamName: team.name }
      : null;
  }

  return null;
}

function createBracketMiniMatch(match) {
  const homeTeam = match.homeTeamId ? getTeam(match.homeTeamId) : null;
  const awayTeam = match.awayTeamId ? getTeam(match.awayTeamId) : null;

  const winner = getWinnerFromMatch(match);

  const homeName = homeTeam ? homeTeam.name : "غير محدد";
  const awayName = awayTeam ? awayTeam.name : "غير محدد";

  const score =
    match.status === "finished" && match.homeScore !== null && match.awayScore !== null
      ? `${match.homeScore} - ${match.awayScore}`
      : "-";

  const title = match.virtualTitle || getStageText(match.stage);

  const homeWinnerClass = winner && winner.teamId === match.homeTeamId ? "winner-team" : "";
  const awayWinnerClass = winner && winner.teamId === match.awayTeamId ? "winner-team" : "";

  return `
    <div class="mini-bracket-card" onclick="${match.status === "finished" ? `openMatchModal('${match.id}')` : ""}">
      <div class="mini-teams">
        <div class="mini-team ${homeWinnerClass}">
          <div class="mini-logo">${getTeamShortName(homeName)}</div>
          <span>${homeName}</span>
        </div>

        <div class="mini-team ${awayWinnerClass}">
          <div class="mini-logo">${getTeamShortName(awayName)}</div>
          <span>${awayName}</span>
        </div>
      </div>

      <div class="mini-score">${score}</div>
      <p>${title}</p>
    </div>
  `;
}

function createFinalCard(match, champion) {
  const homeTeam = match.homeTeamId ? getTeam(match.homeTeamId) : null;
  const awayTeam = match.awayTeamId ? getTeam(match.awayTeamId) : null;

  const homeName = homeTeam ? homeTeam.name : "فائز نصف النهائي 1";
  const awayName = awayTeam ? awayTeam.name : "فائز نصف النهائي 2";

  const score =
    match.status === "finished" && match.homeScore !== null && match.awayScore !== null
      ? `${match.homeScore} - ${match.awayScore}`
      : "-";

  const homeWinnerClass = champion && champion.teamId === match.homeTeamId ? "final-winner" : "";
  const awayWinnerClass = champion && champion.teamId === match.awayTeamId ? "final-winner" : "";

  return `
    <div class="final-match-card" onclick="${match.status === "finished" ? `openMatchModal('${match.id}')` : ""}">
      <div class="final-cup">🏆</div>

      <div class="final-teams">
        <div class="final-team ${homeWinnerClass}">
          <div class="team-logo-placeholder">${getTeamShortName(homeName)}</div>
          <span>${homeName}</span>
        </div>

        <div class="final-score">
          <small>النتيجة</small>
          <strong>${score}</strong>
        </div>

        <div class="final-team ${awayWinnerClass}">
          <div class="team-logo-placeholder">${getTeamShortName(awayName)}</div>
          <span>${awayName}</span>
        </div>
      </div>

      <p class="final-note">
        ${
          champion
            ? `بطل البطولة: ${champion.teamName}`
            : "الفائز هنا يكون بطل الدوري الانجليزي"
        }
      </p>
    </div>
  `;
}

function getTeamShortName(teamName) {
  if (!teamName || teamName === "غير محدد") return "-";

  if (teamName.includes("فائز")) return "W";

  return teamName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

let currentStatsTab = "scorers";
let statsTabsInitialized = false;

function renderStats() {
  setupStatsTabs();

  const scorers = getTopScorersData();
  const motm = getMotmData();
  const yellowCards = getCardsData("yellow");
  const redCards = getCardsData("red");

  renderStatsHighlights(scorers, motm, yellowCards, redCards);
  renderStatsTabContent(currentStatsTab);
}

function setupStatsTabs() {
  if (statsTabsInitialized) return;

  const tabs = document.querySelectorAll(".stats-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      currentStatsTab = tab.dataset.statsTab;
      renderStatsTabContent(currentStatsTab);
    });
  });

  statsTabsInitialized = true;
}

function renderStatsHighlights(scorers, motm, yellowCards, redCards) {
  const container = document.getElementById("statsHighlights");

  if (!container) return;

  const topScorer = scorers[0] || null;
  const topMotm = motm[0] || null;

  const cardsCombined = [
    ...yellowCards.map((item) => ({
      ...item,
      cardKind: "صفراء"
    })),
    ...redCards.map((item) => ({
      ...item,
      cardKind: "حمراء"
    }))
  ].sort((a, b) => b.count - a.count);

  const topCards = cardsCombined[0] || null;

  container.innerHTML = `
    ${createHighlightCard({
      label: "هداف البطولة",
      playerName: topScorer ? topScorer.playerName : "لا يوجد",
      teamName: topScorer ? topScorer.teamName : "لم تُسجل أهداف بعد",
      value: topScorer ? topScorer.count : 0,
      valueLabel: "هدف",
      main: true
    })}

    ${createHighlightCard({
      label: "نجم البطولة",
      playerName: topMotm ? topMotm.playerName : "لا يوجد",
      teamName: topMotm ? topMotm.teamName : "لم يتم اختيار الأفضل بعد",
      value: topMotm ? topMotm.count : 0,
      valueLabel: "مرة",
      main: false
    })}

    ${createHighlightCard({
      label: "الأكثر بطاقات",
      playerName: topCards ? topCards.playerName : "لا يوجد",
      teamName: topCards ? `${topCards.teamName} • ${topCards.cardKind}` : "لا توجد بطاقات بعد",
      value: topCards ? topCards.count : 0,
      valueLabel: "بطاقة",
      main: false
    })}
  `;
}

function createHighlightCard(data) {
  return `
    <div class="stats-highlight-card ${data.main ? "" : "secondary"}">
      <p class="highlight-label">${data.label}</p>
      <h3 class="highlight-player">${data.playerName}</h3>
      <p class="highlight-team">${data.teamName}</p>

      <div class="highlight-number">
        <strong>${data.value}</strong>
        <span>${data.valueLabel}</span>
      </div>
    </div>
  `;
}

function renderStatsTabContent(tabName) {
  const container = document.getElementById("statsTabContent");

  if (!container) return;

  if (tabName === "scorers") {
    container.innerHTML = createRankingList(getTopScorersData(), "هدف");
    return;
  }

  if (tabName === "motm") {
    container.innerHTML = createRankingList(getMotmData(), "مرة");
    return;
  }

  if (tabName === "yellow") {
    container.innerHTML = createRankingList(getCardsData("yellow"), "صفراء");
    return;
  }

  if (tabName === "red") {
    container.innerHTML = createRankingList(getCardsData("red"), "حمراء");
    return;
  }
}

function getTopScorersData() {
  const scorerMap = {};

  matches.forEach((match) => {
    match.events.forEach((event) => {
      if (event.type !== "goal") return;

      if (!scorerMap[event.playerId]) {
        const player = getPlayer(event.playerId);
        const team = getTeam(event.teamId);

        scorerMap[event.playerId] = {
          playerId: event.playerId,
          playerName: player ? player.name : "لاعب غير معروف",
          teamName: team ? team.name : "فريق غير معروف",
          count: 0
        };
      }

      scorerMap[event.playerId].count += 1;
    });
  });

  return Object.values(scorerMap).sort((a, b) => b.count - a.count);
}

function getCardsData(cardType) {
  const cardMap = {};

  matches.forEach((match) => {
    match.events.forEach((event) => {
      if (event.type !== cardType) return;

      if (!cardMap[event.playerId]) {
        const player = getPlayer(event.playerId);
        const team = getTeam(event.teamId);

        cardMap[event.playerId] = {
          playerId: event.playerId,
          playerName: player ? player.name : "لاعب غير معروف",
          teamName: team ? team.name : "فريق غير معروف",
          count: 0
        };
      }

      cardMap[event.playerId].count += 1;
    });
  });

  return Object.values(cardMap).sort((a, b) => b.count - a.count);
}

function getMotmData() {
  const motmMap = {};

  matches.forEach((match) => {
    if (!match.manOfTheMatchId) return;

    const player = getPlayer(match.manOfTheMatchId);

    if (!player) return;

    const team = getTeam(player.teamId);

    if (!motmMap[player.id]) {
      motmMap[player.id] = {
        playerId: player.id,
        playerName: player.name,
        teamName: team ? team.name : "فريق غير معروف",
        count: 0
      };
    }

    motmMap[player.id].count += 1;
  });

  return Object.values(motmMap).sort((a, b) => b.count - a.count);
}

function createRankingList(items, label) {
  if (!items.length) {
    return `
      <div class="stats-empty-pro">
        لا توجد بيانات كافية لعرض هذا الترتيب
      </div>
    `;
  }

  return `
    <div class="stats-ranking-list">
      ${items
        .map((item, index) => {
          return `
            <div class="stats-ranking-row ${index === 0 ? "top-one" : ""}" onclick="openPlayerModal('${item.playerId}')">
              <div class="rank-number">${index + 1}</div>

              <div class="ranking-player-info">
                <strong>${item.playerName}</strong>
                <span>${item.teamName}</span>
              </div>

              <div class="ranking-value">
                ${item.count}
                <small>${label}</small>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function openMatchModal(matchId) {
  const match = matches.find((item) => item.id === matchId);

  if (!match) return;

  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  if (!homeTeam || !awayTeam) return;

  const stageText =
    match.stage === "group"
      ? `المجموعة ${match.group}`
      : getStageText(match.stage);

  const scoreText =
    match.status === "finished"
      ? `${match.homeScore} - ${match.awayScore}`
      : "VS";

  document.getElementById("matchModalContent").innerHTML = `
    <div class="modal-match-header">
      <div class="modal-meta-row">
        <p class="modal-stage">${stageText}</p>
        <span class="modal-status-pill status-${match.status}">
          ${getStatusText(match.status)}
        </span>
      </div>

      <p class="modal-date-line">${match.date} • ${match.time}</p>

      <div class="modal-score-row">
        <div class="modal-team">${homeTeam.name}</div>
        <div class="modal-score">${scoreText}</div>
        <div class="modal-team">${awayTeam.name}</div>
      </div>
    </div>

    <div class="match-modal-tabs">
      <button class="match-modal-tab active" onclick="switchMatchTab('matchDetailsTab', this)">
        التفاصيل
      </button>

      <button class="match-modal-tab" onclick="switchMatchTab('matchLineupTab', this)">
        التشكيلة
      </button>
    </div>

    <div id="matchDetailsTab" class="match-tab-content active">
      ${createMatchDetailsContent(match)}
    </div>

    <div id="matchLineupTab" class="match-tab-content">
      ${createMatchLineupContent(match)}
    </div>
  `;

  document.getElementById("matchModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMatchModal() {
  document.getElementById("matchModal").classList.remove("show");
  document.body.style.overflow = "";
}

function getMatchEventsByTeam(match, eventType, teamId) {
  return match.events
    .filter((event) => event.type === eventType && event.teamId === teamId)
    .map((event) => getPlayer(event.playerId))
    .filter(Boolean);
}

function getCardsByTeam(match, teamId) {
  return match.events
    .filter(
      (event) =>
        (event.type === "yellow" || event.type === "red") &&
        event.teamId === teamId
    )
    .map((event) => {
      const player = getPlayer(event.playerId);

      return {
        playerName: player ? player.name : "لاعب غير معروف",
        cardType: event.type
      };
    });
}

function createPlayersList(playersList, icon) {
  if (!playersList.length) {
    return `<div class="modal-empty">لا توجد أهداف</div>`;
  }

  return playersList
    .map(
      (player) => `
        <div class="modal-item">
          <span>${player.name}</span>
          <span>${icon}</span>
        </div>
      `
    )
    .join("");
}

function createCardsList(cardsList) {
  if (!cardsList.length) {
    return `<div class="modal-empty">لا توجد بطاقات</div>`;
  }

  return cardsList
    .map(
      (card) => `
        <div class="modal-item">
          <span>${card.playerName}</span>
          <span class="card-dot ${card.cardType}"></span>
        </div>
      `
    )
    .join("");
}
function ensureDemoPlayers() {
  const positionsPattern = [
    "حارس",
    "مدافع",
    "مدافع",
    "وسط",
    "وسط",
    "وسط",
    "مهاجم",
    "مهاجم"
  ];

  teams.forEach((team) => {
    const currentPlayers = players.filter((player) => player.teamId === team.id);

    currentPlayers.forEach((player, index) => {
      if (!player.position) {
        player.position = positionsPattern[index % positionsPattern.length];
      }
    });

    const missingCount = 8 - currentPlayers.length;

    if (missingCount <= 0) return;

    for (let i = 1; i <= missingCount; i++) {
      const playerNumber = currentPlayers.length + i;

      players.push({
        id: `${team.id}_player_${playerNumber}`,
        name: `لاعب ${playerNumber}`,
        teamId: team.id,
        position: positionsPattern[(playerNumber - 1) % positionsPattern.length]
      });
    }
  });
}

function renderTeams() {
  const container = document.getElementById("teamsContainer");

  if (!container) return;

  container.innerHTML = groups
    .map((groupName) => {
      const groupTeams = teams.filter((team) => team.group === groupName);

      return `
        <div class="teams-group-section">
          <div class="teams-group-title">
            <h3>المجموعة ${groupName}</h3>
            <span>${groupTeams.length} فرق</span>
          </div>

          <div class="group-teams-mini-grid">
            ${groupTeams.map(createMiniTeamCard).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function createMiniTeamCard(team) {
  const stats = calculateTeamStats(team.id);
  const playersCount = players.filter((player) => player.teamId === team.id).length;

  return `
    <div class="mini-team-card" onclick="openTeamModal('${team.id}')">
      <div class="mini-team-logo">${getTeamShortName(team.name)}</div>

      <h4>${team.name}</h4>
      <span class="mini-team-group">المجموعة ${team.group}</span>

      <div class="mini-team-stats">
        <div>
          <strong>${stats.points}</strong>
          <span>نقاط</span>
        </div>

        <div>
          <strong>${stats.goalsFor}</strong>
          <span>له</span>
        </div>

        <div>
          <strong>${playersCount}</strong>
          <span>لاعب</span>
        </div>
      </div>

      <div class="open-hint">
        <span class="open-hint-icon">↗</span>
        <span>اضغط للتفاصيل</span>
      </div>
    </div>
  `;
}

function calculateTeamStats(teamId) {
  const team = getTeam(teamId);

  if (!team) {
    return {
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    };
  }

  const standings = calculateGroupStandings(team.group);
  const row = standings.find((item) => item.teamId === teamId);

  if (!row) {
    return {
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    };
  }

  return {
    played: row.played,
    won: row.won,
    draw: row.draw,
    lost: row.lost,
    points: row.points,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.goalDifference
  };
}

const playerFilters = {
  search: "",
  teamId: "all",
  sort: "default"
};

function setupPlayersControls() {
  const teamFilter = document.getElementById("teamFilter");
  const playerSearch = document.getElementById("playerSearch");
  const playerSort = document.getElementById("playerSort");

  if (teamFilter) {
    teamFilter.innerHTML = `
      <option value="all">كل الفرق</option>
      ${teams
        .map(
          (team) => `
            <option value="${team.id}">${team.name}</option>
          `
        )
        .join("")}
    `;

    teamFilter.addEventListener("change", () => {
      playerFilters.teamId = teamFilter.value;
      renderPlayers();
    });
  }

  if (playerSearch) {
    playerSearch.addEventListener("input", () => {
      playerFilters.search = playerSearch.value.trim().toLowerCase();
      renderPlayers();
    });
  }

  if (playerSort) {
    playerSort.addEventListener("change", () => {
      playerFilters.sort = playerSort.value;
      renderPlayers();
    });
  }
}

function renderPlayers() {
  const container = document.getElementById("playersContainer");

  if (!container) return;

  let filteredPlayers = [...players];

  if (playerFilters.teamId !== "all") {
    filteredPlayers = filteredPlayers.filter(
      (player) => player.teamId === playerFilters.teamId
    );
  }

  if (playerFilters.search) {
    filteredPlayers = filteredPlayers.filter((player) =>
      player.name.toLowerCase().includes(playerFilters.search)
    );
  }

  filteredPlayers.sort((a, b) => {
    const statsA = calculatePlayerStats(a.id);
    const statsB = calculatePlayerStats(b.id);

    if (playerFilters.sort === "goals") {
      return statsB.goals - statsA.goals;
    }

    if (playerFilters.sort === "cards") {
      return statsB.totalCards - statsA.totalCards;
    }

    if (playerFilters.sort === "motm") {
      return statsB.motm - statsA.motm;
    }

    if (playerFilters.sort === "name") {
      return a.name.localeCompare(b.name, "ar");
    }

    return 0;
  });

  if (!filteredPlayers.length) {
    container.innerHTML = `
      <div class="no-results-card">
        لا يوجد لاعبين مطابقين للبحث أو الفلترة الحالية
      </div>
    `;
    return;
  }

  container.innerHTML = filteredPlayers
    .map((player) => {
      const team = getTeam(player.teamId);
      const stats = calculatePlayerStats(player.id);

      return `
        <div class="modern-player-card" onclick="openPlayerModal('${player.id}')">
          <div class="player-card-head">
            <div class="player-modern-avatar">${getPlayerInitials(player.name)}</div>

            <div class="player-card-info">
              <h3>${player.name}</h3>
              <p>${team ? team.name : "فريق غير معروف"}</p>
              <div class="player-position-pill">${player.position || "غير محدد"}</div>
            </div>
          </div>

          <div class="player-modern-stats">
            <div class="player-modern-stat">
              <strong>${stats.goals}</strong>
              <span>أهداف</span>
            </div>

            <div class="player-modern-stat">
              <strong>${stats.totalCards}</strong>
              <span>بطاقات</span>
            </div>

            <div class="player-modern-stat">
              <strong>${stats.motm}</strong>
              <span>الأفضل</span>
            </div>
          </div>

          <div class="player-card-footer">
            <span class="player-team-mini">المجموعة ${team ? team.group : "-"}</span>

            <span class="player-open-hint">
              ↗ التفاصيل
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

function calculatePlayerStats(playerId) {
  const stats = {
    goals: 0,
    yellow: 0,
    red: 0,
    totalCards: 0,
    motm: 0,
    playedEvents: 0
  };

  matches.forEach((match) => {
    match.events.forEach((event) => {
      if (event.playerId !== playerId) return;

      stats.playedEvents += 1;

      if (event.type === "goal") {
        stats.goals += 1;
      }

      if (event.type === "yellow") {
        stats.yellow += 1;
        stats.totalCards += 1;
      }

      if (event.type === "red") {
        stats.red += 1;
        stats.totalCards += 1;
      }
    });

    if (match.manOfTheMatchId === playerId) {
      stats.motm += 1;
    }
  });

  return stats;
}

function openPlayerModal(playerId) {
  const player = players.find((item) => item.id === playerId);

  if (!player) return;

  const team = getTeam(player.teamId);
  const stats = calculatePlayerStats(player.id);
  const playerMatches = getPlayerRelatedMatches(player.id);

  document.getElementById("playerModalContent").innerHTML = `
    <div class="player-modal-header">
      <div class="player-modal-top">
        <div class="player-modal-avatar">${getPlayerInitials(player.name)}</div>

        <div class="player-modal-title">
          <h3>${player.name}</h3>
          <p>${team ? team.name : "فريق غير معروف"} • ${player.position || "غير محدد"}</p>
        </div>
      </div>
    </div>

    <div class="player-modal-section">
      <h4>إحصائيات اللاعب</h4>

      <div class="player-modal-stats-grid">
        <div class="player-modal-stat">
          <strong>${stats.goals}</strong>
          <span>أهداف</span>
        </div>

        <div class="player-modal-stat">
          <strong>${stats.yellow}</strong>
          <span>صفراء</span>
        </div>

        <div class="player-modal-stat">
          <strong>${stats.red}</strong>
          <span>حمراء</span>
        </div>

        <div class="player-modal-stat">
          <strong>${stats.totalCards}</strong>
          <span>مجموع البطاقات</span>
        </div>

        <div class="player-modal-stat">
          <strong>${stats.motm}</strong>
          <span>أفضل لاعب</span>
        </div>

        <div class="player-modal-stat">
          <strong>${stats.playedEvents}</strong>
          <span>أحداث</span>
        </div>
      </div>
    </div>

    <div class="player-modal-section">
      <h4>مباريات ظهر بها اللاعب</h4>

      ${
        playerMatches.length
          ? `
            <div class="player-events-list">
              ${playerMatches
                .map((item) => createPlayerMatchRow(item.match, item.events, player.id))
                .join("")}
            </div>
          `
          : `<div class="empty-state">لا توجد أحداث مسجلة لهذا اللاعب</div>`
      }
    </div>
  `;

  document.getElementById("playerModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closePlayerModal() {
  document.getElementById("playerModal").classList.remove("show");
  document.body.style.overflow = "";
}

function getPlayerRelatedMatches(playerId) {
  return matches
    .map((match) => {
      const events = match.events.filter((event) => event.playerId === playerId);
      const isMotm = match.manOfTheMatchId === playerId;

      if (!events.length && !isMotm) return null;

      return {
        match,
        events,
        isMotm
      };
    })
    .filter(Boolean);
}

function createPlayerMatchRow(match, events, playerId) {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  const score =
    match.status === "finished"
      ? `${match.homeScore} - ${match.awayScore}`
      : match.time;

  const eventLabels = [];

  events.forEach((event) => {
    if (event.type === "goal") eventLabels.push("هدف");
    if (event.type === "yellow") eventLabels.push("صفراء");
    if (event.type === "red") eventLabels.push("حمراء");
  });

  if (match.manOfTheMatchId === playerId) {
    eventLabels.push("أفضل لاعب");
  }

  const stageLabel =
    match.stage === "group"
      ? `المجموعة ${match.group}`
      : getStageText(match.stage);

  return `
    <div class="player-event-row" onclick="openMatchFromPlayerModal('${match.id}')">
      <div>
        <strong>${homeTeam ? homeTeam.name : "غير معروف"} ${score} ${awayTeam ? awayTeam.name : "غير معروف"}</strong>
        <span>${stageLabel} • ${getStatusText(match.status)}</span>
      </div>

      <div class="player-event-type">
        ${eventLabels.join(" / ")}
      </div>
    </div>
  `;
}

function openMatchFromPlayerModal(matchId) {
  closePlayerModal();
  openMatchModal(matchId);
}

function getPlayerInitials(playerName) {
  if (!playerName) return "-";

  return playerName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);
}
function openTeamModal(teamId) {
  const team = getTeam(teamId);

  if (!team) return;

  const stats = calculateTeamStats(team.id);
  const playersList = players.filter((player) => player.teamId === team.id);
  const teamMatches = getMatchesByTeam(team.id);

  document.getElementById("teamModalContent").innerHTML = `
    <div class="team-modal-header">
      <div class="team-modal-header-top">
        <div class="team-modal-logo">${getTeamShortName(team.name)}</div>

        <div class="team-modal-title">
          <h3>${team.name}</h3>
          <p>المجموعة ${team.group} • ${playersList.length} لاعبين</p>
        </div>
      </div>
    </div>

    <div class="team-modal-tabs">
      <button class="team-modal-tab active" onclick="switchTeamTab('playersTab', this)">اللاعبين</button>
      <button class="team-modal-tab" onclick="switchTeamTab('statsTab', this)">الإحصائيات</button>
      <button class="team-modal-tab" onclick="switchTeamTab('matchesTab', this)">المباريات</button>
    </div>

    <div id="playersTab" class="team-tab-content active">
      ${createTeamPlayersTab(team, playersList)}
    </div>

    <div id="statsTab" class="team-tab-content">
      ${createTeamStatsTab(team, stats)}
    </div>

    <div id="matchesTab" class="team-tab-content">
      ${createTeamMatchesTab(teamMatches)}
    </div>
  `;

  document.getElementById("teamModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeTeamModal() {
  document.getElementById("teamModal").classList.remove("show");
  document.body.style.overflow = "";
}

function switchTeamTab(tabId, button) {
  document.querySelectorAll(".team-modal-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".team-tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  button.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function createTeamPlayersTab(team, playersList) {
  return `
    <div class="position-block">
      <h4>المدرب</h4>
      <div class="position-list">
        <div class="position-player">
          <span>${team.coach || "غير محدد"}</span>
          <span>مدرب</span>
        </div>
      </div>
    </div>

    ${createPositionBlock("الحراس", playersList, "حارس")}
    ${createPositionBlock("المدافعين", playersList, "مدافع")}
    ${createPositionBlock("الوسط", playersList, "وسط")}
    ${createPositionBlock("المهاجمين", playersList, "مهاجم")}
  `;
}

function createPositionBlock(title, playersList, position) {
  const filtered = playersList.filter((player) => player.position === position);

  return `
    <div class="position-block">
      <h4>${title}</h4>

      <div class="position-list">
        ${
          filtered.length
            ? filtered
                .map(
                  (player) => `
                    <div class="position-player">
                      <span>${player.name}</span>
                      <span>${player.position}</span>
                    </div>
                  `
                )
                .join("")
            : `<div class="modal-empty">لا يوجد لاعبين</div>`
        }
      </div>
    </div>
  `;
}

function createTeamStatsTab(team, stats) {
  const rank = getTeamRankInGroup(team.id);
  const cards = calculateTeamCards(team.id);

  return `
    <div class="team-full-stats">
      <div class="team-full-stat">
        <strong>${rank}</strong>
        <span>المركز</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.points}</strong>
        <span>نقاط</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.played}</strong>
        <span>لعب</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.won || 0}</strong>
        <span>فاز</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.draw || 0}</strong>
        <span>تعادل</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.lost || 0}</strong>
        <span>خسر</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.goalsFor}</strong>
        <span>له</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.goalsAgainst}</strong>
        <span>عليه</span>
      </div>

      <div class="team-full-stat">
        <strong>${stats.goalDifference}</strong>
        <span>فرق</span>
      </div>

      <div class="team-full-stat">
        <strong>${cards.yellow}</strong>
        <span>صفراء</span>
      </div>

      <div class="team-full-stat">
        <strong>${cards.red}</strong>
        <span>حمراء</span>
      </div>

      <div class="team-full-stat">
        <strong>${players.filter((player) => player.teamId === team.id).length}</strong>
        <span>لاعب</span>
      </div>
    </div>
  `;
}

function createTeamMatchesTab(teamMatches) {
  if (!teamMatches.length) {
    return `<div class="empty-state">لا توجد مباريات لهذا الفريق</div>`;
  }

  return `
    <div class="team-matches-list">
      ${teamMatches
        .map((match) => {
          const homeTeam = getTeam(match.homeTeamId);
          const awayTeam = getTeam(match.awayTeamId);

          const score =
            match.status === "finished"
              ? `${match.homeScore} - ${match.awayScore}`
              : match.time;

          const label =
            match.stage === "group"
              ? `المجموعة ${match.group}`
              : getStageText(match.stage);

          return `
            <div class="team-match-mini" onclick="openMatchModal('${match.id}')">
              <div class="team-match-mini-top">
                <span>${label}</span>
                <span>${getStatusText(match.status)}</span>
              </div>

              <div class="team-match-mini-score">
                <span>${homeTeam ? homeTeam.name : "غير معروف"}</span>
                <b>${score}</b>
                <span>${awayTeam ? awayTeam.name : "غير معروف"}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function getMatchesByTeam(teamId) {
  return matches.filter(
    (match) => match.homeTeamId === teamId || match.awayTeamId === teamId
  );
}

function getTeamRankInGroup(teamId) {
  const team = getTeam(teamId);

  if (!team) return "-";

  const standings = calculateGroupStandings(team.group);
  const index = standings.findIndex((row) => row.teamId === teamId);

  return index >= 0 ? index + 1 : "-";
}

function calculateTeamCards(teamId) {
  const result = {
    yellow: 0,
    red: 0
  };

  matches.forEach((match) => {
    match.events.forEach((event) => {
      if (event.teamId !== teamId) return;

      if (event.type === "yellow") {
        result.yellow += 1;
      }

      if (event.type === "red") {
        result.red += 1;
      }
    });
  });

  return result;
}

function switchMatchTab(tabId, button) {
  document.querySelectorAll(".match-modal-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".match-tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  button.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function createMatchDetailsContent(match) {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  const stadiumName = match.stadium || "لم يتم تحديد الملعب";

  if (match.status !== "finished") {
    return `
      <div class="upcoming-match-details">
        <div class="upcoming-info-card">
          <div class="upcoming-info-icon">📅</div>
          <div>
            <span>تاريخ المباراة</span>
            <strong>${match.date || "غير محدد"}</strong>
          </div>
        </div>

        <div class="upcoming-info-card">
          <div class="upcoming-info-icon">⏰</div>
          <div>
            <span>موعد المباراة</span>
            <strong>${match.time || "غير محدد"}</strong>
          </div>
        </div>

        <div class="upcoming-info-card">
          <div class="upcoming-info-icon">🏟️</div>
          <div>
            <span>الملعب</span>
            <strong>${stadiumName}</strong>
          </div>
        </div>
      </div>
    `;
  }

  const homeGoals = getMatchEventsByTeam(match, "goal", match.homeTeamId);
  const awayGoals = getMatchEventsByTeam(match, "goal", match.awayTeamId);

  const homeCards = getCardsByTeam(match, match.homeTeamId);
  const awayCards = getCardsByTeam(match, match.awayTeamId);

  const motm = match.manOfTheMatchId ? getPlayer(match.manOfTheMatchId) : null;

  return `
    <div class="modal-section">
      <h4>الأهداف</h4>

      <div class="modal-two-cols">
        <div class="modal-list-box">
          <strong>أهداف ${homeTeam.name}</strong>
          <div class="modal-list">
            ${createPlayersList(homeGoals, "⚽")}
          </div>
        </div>

        <div class="modal-list-box">
          <strong>أهداف ${awayTeam.name}</strong>
          <div class="modal-list">
            ${createPlayersList(awayGoals, "⚽")}
          </div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h4>البطاقات</h4>

      <div class="modal-two-cols">
        <div class="modal-list-box">
          <strong>بطاقات ${homeTeam.name}</strong>
          <div class="modal-list">
            ${createCardsList(homeCards)}
          </div>
        </div>

        <div class="modal-list-box">
          <strong>بطاقات ${awayTeam.name}</strong>
          <div class="modal-list">
            ${createCardsList(awayCards)}
          </div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h4>أفضل لاعب بالمباراة</h4>

      <div class="motm-box">
        <span>${motm ? motm.name : "لم يتم الاختيار بعد"}</span>
        <div class="motm-icon">★</div>
      </div>
    </div>
  `;
}

function createMatchLineupContent(match) {
  const homeTeam = getTeam(match.homeTeamId);
  const awayTeam = getTeam(match.awayTeamId);

  if (!homeTeam || !awayTeam) {
    return `<div class="empty-state">لا يمكن عرض التشكيلة</div>`;
  }

  return `
    <div class="lineup-switcher">
      <button class="lineup-switch-btn active" onclick="switchLineupTeam('${match.id}', '${homeTeam.id}', this)">
        ${homeTeam.name}
      </button>

      <button class="lineup-switch-btn" onclick="switchLineupTeam('${match.id}', '${awayTeam.id}', this)">
        ${awayTeam.name}
      </button>
    </div>

    <div id="selectedLineupView">
      ${createTeamPitchLineup(match.id, homeTeam)}
    </div>
  `;
}

function createTeamPitchLineup(matchId, team) {
  if (!team) return "";

  const lineup = getLineupByMatchAndTeam(matchId, team.id);

  if (!lineup) {
    return `
      <div class="lineup-team-card fantasy-lineup-card">
        <div class="lineup-team-head">
          <div class="lineup-team-logo">${getTeamShortName(team.name)}</div>
          <div>
            <h3>${team.name}</h3>
            <p>لم تتم إضافة التشكيلة بعد</p>
          </div>
        </div>

        <div class="lineup-empty">
          لا توجد تشكيلة لهذا الفريق حاليًا
        </div>
      </div>
    `;
  }

  const starters = lineup.starters || [];
  const substitutes = lineup.substitutes || [];
  const formation = getFormationText(starters);

  return `
    <div class="lineup-team-card fantasy-lineup-card">
      <div class="lineup-team-head fantasy-head">
        <div class="lineup-team-logo">${getTeamShortName(team.name)}</div>

        <div>
          <h3>${team.name}</h3>
          <p>8 أساسيين • ${substitutes.length} بدلاء • الخطة ${formation}</p>
        </div>
      </div>

      <div class="fantasy-pitch-header">
        <span>الخطة</span>
        <strong>${formation}</strong>
      </div>

      <div class="football-pitch fantasy-pitch">
        <div class="pitch-marking center-circle"></div>
        <div class="pitch-marking top-box"></div>
        <div class="pitch-marking bottom-box"></div>

        ${createPitchLine("مهاجم", starters)}
        ${createPitchLine("وسط", starters)}
        ${createPitchLine("مدافع", starters)}
        ${createPitchLine("حارس", starters)}
      </div>

      <div class="substitutes-box fantasy-subs">
        <div class="subs-title-row">
          <h4>البدلاء</h4>
          <span>${substitutes.length} لاعبين</span>
        </div>

        <div class="substitutes-list">
          ${
            substitutes.length
              ? substitutes.map(createSubstituteChip).join("")
              : `<div class="lineup-empty small">لا توجد بدلاء</div>`
          }
        </div>
      </div>
    </div>
  `;
}

function createPitchLine(position, starters) {
  const linePlayers = starters.filter((item) => item.position === position);

  if (!linePlayers.length) return "";

  return `
    <div class="pitch-line fantasy-line line-${position}">
      ${linePlayers
        .map((item) => {
          const player = getPlayer(item.playerId);
          const playerName = player ? player.name : "لاعب غير معروف";

          return `
            <div class="fantasy-player">
              <div class="fantasy-shirt">
                <span>${getPlayerInitials(playerName)}</span>
              </div>

              <div class="fantasy-name">
                ${playerName}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function createSubstituteChip(item) {
  const player = getPlayer(item.playerId);

  return `
    <div class="substitute-chip">
      <span>${player ? player.name : "لاعب غير معروف"}</span>
      <small>${item.position}</small>
    </div>
  `;
}

function getLineupByMatchAndTeam(matchId, teamId) {
  return lineups.find(
    (lineup) => lineup.matchId === matchId && lineup.teamId === teamId
  );
}

function getFormationText(starters) {
  const defenders = starters.filter((item) => item.position === "مدافع").length;
  const midfielders = starters.filter((item) => item.position === "وسط").length;
  const attackers = starters.filter((item) => item.position === "مهاجم").length;

  return `${defenders}-${midfielders}-${attackers}`;
}

function switchLineupTeam(matchId, teamId, button) {
  const team = getTeam(teamId);
  const container = document.getElementById("selectedLineupView");

  if (!team || !container) return;

  document.querySelectorAll(".lineup-switch-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  container.innerHTML = createTeamPitchLineup(matchId, team);
}

function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  if (!themeToggle || !themeIcon || !themeText) return;

  const savedTheme = localStorage.getItem("siteTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("siteTheme", isDark ? "dark" : "light");

    updateThemeButton();
  });

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeText.textContent = isDark ? "فاتح" : "داكن";
  }
}

function exposePublicFunctionsToWindow() {
  window.openMatchModal = openMatchModal;
  window.closeMatchModal = closeMatchModal;

  window.openTeamModal = openTeamModal;
  window.closeTeamModal = closeTeamModal;
  window.switchTeamTab = switchTeamTab;

  window.openPlayerModal = openPlayerModal;
  window.closePlayerModal = closePlayerModal;
  window.openMatchFromPlayerModal = openMatchFromPlayerModal;

  window.switchMatchTab = switchMatchTab;
  window.switchLineupTeam = switchLineupTeam;
}