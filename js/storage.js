function saveTableData() {

  const table = document.getElementById("taskTable");

  const data = [];

  for (let i = 0; i < table.rows.length; i++) {

    const row = table.rows[i];

    const rowData = [];

    for (let j = 0; j < row.cells.length; j++) {

      rowData.push({
        text: row.cells[j].textContent,
        tag: row.cells[j].tagName
      });
    }

    data.push(rowData);
  }

  localStorage.setItem("taskData", JSON.stringify(data));
}

function loadTableData() {

  const savedData = localStorage.getItem("taskData");

  if (!savedData) return;

  const data = JSON.parse(savedData);

  const table = document.getElementById("taskTable");

  table.innerHTML = "";

  data.forEach((rowData) => {

    const row = table.insertRow();

    rowData.forEach((cellData, index) => {

      const cell = document.createElement(cellData.tag);

      cell.textContent = cellData.text;

      if (
        cellData.tag === "TD" &&
        index !== 0
      ) {
        cell.classList.add("editable");
      }

      row.appendChild(cell);
    });
  });
}