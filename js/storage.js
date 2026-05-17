const STORAGE_KEY = "multiFileTableData";

/**
 * ローカルストレージから全データ取得
 */
function loadAllFiles() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * ローカルストレージへ全データ保存
 */
function saveAllFiles(allFiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allFiles));
}

/**
 * ファイル読み込み（ローカル → Firestore）
 */
window.loadFile = async function (fileName) {
  const allFiles = loadAllFiles();

  // ① ローカルにあればそれを返す
  if (allFiles[fileName]) {
    return allFiles[fileName];
  }

  // ② Firestoreから取得
  const { doc, getDoc } = window.firebaseFunctions;

  const snap = await getDoc(
    doc(window.firebaseDB, "files", fileName)
  );

  if (snap.exists()) {
    const data = snap.data().tableData;
    allFiles[fileName] = data;
    saveAllFiles(allFiles);
    return data;
  }

  return null;
};

/**
 * ファイル保存（ローカル + Firestore）
 */
window.saveFile = async function (fileName, data) {
  const allFiles = loadAllFiles();

  // ローカル保存
  allFiles[fileName] = data;
  saveAllFiles(allFiles);

  // Firestore保存
  const { doc, setDoc } = window.firebaseFunctions;

  await setDoc(
    doc(window.firebaseDB, "files", fileName),
    { tableData: data }
  );
};

/**
 * ファイル削除
 */
window.deleteFile = async function (fileName) {
  const allFiles = loadAllFiles();

  delete allFiles[fileName];
  saveAllFiles(allFiles);

  const { doc, deleteDoc } = window.firebaseFunctions;

  await deleteDoc(
    doc(window.firebaseDB, "files", fileName)
  );
};

/**
 * ファイル一覧取得
 */
window.getFileNames = function () {
  return Object.keys(loadAllFiles());
};