const inputBox = document.getElementById("input-box");
const listWork = document.getElementById("list-work");
const btnTheme = document.getElementById("btn-toggle");
let darkMode = localStorage.getItem("darkmode");

const addTask = () => {
  if (inputBox.value === "") {
    alert("Please enter your work!");
    return;
  } else {
    const li = createElement(inputBox.value);
    listWork.appendChild(li);
  }
  saveData();
  inputBox.value = "";
};

const createElement = (value) => {
  let li = document.createElement("li");
  li.classList.add("item");
  li.setAttribute("draggable", true);

  let contentLi = document.createElement("p");
  contentLi.innerText = value;
  li.appendChild(contentLi);

  let spanDelete = document.createElement("span");
  spanDelete.innerHTML = "x";
  li.appendChild(spanDelete);

  let editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerText = "Edit";
  addEventEditBtn(editBtn, value, li, contentLi);

  li.appendChild(editBtn);

  li.addEventListener("dragstart", () => {
    setTimeout(() => li.classList.add("dragging"), 0);
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    saveData();
  });
  return li;
};

listWork.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
});

const addEventEditBtn = (btn, value, li, contentLi) => {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  btn.addEventListener("click", () => {
    if (btn.innerText.toLowerCase() == "edit") {
      input.focus();
      btn.innerText = "Save";
      li.replaceChild(input, contentLi);
    } else {
      contentLi.innerText = input.value.trim() || contentLi.innerText;
      btn.innerText = "Edit";
      li.replaceChild(contentLi, input);
      saveData();
    }
  });
};

const saveData = () => {
  localStorage.setItem("work", listWork.innerHTML);
};

const showTask = () => {
  listWork.innerHTML = localStorage.getItem("work") || "";

  const tasks = listWork.querySelectorAll("li");

  // Re-add event listeners for drag and edit buttons after page reload
  tasks.forEach((item) => {
    const editBtn = item.querySelector(".edit-btn");
    const contentLi = item.querySelector("span");

    addEventEditBtn(editBtn, contentLi.innerText, item, contentLi);

    item.addEventListener("dragstart", () => {
      setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      saveData();
    });
  });
};

showTask();

//--------------------------------------drag and drop feature----------------------------

const initSortList = (e) => {
  e.preventDefault();

  const draggingItem = listWork.querySelector(".dragging");
  const siblings = [...listWork.querySelectorAll(".item:not(.dragging)")];

  let nextSibling = siblings.find((sibling) => {
    const box = sibling.getBoundingClientRect();
    const offset = e.clientY - box.top - box.height / 2;
    return offset < 0;
  });
  listWork.insertBefore(draggingItem, nextSibling);
  saveData();
};

listWork.addEventListener("dragover", initSortList);
listWork.addEventListener("dragenter", (e) => e.preventDefault());

//-------------------------dark mode --------------------------------------
btnTheme.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkmode");
  darkMode === "active" ? disableDarkMode() : enableDarkMode();
});

const enableDarkMode = () => {
  document.body.classList.add("dark");
  localStorage.setItem("darkmode", "active");
  btnTheme.innerText = "Dark";
};

const disableDarkMode = () => {
  document.body.classList.remove("dark");
  localStorage.setItem("darkmode", null);
  btnTheme.innerText = "Light";
};

if (darkMode === "active") {
  enableDarkMode();
} else {
  disableDarkMode();
}
