const cards = [
  "./assets/icons/img1.jpg",
  "./assets/icons/img2.jpg",
  "./assets/icons/img3.jpg",
  "./assets/icons/img4.jpg",
  "./assets/icons/img5.jpg",
  "./assets/icons/img6.jpg",
  "./assets/icons/img1.jpg",
  "./assets/icons/img2.jpg",
  "./assets/icons/img3.jpg",
  "./assets/icons/img4.jpg",
  "./assets/icons/img5.jpg",
  "./assets/icons/img6.jpg",
];

const clickButton = document.querySelector("#informationBox");

if (clickButton) {
  clickButton.onclick = () => {
    const toggle = document.querySelector("#togglebox");
    toggle.classList.contains("hide") ? toggle.classList.remove("hide") : toggle.classList.add("hide");
  };
}

function clicker(row, tables) {
  row.onclick = () => {
    removeStyle(row, tables.querySelectorAll("tr"));
    row.style.backgroundColor = row.style.backgroundColor === "" ? "green" : "";
  };
}

function removeStyle(row, trs) {
  trs.forEach((el) => {
    if (row !== el) {
      el.style.backgroundColor = "";
    }
  });
}

const game = document.querySelector("#memoryGame");
if (game) {
  startGame(cards);
}

const resetBtn = document.querySelector("#reset");
if (resetBtn) {
  resetBtn.onclick = () => startGame(cards);
}

function startGame(cards) {
  const covers = document.querySelectorAll(".cover");
  const images = document.querySelectorAll(".images");
  const randomImages = shuffleNodeList(images);
  const checker = [];

  resetOpen(images, covers);

  randomImages.forEach((image, index) => {
    image.src = `${cards[index]}`;
  });

  covers.forEach((cover, index) => {
    cover.onclick = () => {
      if (checker.length < 4) {
        cover.classList.add("hide");
        images[index].classList.remove("hide");
        checker.push(images[index], cover);
        checkerfun(checker);
      }
    };
  });
  images.forEach((image, index) => {
    image.onclick = () => {
      checker.length = 0;
      image.classList.add("hide");
      covers[index].classList.remove("hide");
    };
  });
}

function resetOpen(images, covers) {
  covers.forEach((element, index) => {
    if (element.classList.contains("hide")) {
      element.classList.remove("hide");
      images[index].classList.add("hide");
    }
  });
}

function shuffleNodeList(nodeList) {
  nodeList = Array.from(nodeList);
  for (let i = nodeList.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [nodeList[i], nodeList[j]] = [nodeList[j], nodeList[i]];
  }
  return nodeList;
}

function checkerfun(checkThis) {
  if (checkThis.length < 4) {
    return;
  }
  if (checkThis[0].src == checkThis[2].src) {
    checkThis[0].onclick = () => {};
    checkThis[2].onclick = () => {};
    checkThis.length = 0;
    return;
  }
  setTimeout(() => {
    checkThis[0].classList.add("hide");
    checkThis[2].classList.add("hide");
    checkThis[1].classList.remove("hide");
    checkThis[3].classList.remove("hide");
    checkThis.length = 0;
  }, 400);
}

const form = document.querySelector(".toernooi-register");
if (form) {
  function handleForm(input) {
    input.preventDefault();
    const age = input.target.querySelector("#age").value;
    const email = input.target.querySelector("#email").value;

    alert(`je bent ingeschreven in de leeftijdscategorie ${age}. Er is een bevestigingsmail verstuurd naar ${email}`);
  }
}

const changer = document.querySelector("#ajaxCall");
if (changer) {
  filterdata(changer);
}

async function filterdata(dropdown) {
  const data = await getData();
  const uniqueCards = [...new Set(data.map((d) => d["cards"]))].sort((a, b) => b - a);

  fillDropDown(uniqueCards, dropdown);
  setfame(dropdown.value, data);
  dropdown.onchange = (e) => setfame(e.target.value, data);
}

function setfame(number, dataArray) {
  const fameHall = document.querySelector("#tables");
  const filter = dataArray.filter((el) => el["cards"] == number).sort((a, b) => a["turns"] - b["turns"]);

  let htmltypes = "";
  filter.map((element, index) => {
    htmltypes += `
        <tr>
          <td>${index}<sup>e</sup></td>
          <td>${element["name"]}</td>
          <td>${element["date_played"]} </td>
          <td>${element["turns"]}</td>
          <td>${element["time_spend"]} </td>
        </tr>
        `;
  });

  fameHall.innerHTML = `                
  <tr>
  <th><b>rang:</b></th>
  <th><b>naam:</b></th>
  <th><b>datum:</b></th>
  <th><b>aantal beurten:</b></th>
  <th><b>tijdsduur:</b></th>
  </tr>
  ${htmltypes}
  `;

  fameHall.querySelectorAll("tr").forEach((row) => {
    clicker(row, tables);
  });
}

function fillDropDown(uniqueCards, dropdown) {
  uniqueCards.forEach((el) => {
    let option = document.createElement("option");
    option.value = el;
    option.text = el;
    dropdown.add(option);
  });
}

function getData() {
  return fetch("./scores.json")
    .then((response) => response.json())
    .then((data) => data.gegevens)
    .catch((error) => console.error(error));
}
