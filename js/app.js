
let currentFileName = "default";
let tableData = [];

/* =========================
   Googleログイン
========================= */
async function login() {
  const { signInWithPopup } = window.firebaseAuth;
  const provider = window.firebaseProvider;

  await signInWithPopup(window.firebaseAuth, provider);
}

/* =========================
   認証監視
========================= */
window.firebaseAuth.onAuthStateChanged(async (user) => {

  if (!user) {
    await login();
    return;
  }

  console.log("ログイン:", user.uid);

  tableData = await loadFile(currentFileName);

  renderTable(tableData);
  await refreshFiles();
});

/* =========================
   初期化
========================= */
async function init() {
  console.log("app start");
}

init();

/* =========================
   ファイル一覧更新
========================= */
async function refreshFiles() {
  const select = document.getElementById("fileSelect");

  select.innerHTML = "";

  const files = getFileNames();

  files.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  select.value = currentFileName;
}

/* =========================
   イベント
========================= */
document.getElementById("saveButton").onclick = () => {
  saveFile(currentFileName, tableData);
};

document.getElementById("newFileButton").onclick = async () => {
  const name = prompt("ファイル名");
  if (!name) return;

  currentFileName = name;
  tableData = [["項目", "列1"], ["", ""]];

  await saveFile(name, tableData);
  refreshFiles();
  renderTable(tableData);
};

document.getElementById("deleteFileButton").onclick = async () => {
  await deleteFile(currentFileName);
};

document.getElementById("addRowButton").onclick = () => {
  addNewRow(tableData);
  renderTable(tableData);
};

document.getElementById("addColumnButton").onclick = () => {
  addNewColumn(tableData);
  renderTable(tableData);
};

/* =========================
   切り替え
========================= */
document.getElementById("fileSelect").onchange = async (e) => {
  currentFileName = e.target.value;

  tableData = await loadFile(currentFileName);

  renderTable(tableData);
};

/* =========================
   自動保存
========================= */
document.addEventListener("input", () => {
  autoSaveFile(currentFileName, tableData);
});