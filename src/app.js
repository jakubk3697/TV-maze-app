import { getShowsByKey, getShowById } from "./requests.js";
import { mapListToDOMElements, createDOMElem, disableScrolling, enableScrolling } from "./domInteractions.js";

class TvMaze {
  constructor() {
    this.viewElems = {};
    this.scrollX;
    this.scrollY;
    this.showNameButtons = {};
    this.selectedName = "john doe";
    this.initializeApp();
  }

  initializeApp = () => {
    this.connectDOMElements();
    this.setupListeners();
    this.fetchAndDisplayShows();
  };

  connectDOMElements = () => {
    const listOfIds = Array.from(document.querySelectorAll("[id]")).map((elem) => elem.id);
    const listOfShowNames = Array.from(document.querySelectorAll("[data-show-name]")).map((elem) => elem.dataset.showName);

    this.viewElems = mapListToDOMElements(listOfIds, "id");
    this.showNameButtons = mapListToDOMElements(listOfShowNames, "data-show-name");
  };

  setupListeners = () => {
    Object.keys(this.showNameButtons).forEach((showName) => {
      this.showNameButtons[showName].addEventListener("click", this.setCurrentNameFilter);
    });
    this.viewElems.btnSearch.addEventListener("click", this.setCurrentNameFilter);
    this.viewElems.inpSearch.addEventListener("keyup", this.setCurrentNameFilter);
  };

  setCurrentNameFilter = (e) => {
    if (e.type === "click" || e.key === "Enter") {
      if (e.target.classList.contains("dropdown-item")) {
        this.selectedName = e.target.dataset.showName;
        console.log(this.selectedName);
        this.fetchAndDisplayShows();
      } else {
        this.selectedName = this.viewElems.inpSearch.value;
        this.fetchAndDisplayShows();
      }
    }
  };

  fetchAndDisplayShows = () => {
    getShowsByKey(this.selectedName).then((shows) => this.renderCardsOnList(shows));
  };

  renderCardsOnList = (shows) => {
    Array.from(document.querySelectorAll("[data-show-id]")).forEach((btn) => btn.removeEventListener("click", this.openDetailsView));
    this.viewElems.showsWrapper.innerHTML = "";

    for (const { show } of shows) {
      const card = this.createShowCard(show);
      this.viewElems.showsWrapper.appendChild(card);
    }
  };

  openDetailsView = (e) => {
    const { showId } = e.target.dataset;
    getShowById(showId).then((show) => {
      const card = this.createShowCard(show, true);
      this.viewElems.showPreview.appendChild(card);
      this.viewElems.showPreview.style.display = "block";
    });
  };

  closeDetailsView = (e) => {
    const { showId } = e.target.dataset;
    const closeBtn = document.querySelector(`[id="showPreview"] [data-show-id="${showId}"]`);
    closeBtn.removeEventListener("click", this.closeDetailsView);
    enableScrolling();
    this.viewElems.showPreview.style.display = "none";
    while (this.viewElems.showPreview.firstChild) this.viewElems.showPreview.removeChild(this.viewElems.showPreview.firstChild);
  };

  createShowCard = (show, isDetailed) => {
    const divCard = createDOMElem("div", "card");
    const divCardBody = createDOMElem("div", "card-body");
    const h5 = createDOMElem("h5", "card-title", show.name);
    const box = createDOMElem("div", "box");
    let btn;
    let img, p;

    if (show.image) {
      if (isDetailed) {
        img = createDOMElem("div", "card-preview-bg");
        img.style.backgroundImage = `url(${show.image.original})`;
      } else {
        img = createDOMElem("img", "card-img-top", null, show.image.medium);
      }
    } else {
      img = createDOMElem("div", "card-preview-bg", null, null, "https://via.placeholder.com/210x295");
    }

    if (show.summary) {
      const result = show.summary.replace(/<[^>]*>/g, "");
      if (isDetailed) {
        p = createDOMElem("p", "card-text", result);
      } else {
        p = createDOMElem("p", "card-text", `${result.slice(0, 80)}...`);
      }
    } else {
      p = createDOMElem("p", "card-text", "there is no summary for that show yet.");
    }

    if (isDetailed) {
      btn = createDOMElem("button", "btn btn-danger", "Show details");
      btn.textContent = "Close details";
      btn.addEventListener("click", this.closeDetailsView);
      disableScrolling();
    } else {
      btn = createDOMElem("button", "btn btn-primary", "Show details");
      btn.textContent = "Show details";
      btn.addEventListener("click", this.openDetailsView);
    }
    btn.dataset.showId = show.id;
    divCard.appendChild(divCardBody);
    divCardBody.appendChild(img);
    box.appendChild(h5);
    box.appendChild(p);
    box.appendChild(btn);
    divCardBody.appendChild(box);

    return divCard;
  };
}

document.addEventListener("DOMContentLoaded", new TvMaze());
