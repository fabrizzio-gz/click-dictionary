const definition = document.getElementById("dict-definition");
let visible = false;
const defW = 250; //px
const defH = 220; //px

const toggleVisibility = () => {
  if (visible) definition.style.setProperty("--modal-visibility", "hidden");
  else definition.style.setProperty("--modal-visibility", "visible");

  visible = !visible;
};

const makeVisible = () => {
  definition.style.setProperty("--modal-visibility", "visible");
  visible = true;
};

const getPositionXY = (textPosition, element) => {
  const { top, right, bottom, left } = textPosition;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  console.log("Sizes: ", vw, vh);

  element.style.setProperty(
    "--position-left",
    right + defW < vw ? right : left - defW
  );
  element.style.setProperty(
    "--position-top",
    bottom + defH < vh ? bottom : top - element.offsetHeight
  );
};

async function getMeaning(wordSearched) {
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

    document.getElementById("dictWord").textContent = word;
    document.getElementById("dictMeaning").textContent =
      definitions[0].definition;
    console.log(partOfSpeech);
    console.log(definitions[0].definition);
  } catch (error) {
    document.getElementById("dictWord").textContent = wordSearched;
    document.getElementById("dictMeaning").textContent =
      "No definitions found.";
  }
}

document.addEventListener("dblclick", async function myfunction() {
  let text = window.getSelection();
  let textPosition = text.getRangeAt(0).getBoundingClientRect();
  console.log(textPosition);

  text = text.toString();
  if (text) {
    await getMeaning(text);
    getPositionXY(textPosition, definition);
    makeVisible();
  }
});

const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", toggleVisibility);
