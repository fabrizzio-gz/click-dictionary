const addStyle = () => {
  const style = document.createElement("style");
  style.id = "dict-style";
  style.insertAdjacentHTML(
    "afterbegin",
    `
.dict-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dict-definition {
  position: absolute;
  box-sizing: border-box;
  width: 300px;
  max-height: 220px;
  overflow: scroll;
  border: solid black;
  border-radius: 0.25rem;
  padding: 0.5rem;
  background-color: rgb(255, 255, 255);
}

.dict-speech-part {
  color: #404040;
  font-style: italic;
}

.direction-button,
.close-button {
  float: right;
  width: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
}

.direction-button-left {
  float: left;
}

.direction-button:hover,
.close-button:hover {
  background-color: black;
  color: white;
}
`
  );
  document.head.appendChild(style);
};

addStyle();

class Definition {
  static defW = 300; //px
  static defH = 220; //px
  static defCount = 0;
  static activeDefinitions = new Map();

  constructor(wordSearched) {
    this.id = Definition.defCount++;
    // console.log(this.id);

    /* Background is used to detect clicks out
     * of the definition box.
     * z-index is set to click the most recent
     * definition background first and close
     * them in order. */
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div id=dict-background-${this.id}><div>`
    );
    this.background = document.getElementById(`dict-background-${this.id}`);
    this.background.classList.add("dict-background");
    this.background.style.zIndex = Definition.defCount.toString();
    this.background.addEventListener("click", () => this.remove());

    this.definition = document.createElement("div");
    this.definition.classList.add("dict-definition");
    this.definition.style.zIndex = Definition.defCount.toString();

    this.closeButton = document.createElement("span");
    this.closeButton.classList.add("close-button");
    this.closeButton.insertAdjacentHTML("afterbegin", "&times");
    this.closeButton.addEventListener("click", () => this.remove());

    this.dictWord = document.createElement("h2");
    this.dictSpeechPart = document.createElement("span");
    this.dictSpeechPart.classList.add("dict-speech-part");
    this.dictMeaning = document.createElement("p");

    this.rightButton = document.createElement("span");
    this.rightButton.classList.add("direction-button");
    this.rightButton.insertAdjacentHTML("afterbegin", ">");
    this.rightButton.addEventListener("click", () => this.nextDefinition());

    this.leftButton = document.createElement("span");
    this.leftButton.classList.add("direction-button");
    this.leftButton.classList.add("direction-button-left");
    this.leftButton.insertAdjacentHTML("afterbegin", "<");
    this.leftButton.addEventListener("click", () => this.previousDefinition());

    this.definition.appendChild(this.closeButton);
    this.definition.appendChild(this.dictWord);
    this.definition.appendChild(this.dictSpeechPart);
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
      this.dictWord.appendChild(document.createTextNode(word));
      this.meanings = meanings;
      console.log(this.meanings);
      this.index = 0;
      this.addArrows(this.index);
      this.writeMeaning(this.index);
    } catch (error) {
      this.dictWord.appendChild(document.createTextNode(wordSearched));
      this.dictMeaning.appendChild(
        document.createTextNode("No definitions found.")
      );
    }
  }

  addArrows(index) {
    // Add left button
    if (this.index > 0) this.definition.appendChild(this.leftButton);
    else if (this.definition.contains(this.leftButton))
      this.definition.removeChild(this.leftButton);

    // Add right button
    if (this.meanings.length > 1 && index < this.meanings.length - 1) {
      this.definition.appendChild(this.rightButton);
    } else if (index > 0 && this.definition.contains(this.rightButton))
      this.definition.removeChild(this.rightButton);
  }

  writeMeaning(index) {
    let meaning = this.meanings[index];
    let { partOfSpeech, definitions } = meaning;

    // Remove previous contents, if any
    if (this.dictSpeechPart.firstChild)
      this.dictSpeechPart.removeChild(this.dictSpeechPart.firstChild);
    if (this.dictMeaning.firstChild)
      this.dictMeaning.removeChild(this.dictMeaning.firstChild);

    this.dictSpeechPart.appendChild(
      document.createTextNode("(" + partOfSpeech + ")")
    );
    this.dictMeaning.appendChild(
      document.createTextNode(definitions[0].definition)
    );
  }

  setPosition(textPosition) {
    const { top, right, bottom, left } = textPosition;
    // console.log("bottom: ", bottom);
    // console.log("top: ", top);
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    // // console.log("Sizes: ", vw, vh);

    this.definition.style.left =
      (right + Definition.defW < vw ? right : left - Definition.defW) + "px";

    if (bottom + Definition.defH < vh)
      this.definition.style.top = window.scrollY + bottom + "px";
    else this.definition.style.bottom = vh - top - window.scrollY + "px";
  }

  nextDefinition() {
    this.index = Math.min(this.index + 1, this.meanings.length - 1);
    this.addArrows(this.index);
    this.writeMeaning(this.index);
  }

  previousDefinition() {
    this.index = Math.max(this.index - 1, 0);
    this.addArrows(this.index);
    this.writeMeaning(this.index);
  }

  add() {
    // // console.log("adding");
    Definition.activeDefinitions.set(this.id, this.definition);
    document.body.appendChild(this.definition);
  }

  remove() {
    // // console.log("removing");
    Definition.activeDefinitions.delete(this.id);
    this.definition.remove();
    this.background.remove();
  }
}

document.addEventListener("dblclick", async () => {
  // debugger;
  const text = window.getSelection();
  const textString = text.toString();
  if (textString) {
    const textPosition = text.getRangeAt(0).getBoundingClientRect();
    // console.log(textPosition);
    const definition = new Definition(textString);
    await definition.writeDefinitionContent(textString);
    definition.setPosition(textPosition);
    definition.add();
  }
});

document.onkeydown = (event) => {
  if (event.keyCode == 27) {
    // console.log("Pressed ESC");
    // value == this.definition
    Definition.activeDefinitions.forEach((value) => value.remove());
  }
};

window.onscroll = (event) => {
  Definition.activeDefinitions.forEach((value) => value.remove());
};
