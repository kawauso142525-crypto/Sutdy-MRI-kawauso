async function loadFile(fileName) {

  const allFiles = loadAllFiles();

  if (allFiles[fileName]) {
    return allFiles[fileName];
  }

  const { doc, getDoc } = window.firebaseFunctions;

  const docRef = doc(
    window.firebaseDB,
    "files",
    fileName
  );

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data().tableData;

    allFiles[fileName] = data;
    saveAllFiles(allFiles);

    return data;
  }

  return null;
}

async function saveFile(fileName, data) {

  const allFiles = loadAllFiles();

  allFiles[fileName] = data;

  saveAllFiles(allFiles);

  const { doc, setDoc } = window.firebaseFunctions;

  await setDoc(
    doc(window.firebaseDB, "files", fileName),
    { tableData: data }
  );
}

async function deleteFile(fileName) {

  const allFiles = loadAllFiles();

  delete allFiles[fileName];

  saveAllFiles(allFiles);

  const { doc, deleteDoc } = window.firebaseFunctions;

  await deleteDoc(
    doc(window.firebaseDB, "files", fileName)
  );
}