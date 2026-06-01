import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
/* ========================= */
/* Firebase Config */
/* ========================= */

const firebaseConfig = {
  apiKey: "AIzaSyArZhI2_NjY9AU366tH133vBzVkVtX-7Uo",
  authDomain: "english-league-8584f.firebaseapp.com",
  projectId: "english-league-8584f",
  storageBucket: "english-league-8584f.firebasestorage.app",
  messagingSenderId: "613009575801",
  appId: "1:613009575801:web:bebd40e482975e495a29a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ========================= */
/* App Start */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
  setupFirebaseLogin();
  setupAdminNavigation();
  setupPasswordToggle();
  setupQuickActions();
});

let adminFeaturesInitialized = false;

function initAdminFeaturesOnce() {
  if (adminFeaturesInitialized) return;

  setupTeamsAdmin();
  setupAdminTeamOptions();
  setupPlayersAdmin();
  setupMatchesAdmin();
  setupResultsAdmin();
  setupLineupsAdmin();

  adminFeaturesInitialized = true;
}

function setupFirebaseLogin() {
  const loginForm = document.getElementById("loginForm");
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const loginMessage = document.getElementById("loginMessage");
  const adminUserEmail = document.getElementById("adminUserEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginForm || !loginScreen || !dashboardScreen) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginScreen.classList.add("hidden");
      dashboardScreen.classList.remove("hidden");

      if (adminUserEmail) {
        adminUserEmail.textContent = user.email;
      }

      initAdminFeaturesOnce();
    } else {
      dashboardScreen.classList.add("hidden");
      loginScreen.classList.remove("hidden");

      if (adminUserEmail) {
        adminUserEmail.textContent = "";
      }
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (!email || !password) {
      loginMessage.textContent = "اكتب البريد وكلمة المرور";
      return;
    }

    loginMessage.textContent = "جاري تسجيل الدخول...";

    try {
      await signInWithEmailAndPassword(auth, email, password);

      loginMessage.textContent = "";
      loginForm.reset();
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "auth/invalid-credential") {
        loginMessage.textContent = "البريد أو كلمة المرور غير صحيحة";
      } else if (error.code === "auth/invalid-email") {
        loginMessage.textContent = "صيغة البريد غير صحيحة";
      } else if (error.code === "auth/too-many-requests") {
        loginMessage.textContent = "محاولات كثيرة، انتظر قليلًا وجرب مرة ثانية";
      } else {
        loginMessage.textContent = "فشل تسجيل الدخول";
      }
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Logout error:", error);
        alert("صار خطأ أثناء تسجيل الخروج");
      }
    });
  }
}

/* ========================= */
/* Temporary Auto Login */
/* ========================= */

function setupTemporaryAutoLogin() {
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const adminUserEmail = document.getElementById("adminUserEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginScreen) {
    loginScreen.classList.add("hidden");
  }

  if (dashboardScreen) {
    dashboardScreen.classList.remove("hidden");
  }

  if (adminUserEmail) {
    adminUserEmail.textContent = "temporary-admin";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("الدخول التلقائي مفعل مؤقتًا");
    });
  }
}

/* ========================= */
/* Navigation */
/* ========================= */

function setupAdminNavigation() {
  const navButtons = document.querySelectorAll(".admin-nav-btn");
  const sections = document.querySelectorAll(".admin-section");
  const pageTitle = document.getElementById("adminPageTitle");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.adminSection;
      const targetSection = document.getElementById(target);

      navButtons.forEach((btn) => btn.classList.remove("active"));
      sections.forEach((section) =>
        section.classList.remove("active-admin-section")
      );

      button.classList.add("active");

      if (targetSection) {
        targetSection.classList.add("active-admin-section");
      }

      if (pageTitle) {
        pageTitle.textContent = button.textContent.trim();
      }
    });
  });
}

function setupPasswordToggle() {
  const passwordInput = document.getElementById("adminPassword");
  const togglePassword = document.getElementById("togglePassword");

  if (!passwordInput || !togglePassword) return;

  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "إخفاء" : "إظهار";
  });
}

function setupQuickActions() {
  const quickButtons = document.querySelectorAll("[data-jump-admin]");

  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.jumpAdmin;
      const navButton = document.querySelector(
        `.admin-nav-btn[data-admin-section="${target}"]`
      );

      if (navButton) {
        navButton.click();
      }
    });
  });
}

/* ========================= */
/* Teams Admin */
/* ========================= */

function setupTeamsAdmin() {
  const teamForm = document.getElementById("teamForm");
  const teamIdInput = document.getElementById("teamIdInput");
  const teamNameInput = document.getElementById("teamNameInput");
  const teamGroupInput = document.getElementById("teamGroupInput");
  const teamCoachInput = document.getElementById("teamCoachInput");
  const teamFormMessage = document.getElementById("teamFormMessage");
  const saveTeamBtn = document.getElementById("saveTeamBtn");
  const cancelTeamEditBtn = document.getElementById("cancelTeamEditBtn");

  if (!teamForm) {
    console.error("teamForm غير موجود داخل HTML");
    return;
  }

  loadTeamsAdminList();

  teamForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const teamId = teamIdInput.value;
    const name = teamNameInput.value.trim();
    const group = teamGroupInput.value;
    const coach = teamCoachInput.value.trim();

    if (!name || !group) {
      teamFormMessage.textContent = "اكتب اسم الفريق وحدد المجموعة";
      return;
    }

    saveTeamBtn.disabled = true;
    saveTeamBtn.textContent = teamId ? "جاري التعديل..." : "جاري الحفظ...";
    teamFormMessage.textContent = "";

    try {
      const teamData = {
        name,
        group,
        coach: coach || `مدرب ${name}`,
        updatedAt: serverTimestamp()
      };

      if (teamId) {
        await updateDoc(doc(db, "teams", teamId), teamData);
        teamFormMessage.textContent = "تم تعديل الفريق بنجاح";
      } else {
        await addDoc(collection(db, "teams"), {
          ...teamData,
          createdAt: serverTimestamp()
        });

        teamFormMessage.textContent = "تمت إضافة الفريق بنجاح";
      }

      resetTeamForm();
    } catch (error) {
      console.error("خطأ حفظ الفريق:", error);
      teamFormMessage.textContent = "صار خطأ أثناء حفظ الفريق";
    } finally {
      saveTeamBtn.disabled = false;
      saveTeamBtn.textContent = "حفظ الفريق";
    }
  });

  if (cancelTeamEditBtn) {
    cancelTeamEditBtn.addEventListener("click", resetTeamForm);
  }

  function resetTeamForm() {
    teamIdInput.value = "";
    teamForm.reset();
    saveTeamBtn.textContent = "حفظ الفريق";

    if (cancelTeamEditBtn) {
      cancelTeamEditBtn.classList.add("hidden");
    }
  }
}

function loadTeamsAdminList() {
  const list = document.getElementById("teamsAdminList");
  const countBadge = document.getElementById("teamsCountBadge");

  if (!list) {
    console.error("teamsAdminList غير موجود داخل HTML");
    return;
  }

  const teamsQuery = query(collection(db, "teams"), orderBy("group", "asc"));

  onSnapshot(
    teamsQuery,
    (snapshot) => {
      const teams = [];

      snapshot.forEach((docSnap) => {
        teams.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      if (countBadge) {
        countBadge.textContent = `${teams.length} فريق`;
      }

      if (!teams.length) {
        list.innerHTML = `
          <div class="preview-row">
            <strong>لا توجد فرق مضافة بعد</strong>
          </div>
        `;
        return;
      }

      list.innerHTML = teams
        .map((team) => {
          return `
            <div class="admin-team-row">
              <strong>${safeHtml(team.name)}</strong>
              <span>Group ${safeHtml(team.group)}</span>
              <small>${safeHtml(team.coach || "بدون مدرب")}</small>

              <div class="row-actions">
                <button
                  type="button"
                  class="row-action-btn edit-btn"
                  onclick="editTeam('${team.id}', '${escapeText(team.name)}', '${escapeText(team.group)}', '${escapeText(team.coach || "")}')"
                >
                  تعديل
                </button>

                <button
                  type="button"
                  class="row-action-btn delete-btn"
                  onclick="deleteTeam('${team.id}', '${escapeText(team.name)}')"
                >
                  حذف
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    },
    (error) => {
      console.error("خطأ تحميل الفرق:", error);

      list.innerHTML = `
        <div class="preview-row">
          <strong>صار خطأ أثناء تحميل الفرق</strong>
        </div>
      `;
    }
  );
}

window.editTeam = function (teamId, name, group, coach) {
  const teamIdInput = document.getElementById("teamIdInput");
  const teamNameInput = document.getElementById("teamNameInput");
  const teamGroupInput = document.getElementById("teamGroupInput");
  const teamCoachInput = document.getElementById("teamCoachInput");
  const saveTeamBtn = document.getElementById("saveTeamBtn");
  const cancelTeamEditBtn = document.getElementById("cancelTeamEditBtn");
  const teamFormMessage = document.getElementById("teamFormMessage");

  if (!teamIdInput || !teamNameInput || !teamGroupInput || !teamCoachInput) {
    alert("حقول تعديل الفريق غير موجودة");
    return;
  }

  teamIdInput.value = teamId;
  teamNameInput.value = name;
  teamGroupInput.value = group;
  teamCoachInput.value = coach;

  if (saveTeamBtn) {
    saveTeamBtn.textContent = "تعديل الفريق";
  }

  if (cancelTeamEditBtn) {
    cancelTeamEditBtn.classList.remove("hidden");
  }

  if (teamFormMessage) {
    teamFormMessage.textContent = "أنت الآن بوضع تعديل الفريق";
  }
};

window.deleteTeam = async function (teamId, teamName) {
  const confirmDelete = confirm(`هل تريد حذف فريق ${teamName}؟`);

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "teams", teamId));
  } catch (error) {
    console.error("خطأ حذف الفريق:", error);
    alert("صار خطأ أثناء حذف الفريق");
  }
};

/* ========================= */
/* Helpers */
/* ========================= */

function escapeText(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', "&quot;")
    .replaceAll("\n", " ");
}

function safeHtml(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
/* ========================= */
/* Shared Admin Cache */
/* ========================= */

let adminTeamsCache = [];
let adminPlayersCache = [];

/* ========================= */
/* Team Options For Selects */
/* ========================= */

function setupAdminTeamOptions() {
  onSnapshot(
    collection(db, "teams"),
    (snapshot) => {
      adminTeamsCache = [];

      snapshot.forEach((docSnap) => {
        adminTeamsCache.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      adminTeamsCache.sort((a, b) => {
        if ((a.group || "") !== (b.group || "")) {
          return String(a.group || "").localeCompare(String(b.group || ""));
        }

        return String(a.name || "").localeCompare(String(b.name || ""));
      });

      renderTeamSelectOptions();
    },
    (error) => {
      console.error("خطأ تحميل الفرق للاختيارات:", error);
    }
  );
}

function renderTeamSelectOptions() {
  const teamSelects = [
    document.getElementById("playerTeamInput"),
    document.getElementById("matchHomeTeamInput"),
    document.getElementById("matchAwayTeamInput")
  ].filter(Boolean);

  teamSelects.forEach((select) => {
    const currentValue = select.value;

    select.innerHTML = `
      <option value="">اختر الفريق</option>
      ${adminTeamsCache
        .map(
          (team) => `
            <option value="${team.id}">
              ${safeHtml(team.name)} - Group ${safeHtml(team.group || "-")}
            </option>
          `
        )
        .join("")}
    `;

    if (currentValue) {
      select.value = currentValue;
    }
  });
}

function getAdminTeamName(teamId) {
  const team = adminTeamsCache.find((item) => item.id === teamId);
  return team ? team.name : "فريق غير معروف";
}

/* ========================= */
/* Players Admin */
/* ========================= */

function setupPlayersAdmin() {
  const playerForm = document.getElementById("playerForm");
  const playerIdInput = document.getElementById("playerIdInput");
  const playerTeamInput = document.getElementById("playerTeamInput");
  const playerNameInput = document.getElementById("playerNameInput");
  const playerPositionInput = document.getElementById("playerPositionInput");
  const playerFormMessage = document.getElementById("playerFormMessage");
  const savePlayerBtn = document.getElementById("savePlayerBtn");
  const cancelPlayerEditBtn = document.getElementById("cancelPlayerEditBtn");

  if (!playerForm) {
    console.error("playerForm غير موجود داخل HTML");
    return;
  }

  loadPlayersAdminList();

  playerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const playerId = playerIdInput.value;
    const teamId = playerTeamInput.value;
    const name = playerNameInput.value.trim();
    const position = playerPositionInput.value;

    if (!teamId || !name || !position) {
      playerFormMessage.textContent = "اختر الفريق واكتب اسم اللاعب وحدد مركزه";
      return;
    }

    const team = adminTeamsCache.find((item) => item.id === teamId);

    if (!team) {
      playerFormMessage.textContent = "الفريق غير موجود، تأكد أنك أضفت فريق أولًا";
      return;
    }

    savePlayerBtn.disabled = true;
    savePlayerBtn.textContent = playerId ? "جاري التعديل..." : "جاري الحفظ...";
    playerFormMessage.textContent = "";

    try {
      const playerData = {
        name,
        teamId,
        teamName: team.name,
        teamGroup: team.group || "",
        position,
        updatedAt: serverTimestamp()
      };

      if (playerId) {
        await updateDoc(doc(db, "players", playerId), playerData);
        playerFormMessage.textContent = "تم تعديل اللاعب بنجاح";
      } else {
        await addDoc(collection(db, "players"), {
          ...playerData,
          createdAt: serverTimestamp()
        });

        playerFormMessage.textContent = "تمت إضافة اللاعب بنجاح";
      }

      resetPlayerForm();
    } catch (error) {
      console.error("خطأ حفظ اللاعب:", error);
      playerFormMessage.textContent = "صار خطأ أثناء حفظ اللاعب";
    } finally {
      savePlayerBtn.disabled = false;
      savePlayerBtn.textContent = "حفظ اللاعب";
    }
  });

  if (cancelPlayerEditBtn) {
    cancelPlayerEditBtn.addEventListener("click", resetPlayerForm);
  }

  function resetPlayerForm() {
    playerIdInput.value = "";
    playerForm.reset();
    savePlayerBtn.textContent = "حفظ اللاعب";

    if (cancelPlayerEditBtn) {
      cancelPlayerEditBtn.classList.add("hidden");
    }

    renderTeamSelectOptions();
  }
}

function loadPlayersAdminList() {
  const list = document.getElementById("playersAdminList");
  const countBadge = document.getElementById("playersCountBadge");

  if (!list) {
    console.error("playersAdminList غير موجود داخل HTML");
    return;
  }

  onSnapshot(
    collection(db, "players"),
    (snapshot) => {
      adminPlayersCache = [];

      snapshot.forEach((docSnap) => {
        adminPlayersCache.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      adminPlayersCache.sort((a, b) => {
        const teamCompare = String(a.teamName || "").localeCompare(
          String(b.teamName || "")
        );

        if (teamCompare !== 0) return teamCompare;

        return String(a.name || "").localeCompare(String(b.name || ""), "ar");
      });

      renderResultPlayerOptions();
renderMotmPlayerOptions();
renderLineupStarterRows();

      if (countBadge) {
        countBadge.textContent = `${adminPlayersCache.length} لاعب`;
      }

      if (!adminPlayersCache.length) {
        list.innerHTML = `
          <div class="preview-row">
            <strong>لا يوجد لاعبين مضافين بعد</strong>
          </div>
        `;
        return;
      }

      list.innerHTML = adminPlayersCache
        .map((player) => {
          return `
            <div class="admin-player-row">
              <strong>${safeHtml(player.name)}</strong>
              <span>${safeHtml(player.teamName || getAdminTeamName(player.teamId))}</span>
              <small>${safeHtml(player.position || "-")}</small>

              <div class="row-actions">
                <button
                  type="button"
                  class="row-action-btn edit-btn"
                  onclick="editPlayer('${player.id}', '${escapeText(player.name)}', '${escapeText(player.teamId)}', '${escapeText(player.position)}')"
                >
                  تعديل
                </button>

                <button
                  type="button"
                  class="row-action-btn delete-btn"
                  onclick="deletePlayer('${player.id}', '${escapeText(player.name)}')"
                >
                  حذف
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    },
    (error) => {
      console.error("خطأ تحميل اللاعبين:", error);

      list.innerHTML = `
        <div class="preview-row">
          <strong>صار خطأ أثناء تحميل اللاعبين</strong>
        </div>
      `;
    }
  );
}

window.editPlayer = function (playerId, name, teamId, position) {
  const playerIdInput = document.getElementById("playerIdInput");
  const playerTeamInput = document.getElementById("playerTeamInput");
  const playerNameInput = document.getElementById("playerNameInput");
  const playerPositionInput = document.getElementById("playerPositionInput");
  const savePlayerBtn = document.getElementById("savePlayerBtn");
  const cancelPlayerEditBtn = document.getElementById("cancelPlayerEditBtn");
  const playerFormMessage = document.getElementById("playerFormMessage");

  if (!playerIdInput || !playerTeamInput || !playerNameInput || !playerPositionInput) {
    alert("حقول تعديل اللاعب غير موجودة");
    return;
  }

  playerIdInput.value = playerId;
  playerNameInput.value = name;

  renderTeamSelectOptions();

  playerTeamInput.value = teamId;
  playerPositionInput.value = position;

  if (savePlayerBtn) {
    savePlayerBtn.textContent = "تعديل اللاعب";
  }

  if (cancelPlayerEditBtn) {
    cancelPlayerEditBtn.classList.remove("hidden");
  }

  if (playerFormMessage) {
    playerFormMessage.textContent = "أنت الآن بوضع تعديل اللاعب";
  }
};

window.deletePlayer = async function (playerId, playerName) {
  const confirmDelete = confirm(`هل تريد حذف اللاعب ${playerName}؟`);

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "players", playerId));
  } catch (error) {
    console.error("خطأ حذف اللاعب:", error);
    alert("صار خطأ أثناء حذف اللاعب");
  }
};
/* ========================= */
/* Matches Admin */
/* ========================= */

let adminMatchesCache = [];

function setupMatchesAdmin() {
  const matchForm = document.getElementById("matchForm");
  const matchIdInput = document.getElementById("matchIdInput");
  const matchHomeTeamInput = document.getElementById("matchHomeTeamInput");
  const matchAwayTeamInput = document.getElementById("matchAwayTeamInput");
  const matchStageInput = document.getElementById("matchStageInput");
  const matchGroupInput = document.getElementById("matchGroupInput");
  const matchBracketSlotInput = document.getElementById("matchBracketSlotInput");
  const matchDateInput = document.getElementById("matchDateInput");
  const matchTimeInput = document.getElementById("matchTimeInput");
  const matchStadiumInput = document.getElementById("matchStadiumInput");
  const matchStatusInput = document.getElementById("matchStatusInput");
  const matchFormMessage = document.getElementById("matchFormMessage");
  const saveMatchBtn = document.getElementById("saveMatchBtn");
  const cancelMatchEditBtn = document.getElementById("cancelMatchEditBtn");

  if (!matchForm) {
    console.error("matchForm غير موجود داخل HTML");
    return;
  }

  loadMatchesAdminList();

  matchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const matchId = matchIdInput.value;
    const homeTeamId = matchHomeTeamInput.value;
    const awayTeamId = matchAwayTeamInput.value;
    const stage = matchStageInput.value;
    const group = matchGroupInput.value;
    const bracketSlot = matchBracketSlotInput.value;
    const date = matchDateInput.value;
    const time = matchTimeInput.value;
    const stadium = matchStadiumInput.value.trim();
    const status = matchStatusInput.value;

    if (!homeTeamId || !awayTeamId || !stage || !date || !time || !status) {
      matchFormMessage.textContent = "أكمل بيانات المباراة";
      return;
    }

    if (homeTeamId === awayTeamId) {
      matchFormMessage.textContent = "لا يمكن اختيار نفس الفريق للطرفين";
      return;
    }

    const homeTeam = adminTeamsCache.find((team) => team.id === homeTeamId);
    const awayTeam = adminTeamsCache.find((team) => team.id === awayTeamId);

    if (!homeTeam || !awayTeam) {
      matchFormMessage.textContent = "الفريق الأول أو الثاني غير موجود";
      return;
    }

    saveMatchBtn.disabled = true;
    saveMatchBtn.textContent = matchId ? "جاري التعديل..." : "جاري الحفظ...";
    matchFormMessage.textContent = "";

    try {
      const matchData = {
        homeTeamId,
        awayTeamId,
        homeTeamName: homeTeam.name,
        awayTeamName: awayTeam.name,

        stage,
        group: stage === "group" ? group : null,
        bracketSlot: stage === "group" ? "" : bracketSlot,

        date,
        time,
        stadium: stadium || "ملعب البطولة",
        status,

        homeScore: null,
        awayScore: null,
        events: [],
        manOfTheMatchId: null,
        manOfTheMatchName: "",

        updatedAt: serverTimestamp()
      };

      if (matchId) {
        await updateDoc(doc(db, "matches", matchId), matchData);
        matchFormMessage.textContent = "تم تعديل المباراة بنجاح";
      } else {
        await addDoc(collection(db, "matches"), {
          ...matchData,
          createdAt: serverTimestamp()
        });

        matchFormMessage.textContent = "تمت إضافة المباراة بنجاح";
      }

      resetMatchForm();
    } catch (error) {
      console.error("خطأ حفظ المباراة:", error);
      matchFormMessage.textContent = "صار خطأ أثناء حفظ المباراة";
    } finally {
      saveMatchBtn.disabled = false;
      saveMatchBtn.textContent = "حفظ المباراة";
    }
  });

  if (cancelMatchEditBtn) {
    cancelMatchEditBtn.addEventListener("click", resetMatchForm);
  }

  function resetMatchForm() {
    matchIdInput.value = "";
    matchForm.reset();
    saveMatchBtn.textContent = "حفظ المباراة";

    if (cancelMatchEditBtn) {
      cancelMatchEditBtn.classList.add("hidden");
    }

    renderTeamSelectOptions();
  }
}

function loadMatchesAdminList() {
  const list = document.getElementById("matchesAdminList");
  const countBadge = document.getElementById("matchesCountBadge");

  if (!list) {
    console.error("matchesAdminList غير موجود داخل HTML");
    return;
  }

  onSnapshot(
    collection(db, "matches"),
    (snapshot) => {
      adminMatchesCache = [];

      snapshot.forEach((docSnap) => {
        adminMatchesCache.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      adminMatchesCache.sort((a, b) => {
        return String(a.date || "").localeCompare(String(b.date || ""));
      });

      renderResultMatchOptions();
renderLineupMatchOptions();

      if (countBadge) {
        countBadge.textContent = `${adminMatchesCache.length} مباراة`;
      }

      if (!adminMatchesCache.length) {
        list.innerHTML = `
          <div class="preview-row">
            <strong>لا توجد مباريات مضافة بعد</strong>
          </div>
        `;
        return;
      }

      list.innerHTML = adminMatchesCache
        .map((match) => {
          const stageLabel =
            match.stage === "group"
              ? `المجموعة ${safeHtml(match.group || "-")}`
              : getAdminStageText(match.stage);

          return `
            <div class="admin-match-row">
              <strong>
                ${safeHtml(match.homeTeamName || getAdminTeamName(match.homeTeamId))}
                vs
                ${safeHtml(match.awayTeamName || getAdminTeamName(match.awayTeamId))}
              </strong>

              <span>${stageLabel}</span>

              <small>
                ${safeHtml(match.date || "-")} • ${safeHtml(match.time || "-")}
              </small>

              <span class="admin-status-pill ${safeHtml(match.status || "upcoming")}">
                ${getAdminStatusText(match.status)}
              </span>

              <div class="row-actions">
                <button
                  type="button"
                  class="row-action-btn edit-btn"
                  onclick="editMatch('${match.id}')"
                >
                  تعديل
                </button>

                <button
                  type="button"
                  class="row-action-btn delete-btn"
                  onclick="deleteMatch('${match.id}')"
                >
                  حذف
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    },
    (error) => {
      console.error("خطأ تحميل المباريات:", error);

      list.innerHTML = `
        <div class="preview-row">
          <strong>صار خطأ أثناء تحميل المباريات</strong>
        </div>
      `;
    }
  );
}

window.editMatch = function (matchId) {
  const match = adminMatchesCache.find((item) => item.id === matchId);

  if (!match) {
    alert("المباراة غير موجودة");
    return;
  }

  document.getElementById("matchIdInput").value = match.id;
  document.getElementById("matchHomeTeamInput").value = match.homeTeamId;
  document.getElementById("matchAwayTeamInput").value = match.awayTeamId;
  document.getElementById("matchStageInput").value = match.stage || "group";
  document.getElementById("matchGroupInput").value = match.group || "A";
  document.getElementById("matchBracketSlotInput").value = match.bracketSlot || "";
  document.getElementById("matchDateInput").value = match.date || "";
  document.getElementById("matchTimeInput").value = match.time || "";
  document.getElementById("matchStadiumInput").value = match.stadium || "";
  document.getElementById("matchStatusInput").value = match.status || "upcoming";

  document.getElementById("saveMatchBtn").textContent = "تعديل المباراة";
  document.getElementById("cancelMatchEditBtn").classList.remove("hidden");

  const message = document.getElementById("matchFormMessage");
  if (message) {
    message.textContent = "أنت الآن بوضع تعديل المباراة";
  }
};

window.deleteMatch = async function (matchId) {
  const match = adminMatchesCache.find((item) => item.id === matchId);

  const matchName = match
    ? `${match.homeTeamName || getAdminTeamName(match.homeTeamId)} vs ${match.awayTeamName || getAdminTeamName(match.awayTeamId)}`
    : "هذه المباراة";

  const confirmDelete = confirm(`هل تريد حذف ${matchName}؟`);

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "matches", matchId));
  } catch (error) {
    console.error("خطأ حذف المباراة:", error);
    alert("صار خطأ أثناء حذف المباراة");
  }
};

function getAdminStageText(stage) {
  if (stage === "quarter") return "ربع النهائي";
  if (stage === "semi") return "نصف النهائي";
  if (stage === "final") return "النهائي";
  return "المجموعات";
}

function getAdminStatusText(status) {
  if (status === "finished") return "منتهية";
  if (status === "today") return "اليوم";
  return "قادمة";
}

/* ========================= */
/* Results & Events Admin */
/* ========================= */

function setupResultsAdmin() {
  const resultMatchSelect = document.getElementById("resultMatchSelect");
  const scoreForm = document.getElementById("scoreForm");
  const eventForm = document.getElementById("eventForm");
  const eventTeamInput = document.getElementById("eventTeamInput");
  const motmForm = document.getElementById("motmForm");

  if (!resultMatchSelect) {
    console.error("resultMatchSelect غير موجود داخل HTML");
    return;
  }

  renderResultMatchOptions();

  resultMatchSelect.addEventListener("change", () => {
    fillResultFormsFromMatch();
  });

  if (eventTeamInput) {
    eventTeamInput.addEventListener("change", () => {
      renderResultPlayerOptions();
    });
  }

  if (scoreForm) {
    scoreForm.addEventListener("submit", saveMatchScore);
  }

  if (eventForm) {
    eventForm.addEventListener("submit", addMatchEvent);
  }

  if (motmForm) {
    motmForm.addEventListener("submit", saveMatchMotm);
  }
}

function renderResultMatchOptions() {
  const resultMatchSelect = document.getElementById("resultMatchSelect");

  if (!resultMatchSelect) return;

  const currentValue = resultMatchSelect.value;

  resultMatchSelect.innerHTML = `
    <option value="">اختر المباراة</option>
    ${adminMatchesCache
      .map((match) => {
        const homeName = match.homeTeamName || getAdminTeamName(match.homeTeamId);
        const awayName = match.awayTeamName || getAdminTeamName(match.awayTeamId);

        return `
          <option value="${match.id}">
            ${safeHtml(homeName)} vs ${safeHtml(awayName)} - ${safeHtml(match.date || "")}
          </option>
        `;
      })
      .join("")}
  `;

  if (currentValue) {
    resultMatchSelect.value = currentValue;
  }

  fillResultFormsFromMatch();
}

function getSelectedResultMatch() {
  const matchId = document.getElementById("resultMatchSelect")?.value;

  if (!matchId) return null;

  return adminMatchesCache.find((match) => match.id === matchId) || null;
}

function fillResultFormsFromMatch() {
  const match = getSelectedResultMatch();

  const homeScoreInput = document.getElementById("resultHomeScoreInput");
  const awayScoreInput = document.getElementById("resultAwayScoreInput");
  const statusInput = document.getElementById("resultStatusInput");

  if (homeScoreInput) {
    homeScoreInput.value = match?.homeScore ?? "";
  }

  if (awayScoreInput) {
    awayScoreInput.value = match?.awayScore ?? "";
  }

  if (statusInput) {
    statusInput.value = match?.status || "finished";
  }

  renderEventTeamOptions();
  renderResultPlayerOptions();
  renderMotmPlayerOptions();
  renderEventsPreview();
}

function renderEventTeamOptions() {
  const match = getSelectedResultMatch();
  const eventTeamInput = document.getElementById("eventTeamInput");

  if (!eventTeamInput) return;

  if (!match) {
    eventTeamInput.innerHTML = `<option value="">اختر المباراة أولًا</option>`;
    return;
  }

  const homeName = match.homeTeamName || getAdminTeamName(match.homeTeamId);
  const awayName = match.awayTeamName || getAdminTeamName(match.awayTeamId);

  const currentValue = eventTeamInput.value;

  eventTeamInput.innerHTML = `
    <option value="">اختر الفريق</option>
    <option value="${match.homeTeamId}">${safeHtml(homeName)}</option>
    <option value="${match.awayTeamId}">${safeHtml(awayName)}</option>
  `;

  if (currentValue) {
    eventTeamInput.value = currentValue;
  }
}

function renderResultPlayerOptions() {
  const eventTeamInput = document.getElementById("eventTeamInput");
  const eventPlayerInput = document.getElementById("eventPlayerInput");

  if (!eventPlayerInput) return;

  const teamId = eventTeamInput ? eventTeamInput.value : "";

  if (!teamId) {
    eventPlayerInput.innerHTML = `<option value="">اختر الفريق أولًا</option>`;
    return;
  }

  const players = adminPlayersCache.filter((player) => player.teamId === teamId);

  eventPlayerInput.innerHTML = `
    <option value="">اختر اللاعب</option>
    ${players
      .map(
        (player) => `
          <option value="${player.id}">
            ${safeHtml(player.name)}
          </option>
        `
      )
      .join("")}
  `;
}

function renderMotmPlayerOptions() {
  const match = getSelectedResultMatch();
  const motmPlayerInput = document.getElementById("motmPlayerInput");

  if (!motmPlayerInput) return;

  if (!match) {
    motmPlayerInput.innerHTML = `<option value="">اختر المباراة أولًا</option>`;
    return;
  }

  const players = adminPlayersCache.filter(
    (player) =>
      player.teamId === match.homeTeamId || player.teamId === match.awayTeamId
  );

  motmPlayerInput.innerHTML = `
    <option value="">اختر اللاعب</option>
    ${players
      .map(
        (player) => `
          <option value="${player.id}">
            ${safeHtml(player.name)} - ${safeHtml(player.teamName || getAdminTeamName(player.teamId))}
          </option>
        `
      )
      .join("")}
  `;

  if (match.manOfTheMatchId) {
    motmPlayerInput.value = match.manOfTheMatchId;
  }
}

async function saveMatchScore(event) {
  event.preventDefault();

  const match = getSelectedResultMatch();
  const message = document.getElementById("scoreFormMessage");
  const saveScoreBtn = document.getElementById("saveScoreBtn");

  if (!match) {
    message.textContent = "اختر المباراة أولًا";
    return;
  }

  const homeScoreValue = document.getElementById("resultHomeScoreInput").value;
  const awayScoreValue = document.getElementById("resultAwayScoreInput").value;
  const status = document.getElementById("resultStatusInput").value;

  if (homeScoreValue === "" || awayScoreValue === "") {
    message.textContent = "اكتب نتيجة الفريقين";
    return;
  }

  const homeScore = Number(homeScoreValue);
  const awayScore = Number(awayScoreValue);

  saveScoreBtn.disabled = true;
  saveScoreBtn.textContent = "جاري الحفظ...";
  message.textContent = "";

  try {
    await updateDoc(doc(db, "matches", match.id), {
      homeScore,
      awayScore,
      status,
      updatedAt: serverTimestamp()
    });

    message.textContent = "تم حفظ النتيجة بنجاح";
  } catch (error) {
    console.error("خطأ حفظ النتيجة:", error);
    message.textContent = "صار خطأ أثناء حفظ النتيجة";
  } finally {
    saveScoreBtn.disabled = false;
    saveScoreBtn.textContent = "حفظ النتيجة";
  }
}

async function addMatchEvent(event) {
  event.preventDefault();

  const match = getSelectedResultMatch();
  const message = document.getElementById("eventFormMessage");
  const addEventBtn = document.getElementById("addEventBtn");

  if (!match) {
    message.textContent = "اختر المباراة أولًا";
    return;
  }

  const type = document.getElementById("eventTypeInput").value;
  const teamId = document.getElementById("eventTeamInput").value;
  const playerId = document.getElementById("eventPlayerInput").value;

  if (!type || !teamId || !playerId) {
    message.textContent = "أكمل بيانات الحدث";
    return;
  }

  const player = adminPlayersCache.find((item) => item.id === playerId);
  const team = adminTeamsCache.find((item) => item.id === teamId);

  if (!player || !team) {
    message.textContent = "بيانات اللاعب أو الفريق غير صحيحة";
    return;
  }

  const oldEvents = Array.isArray(match.events) ? match.events : [];

  const newEvent = {
    id: createLocalId(),
    type,
    teamId,
    teamName: team.name,
    playerId,
    playerName: player.name
  };

  addEventBtn.disabled = true;
  addEventBtn.textContent = "جاري الإضافة...";
  message.textContent = "";

  try {
    await updateDoc(doc(db, "matches", match.id), {
      events: [...oldEvents, newEvent],
      updatedAt: serverTimestamp()
    });

    message.textContent = "تمت إضافة الحدث";
  } catch (error) {
    console.error("خطأ إضافة الحدث:", error);
    message.textContent = "صار خطأ أثناء إضافة الحدث";
  } finally {
    addEventBtn.disabled = false;
    addEventBtn.textContent = "إضافة الحدث";
  }
}

async function saveMatchMotm(event) {
  event.preventDefault();

  const match = getSelectedResultMatch();
  const message = document.getElementById("motmFormMessage");
  const saveMotmBtn = document.getElementById("saveMotmBtn");

  if (!match) {
    message.textContent = "اختر المباراة أولًا";
    return;
  }

  const playerId = document.getElementById("motmPlayerInput").value;

  if (!playerId) {
    message.textContent = "اختر أفضل لاعب";
    return;
  }

  const player = adminPlayersCache.find((item) => item.id === playerId);

  saveMotmBtn.disabled = true;
  saveMotmBtn.textContent = "جاري الحفظ...";
  message.textContent = "";

  try {
    await updateDoc(doc(db, "matches", match.id), {
      manOfTheMatchId: playerId,
      manOfTheMatchName: player ? player.name : "",
      updatedAt: serverTimestamp()
    });

    message.textContent = "تم حفظ أفضل لاعب";
  } catch (error) {
    console.error("خطأ حفظ أفضل لاعب:", error);
    message.textContent = "صار خطأ أثناء حفظ أفضل لاعب";
  } finally {
    saveMotmBtn.disabled = false;
    saveMotmBtn.textContent = "حفظ أفضل لاعب";
  }
}

function renderEventsPreview() {
  const match = getSelectedResultMatch();
  const container = document.getElementById("resultEventsList");

  if (!container) return;

  if (!match) {
    container.innerHTML = `<div class="event-chip">اختر مباراة لعرض أحداثها</div>`;
    return;
  }

  const events = Array.isArray(match.events) ? match.events : [];

  if (!events.length) {
    container.innerHTML = `<div class="event-chip">لا توجد أحداث بعد</div>`;
    return;
  }

  container.innerHTML = events
    .map((item) => {
      const icon =
        item.type === "goal"
          ? "⚽"
          : item.type === "yellow"
          ? "🟨"
          : "🟥";

      const label =
        item.type === "goal"
          ? "هدف"
          : item.type === "yellow"
          ? "بطاقة صفراء"
          : "بطاقة حمراء";

      return `
        <div class="saved-event-row ${safeHtml(item.type)}">
          ${icon} ${safeHtml(item.playerName || "لاعب")} - ${label}
        </div>
      `;
    })
    .join("");
}

function createLocalId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `event_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

/* ========================= */
/* Lineups Admin */
/* ========================= */

function setupLineupsAdmin() {
  const lineupForm = document.getElementById("lineupForm");
  const lineupMatchSelect = document.getElementById("lineupMatchSelect");
  const lineupTeamSelect = document.getElementById("lineupTeamSelect");

  if (!lineupForm || !lineupMatchSelect || !lineupTeamSelect) {
    console.error("عناصر التشكيلات غير موجودة داخل HTML");
    return;
  }

  renderLineupMatchOptions();

  lineupMatchSelect.addEventListener("change", () => {
    renderLineupTeamOptions();
    renderLineupStarterRows();
  });

  lineupTeamSelect.addEventListener("change", () => {
    renderLineupStarterRows();
  });

  lineupForm.addEventListener("submit", saveLineupToFirestore);
}

function renderLineupMatchOptions() {
  const lineupMatchSelect = document.getElementById("lineupMatchSelect");

  if (!lineupMatchSelect) return;

  const currentValue = lineupMatchSelect.value;

  lineupMatchSelect.innerHTML = `
    <option value="">اختر المباراة</option>
    ${adminMatchesCache
      .map((match) => {
        const homeName = match.homeTeamName || getAdminTeamName(match.homeTeamId);
        const awayName = match.awayTeamName || getAdminTeamName(match.awayTeamId);

        return `
          <option value="${match.id}">
            ${safeHtml(homeName)} vs ${safeHtml(awayName)} - ${safeHtml(match.date || "")}
          </option>
        `;
      })
      .join("")}
  `;

  if (currentValue) {
    lineupMatchSelect.value = currentValue;
  }

  renderLineupTeamOptions();
}

function getSelectedLineupMatch() {
  const matchId = document.getElementById("lineupMatchSelect")?.value;

  if (!matchId) return null;

  return adminMatchesCache.find((match) => match.id === matchId) || null;
}

function renderLineupTeamOptions() {
  const lineupTeamSelect = document.getElementById("lineupTeamSelect");
  const match = getSelectedLineupMatch();

  if (!lineupTeamSelect) return;

  if (!match) {
    lineupTeamSelect.innerHTML = `<option value="">اختر المباراة أولًا</option>`;
    return;
  }

  const currentValue = lineupTeamSelect.value;

  const homeName = match.homeTeamName || getAdminTeamName(match.homeTeamId);
  const awayName = match.awayTeamName || getAdminTeamName(match.awayTeamId);

  lineupTeamSelect.innerHTML = `
    <option value="">اختر الفريق</option>
    <option value="${match.homeTeamId}">${safeHtml(homeName)}</option>
    <option value="${match.awayTeamId}">${safeHtml(awayName)}</option>
  `;

  if (currentValue) {
    lineupTeamSelect.value = currentValue;
  }
}

function renderLineupStarterRows() {
  const lineupTeamSelect = document.getElementById("lineupTeamSelect");
  const startersBuilder = document.getElementById("startersBuilder");

  if (!lineupTeamSelect || !startersBuilder) return;

  const teamId = lineupTeamSelect.value;

  startersBuilder.innerHTML = "";

  if (!teamId) {
    startersBuilder.innerHTML = `
      <div class="muted-row">
        <span>اختر مباراة وفريق حتى تظهر اللاعبين</span>
      </div>
    `;

    renderAutoSubstitutes([]);
    updateLineupCounter([], []);
    updateLineupFormation();
    return;
  }

  const teamPlayers = adminPlayersCache.filter((player) => player.teamId === teamId);

  if (!teamPlayers.length) {
    startersBuilder.innerHTML = `
      <div class="muted-row">
        <span>لا يوجد لاعبين لهذا الفريق، أضف لاعبين أولًا</span>
      </div>
    `;

    renderAutoSubstitutes([]);
    updateLineupCounter([], []);
    updateLineupFormation();
    return;
  }

  for (let i = 1; i <= 8; i++) {
    const row = document.createElement("div");
    row.className = "lineup-player-row";

    row.innerHTML = `
      <div class="starter-number">${i}</div>

      <select class="starter-player-select">
        <option value="">اختر اللاعب</option>
        ${teamPlayers
          .map(
            (player) => `
              <option value="${player.id}">
                ${safeHtml(player.name)}
              </option>
            `
          )
          .join("")}
      </select>

      <select class="starter-position-select">
        <option value="حارس">حارس</option>
        <option value="مدافع">مدافع</option>
        <option value="وسط">وسط</option>
        <option value="مهاجم">مهاجم</option>
      </select>
    `;

    startersBuilder.appendChild(row);
  }

  document
    .querySelectorAll(".starter-player-select, .starter-position-select")
    .forEach((select) => {
      select.addEventListener("change", updateLineupAutoData);
    });

  updateLineupAutoData();
}

function updateLineupAutoData() {
  const lineupTeamSelect = document.getElementById("lineupTeamSelect");

  if (!lineupTeamSelect) return;

  const teamId = lineupTeamSelect.value;

  const teamPlayers = adminPlayersCache.filter((player) => player.teamId === teamId);

  const selectedPlayerIds = Array.from(
    document.querySelectorAll(".starter-player-select")
  )
    .map((select) => select.value)
    .filter(Boolean);

  const uniqueSelectedIds = [...new Set(selectedPlayerIds)];

  const substitutes = teamPlayers.filter(
    (player) => !uniqueSelectedIds.includes(player.id)
  );

  renderAutoSubstitutes(substitutes);
  updateLineupCounter(selectedPlayerIds, uniqueSelectedIds);
  updateLineupFormation();
}

function renderAutoSubstitutes(substitutes) {
  const autoSubsPreview = document.getElementById("autoSubsPreview");
  const subsCounter = document.getElementById("subsCounter");

  if (!autoSubsPreview || !subsCounter) return;

  subsCounter.textContent = `${substitutes.length} لاعب`;

  if (!substitutes.length) {
    autoSubsPreview.innerHTML = `
      <div class="muted-row">
        <span>لا يوجد لاعبين احتياط</span>
      </div>
    `;
    return;
  }

  autoSubsPreview.innerHTML = substitutes
    .map((player) => {
      return `
        <div class="auto-sub-chip">
          <strong>${safeHtml(player.name)}</strong>
          <span>${safeHtml(player.position || "-")}</span>
        </div>
      `;
    })
    .join("");
}

function updateLineupCounter(selectedPlayerIds, uniqueSelectedIds) {
  const startersCounter = document.getElementById("startersCounter");

  if (!startersCounter) return;

  const hasDuplicate = selectedPlayerIds.length !== uniqueSelectedIds.length;

  startersCounter.textContent = hasDuplicate
    ? `${uniqueSelectedIds.length} / 8 - تكرار`
    : `${uniqueSelectedIds.length} / 8`;
}

function updateLineupFormation() {
  const rows = Array.from(document.querySelectorAll(".lineup-player-row"));

  let defenders = 0;
  let midfielders = 0;
  let attackers = 0;

  rows.forEach((row) => {
    const playerSelect = row.querySelector(".starter-player-select");
    const positionSelect = row.querySelector(".starter-position-select");

    if (!playerSelect || !positionSelect || !playerSelect.value) return;

    if (positionSelect.value === "مدافع") defenders++;
    if (positionSelect.value === "وسط") midfielders++;
    if (positionSelect.value === "مهاجم") attackers++;
  });

  const lineupFormationPreview = document.getElementById("lineupFormationPreview");

  if (lineupFormationPreview) {
    lineupFormationPreview.value = `${defenders}-${midfielders}-${attackers}`;
  }
}

async function saveLineupToFirestore(event) {
  event.preventDefault();

  const match = getSelectedLineupMatch();
  const lineupTeamSelect = document.getElementById("lineupTeamSelect");
  const lineupFormMessage = document.getElementById("lineupFormMessage");
  const saveLineupBtn = document.getElementById("saveLineupBtn");

  if (!match) {
    lineupFormMessage.textContent = "اختر المباراة أولًا";
    return;
  }

  const teamId = lineupTeamSelect.value;

  if (!teamId) {
    lineupFormMessage.textContent = "اختر الفريق";
    return;
  }

  const rows = Array.from(document.querySelectorAll(".lineup-player-row"));

  const starters = rows
    .map((row) => {
      const playerId = row.querySelector(".starter-player-select")?.value;
      const position = row.querySelector(".starter-position-select")?.value;
      const player = adminPlayersCache.find((item) => item.id === playerId);

      if (!playerId || !position || !player) return null;

      return {
        playerId,
        playerName: player.name,
        position
      };
    })
    .filter(Boolean);

  const uniqueIds = [...new Set(starters.map((item) => item.playerId))];

  if (starters.length !== 8) {
    lineupFormMessage.textContent = "يجب اختيار 8 لاعبين أساسيين بالضبط";
    return;
  }

  if (uniqueIds.length !== 8) {
    lineupFormMessage.textContent = "لا يمكن تكرار نفس اللاعب في التشكيلة";
    return;
  }

  const teamPlayers = adminPlayersCache.filter((player) => player.teamId === teamId);

  const substitutes = teamPlayers
    .filter((player) => !uniqueIds.includes(player.id))
    .map((player) => ({
      playerId: player.id,
      playerName: player.name,
      position: player.position || ""
    }));

  const formation = document.getElementById("lineupFormationPreview")?.value || "0-0-0";
  const team = adminTeamsCache.find((item) => item.id === teamId);

  const matchLabel = `${match.homeTeamName || getAdminTeamName(match.homeTeamId)} vs ${
    match.awayTeamName || getAdminTeamName(match.awayTeamId)
  }`;

  saveLineupBtn.disabled = true;
  saveLineupBtn.textContent = "جاري الحفظ...";
  lineupFormMessage.textContent = "";

  try {
    await setDoc(doc(db, "lineups", `${match.id}_${teamId}`), {
      matchId: match.id,
      teamId,
      teamName: team ? team.name : "",
      matchLabel,
      formation,
      starters,
      substitutes,
      updatedAt: serverTimestamp()
    });

    lineupFormMessage.textContent = "تم حفظ التشكيلة بنجاح";
  } catch (error) {
    console.error("خطأ حفظ التشكيلة:", error);
    lineupFormMessage.textContent = "صار خطأ أثناء حفظ التشكيلة";
  } finally {
    saveLineupBtn.disabled = false;
    saveLineupBtn.textContent = "حفظ التشكيلة";
  }
}