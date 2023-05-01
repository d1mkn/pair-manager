const refs = {
  pairForm: document.querySelector(".add-pair"),
  newPair: document.querySelector(".new-pair"),
  dataList: document.querySelector(".data-list"),
  dataBtns: document.querySelector(".button-wrap"),
  byNameBtn: document.querySelector(".by-name-btn"),
  byValueBtn: document.querySelector(".by-value-btn"),
  delBtn: document.querySelector(".del-btn"),
  xmlBtn: document.querySelector(".xml-btn"),
};

let addQuery = [];
let pairName = null;
let pairValue = null;
let pairId = 0;
const userPairs = [];

window.addEventListener("load", renderFromLocalStorage);

refs.newPair.addEventListener("input", (e) => {
  addQuery = e.target.value.replace(/ /g, "").split("=");
});

refs.pairForm.addEventListener("submit", addNewPair);

refs.dataBtns.addEventListener("click", (e) => {
  if (e.target.classList.contains("del-btn")) {
    deleteSelected();
  }
  if (e.target.classList.contains("by-name-btn")) {
    sortByName();
  }
  if (e.target.classList.contains("by-value-btn")) {
    sortByValue();
  }
  if (e.target.classList.contains("xml-btn")) {
    showXML();
  }
});

function addNewPair(e) {
  pairName = addQuery[0];
  pairValue = addQuery[1];
  e.preventDefault();
  refs.pairForm.reset();

  if (
    userPairs.some((pair) => pair.name === pairName && pair.value === pairValue)
  ) {
    refs.newPair.value = "This pair is already in use!";
    return;
  } else {
    pairId += 1;
    userPairs.push({ id: pairId, name: pairName, value: pairValue });
    udpateLocal();
    pairListMarkup();
    activeBtns();
  }
}

function pairListMarkup() {
  refs.dataList.insertAdjacentHTML(
    "beforeend",
    `<div class="data-el-wrap" id="${pairId}checkbox">
        <input class="user-data-el" type="checkbox" name="${pairName}" id="${pairId}"/>
        <label for="${pairId}">${pairName}=${pairValue}</label>
     </div>`
  );
}

function udpateLocal() {
  localStorage.setItem("local-data", JSON.stringify(userPairs));
}

function renderFromLocalStorage() {
  if (localStorage.getItem("local-data") !== null) {
    const localData = localStorage.getItem("local-data");
    const localPairs = JSON.parse(localData);
    localPairs.forEach((pair) => {
      pairName = pair.name;
      pairValue = pair.value;
      pairId += 1;
      userPairs.push({ id: pairId, name: pairName, value: pairValue });
      pairListMarkup();
      activeBtns();
    });
  }
  return;
}

function activeBtns() {
  if (userPairs.length > 1) {
    refs.byNameBtn.removeAttribute("disabled");
    refs.byValueBtn.removeAttribute("disabled");
    refs.delBtn.removeAttribute("disabled");
  }
}

function deleteSelected() {
  const elements = document.querySelectorAll(".user-data-el");
  const selectedElements = [];
  elements.forEach((pair) => {
    if (pair.checked) {
      selectedElements.push(pair.id);
    }
  });
  console.log(selectedElements);
  selectedElements.forEach((id) => {
    const elementToDelete = document.getElementById(id + "checkbox");
    console.log(elementToDelete);

    const index = userPairs.findIndex((pair) => pair.id === parseInt(id));
    if (index !== -1) {
      userPairs.splice(index, 1);
    }
    elementToDelete.remove();
  });
  console.log(userPairs);
  udpateLocal();
  refs.xmlBtn.removeAttribute("disabled");
}

function sortByName() {
  userPairs.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  sortRender();
  refs.delBtn.removeAttribute("disabled");
  refs.xmlBtn.removeAttribute("disabled");
}

function sortByValue() {
  userPairs.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });
  sortRender();
  refs.delBtn.removeAttribute("disabled");
  refs.xmlBtn.removeAttribute("disabled");
}

function sortRender() {
  refs.dataList.innerHTML = "";
  userPairs.forEach((pair) => {
    pairId = pair.id;
    pairName = pair.name;
    pairValue = pair.value;
    pairListMarkup();
  });
}

function showXML() {
  const xmlString = new XMLSerializer().serializeToString(refs.dataList);
  refs.dataList.textContent = "<pre>" + xmlString + "</pre>";
  refs.xmlBtn.setAttribute("disabled", true);
  refs.delBtn.setAttribute("disabled", true);
}
