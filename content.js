// const definition = document.getElementById("dict-definition");
let visible = false;
/*
const defW = 250; //px
const defH = 220; //px
*/

class Definition {
  static defW = 250; //px
  static defH = 220; //px
  static defCount = 0;
  static activeDefinitions = new Map();

  constructor(wordSearched) {
    this.id = Definition.defCount++;
    console.log(this.id);

    this.definition = document.createElement("div");
    this.definition.classList.add("dict-definition");

    this.closeButton = document.createElement("span");
    this.closeButton.classList.add("close-button");
    this.closeButton.insertAdjacentHTML("afterbegin", "&times");
    this.closeButton.addEventListener("click", () => this.remove());

    this.dictWord = document.createElement("h2");
    this.dictMeaning = document.createElement("p");

    this.definition.appendChild(this.closeButton);
    this.definition.appendChild(this.dictWord);
    this.definition.appendChild(this.dictMeaning);
  }

  async writeDefinitionContent(wordSearched) {
    try {
      let response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${wordSearched}`
      );
      let body = await response.json();
      body = body[0];
      let { word, meanings } = body;
      console.log(word);
      let meaning = meanings[0];
      let { partOfSpeech, definitions } = meaning;

      // document.getElementById("dictWord").textContent = word;
      this.dictWord.appendChild(document.createTextNode(word));
      // document.getElementById("dictMeaning").textContent =
      //  definitions[0].definition;
      this.dictMeaning.appendChild(
        document.createTextNode(definitions[0].definition)
      );
      console.log(partOfSpeech);
      console.log(definitions[0].definition);
    } catch (error) {
      // document.getElementById("dictWord").textContent = wordSearched;
      this.dictWord.appendChild(document.createTextNode(wordSearched));
      // document.getElementById("dictMeaning").textContent = "No definitions found.";
      this.dictMeaning.appendChild(
        document.createTextNode("No definitions found.")
      );
    }
  }

  setPosition(textPosition) {
    const { top, right, bottom, left } = textPosition;
    console.log("bottom: ", bottom);
    console.log("top: ", top);
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    // console.log("Sizes: ", vw, vh);

    this.definition.style.left =
      (right + Definition.defW < vw ? right : left - Definition.defW) + "px";

    if (bottom + Definition.defH < vh)
      this.definition.style.top = bottom + "px";
    else this.definition.style.bottom = vh - top + "px";
  }

  add() {
    console.log("adding");
    Definition.activeDefinitions.set(this.id, this.definition);
    document.body.appendChild(this.definition);
  }

  remove() {
    console.log("removing");
    Definition.activeDefinitions.delete(this.id);
    this.definition.remove();
  }
}

document.addEventListener("dblclick", async function myfunction() {
  let text = window.getSelection();

  if (text.toString()) {
    const textPosition = text.getRangeAt(0).getBoundingClientRect();
    text = text.toString();
    console.log(textPosition);
    const definition = new Definition(text);
    await definition.writeDefinitionContent(text);
    definition.setPosition(textPosition);
    definition.add();
  }
});

document.addEventListener("click", () => console.log("click"));
