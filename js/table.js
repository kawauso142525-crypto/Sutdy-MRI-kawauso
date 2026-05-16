function addCellEvents() {

  const editableCells = document.querySelectorAll(".editable");

  editableCells.forEach((cell) => {

    cell.addEventListener("click", () => {

      if (cell.querySelector("input")) return;

      const oldValue = cell.textContent;

      const rowIndex = cell.parentElement.rowIndex;

      const input = document.createElement("input");

      input.value = oldValue;

      cell.textContent = "";

      cell.appendChild(input);

      showSuggestions(cell, input, rowIndex);

      input.focus();

      input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

          saveCell(cell, input.value, rowIndex);
        }
      });

      input.addEventListener("blur", () => {

        setTimeout(() => {
          saveCell(cell, input.value, rowIndex);
        }, 200);
      });
    });
  });
}

function showSuggestions(cell, input, rowIndex) {

  const suggestions = getSuggestions(rowIndex);

  const oldBox = cell.querySelector(".suggestion-box");

  if (oldBox) oldBox.remove();

  const box = document.createElement("div");

  box.classList.add("suggestion-box");

  suggestions.forEach((item) => {

    const div = document.createElement("div");

    div.textContent = item;

    div.classList.add("suggestion-item");

    div.addEventListener("click", () => {

      input.value = item;

      box.remove();

      input.focus();
    });

    box.appendChild(div);
  });

  cell.appendChild(box);
}

function saveCell(cell, value, rowIndex) {

  cell.textContent = value;

  saveSuggestion(rowIndex, value);

  saveTableData();

  addCellEvents();
}
function addNewColumn() {

  const table = document.getElementById("taskTable");

  const headerRow = table.rows[0];

  const newColumnIndex = headerRow.cells.length;

  // ヘッダー追加
  const newHeader = document.createElement("th");

  newHeader.textContent = `データ${newColumnIndex}`;

  headerRow.appendChild(newHeader);

  // 各行へセル追加
  for (let i = 1; i < table.rows.length; i++) {

    const cell = document.createElement("td");

    cell.classList.add("editable");

    cell.textContent = "";

    table.rows[i].appendChild(cell);
  }

  addCellEvents();

  saveTableData();
}