
function getUid() {
  return window.firebaseAuth.currentUser?.uid || null;
}

/* =========================
   保存
========================= */
window.saveFile = async function (fileName, tableData) {

  const uid = getUid();
  if (!uid) return;

  const { doc, setDoc } = window.firebaseFunctions;

  const data = {
    fileName,
    updatedAt: Date.now(),
    rows: tableData.map((row, i) => ({
      id: "row-" + i,
      cells: row
    }))
  };

  await setDoc(
    doc(window.firebaseDB, "users", uid, "files", fileName),
    data
  );
};

/* =========================
   読み込み
========================= */
window.loadFile = async function (fileName) {

  const uid = getUid();
  if (!uid) return [["項目", "列1"], ["", ""]];

  const { doc, getDoc } = window.firebaseFunctions;

  const snap = await getDoc(
    doc(window.firebaseDB, "users", uid, "files", fileName)
  );

  if (!snap.exists()) {
    return [["項目", "列1"], ["", ""]];
  }

  const data = snap.data();

  return (data.rows || []).map(r => r.cells || []);
};

/* =========================
   削除
========================= */
window.deleteFile = async function (fileName) {

  const uid = getUid();
  if (!uid) return;

  const { doc, deleteDoc } = window.firebaseFunctions;

  await deleteDoc(
    doc(window.firebaseDB, "users", uid, "files", fileName)
  );
};

/* =========================
   一覧（簡易版）
========================= */
window.getFileNames = function () {
  return Object.keys(
    JSON.parse(localStorage.getItem("multiFileTableData") || "{}")
  );
};

/* =========================
   自動保存
========================= */
let timer = null;

window.autoSaveFile = function (fileName, tableData) {
  clearTimeout(timer);

  timer = setTimeout(() => {
    window.saveFile(fileName, tableData);
  }, 800);
};