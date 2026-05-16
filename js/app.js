loadTableData();

addCellEvents();

const addColumnButton = document.getElementById("addColumnButton");

addColumnButton.addEventListener("click", () => {

  addNewColumn();
});