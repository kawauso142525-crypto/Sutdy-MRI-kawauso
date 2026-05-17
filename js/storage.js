const STORAGE_KEY =
  "multiFileTableData";

/* =========================
   全ファイル取得
========================= */
function loadAllFiles() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : {};

}

/* =========================
   全保存
========================= */
function saveAllFiles(allFiles) {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(allFiles)

  );

}

/* =========================
   ファイル読み込み
   🔥 Firestore優先
========================= */
async function loadFile(fileName) {

  /* ログイン確認 */
  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user) {

    console.log(
      "未ログイン"
    );

    return null;

  }

  const uid =
    user.uid;

  const {
    doc,
    getDoc
  } = window.firebaseFunctions;

  try {

    /* Firestore取得 */
    const snap =
      await getDoc(

        doc(

          window.firebaseDB,

          "users",

          uid,

          "files",

          fileName

        )

      );

    /* Firestore存在 */
    if (snap.exists()) {

      const raw =
        snap.data().tableData;

      /* JSON復元 */
      const data =
        JSON.parse(raw);

      /* localStorage更新 */
      const allFiles =
        loadAllFiles();

      allFiles[fileName] =
        data;

      saveAllFiles(allFiles);

      console.log(
        "Firestore読込成功"
      );

      return data;

    }

  } catch (error) {

    console.error(
      "loadFile error:",
      error
    );

  }

  /* Firestoreになければlocal */
  const allFiles =
    loadAllFiles();

  return (
    allFiles[fileName]
    || null
  );

}

/* =========================
   保存
========================= */
async function saveFile(
  fileName,
  data
) {

  /* localStorage保存 */
  const allFiles =
    loadAllFiles();

  allFiles[fileName] =
    data;

  saveAllFiles(allFiles);

  /* ログイン確認 */
  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user) {

    console.log(
      "未ログイン"
    );

    return;

  }

  const uid =
    user.uid;

  const {
    doc,
    setDoc
  } = window.firebaseFunctions;

  try {

    /* Firestore保存 */
    await setDoc(

      doc(

        window.firebaseDB,

        "users",

        uid,

        "files",

        fileName

      ),

      {

        /* 🔥 Nested arrays対策 */
        tableData:
          JSON.stringify(data)

      }

    );

    console.log(
      "Firestore保存成功"
    );

  } catch (error) {

    console.error(
      "saveFile error:",
      error
    );

  }

}

/* =========================
   自動保存
========================= */
async function autoSaveFile(
  fileName,
  data
) {

  await saveFile(
    fileName,
    data
  );

}

/* =========================
   削除
========================= */
async function deleteFile(
  fileName
) {

  /* local削除 */
  const allFiles =
    loadAllFiles();

  delete allFiles[fileName];

  saveAllFiles(allFiles);

  /* ログイン確認 */
  const user =
    window.firebaseAuth
      ?.currentUser;

  if (!user)
    return;

  const uid =
    user.uid;

  const {
    doc,
    deleteDoc
  } = window.firebaseFunctions;

  try {

    /* Firestore削除 */
    await deleteDoc(

      doc(

        window.firebaseDB,

        "users",

        uid,

        "files",

        fileName

      )

    );

    console.log(
      "Firestore削除成功"
    );

  } catch (error) {

    console.error(
      "deleteFile error:",
      error
    );

  }

}

/* =========================
   ファイル一覧
========================= */
function getFileNames() {

  return Object.keys(
    loadAllFiles()
  );

}
