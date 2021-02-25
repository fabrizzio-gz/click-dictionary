const definition = document.getElementById("dict-definition");
let visible = false;

async function getMeaning(wordSearched) {
  let response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en_US/${wordSearched}`
  );
  // .then((response) => response.json())
  // .then((data) => console.log(data));
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
}

const toggleVisibility = () => {
  if (visible) definition.style.setProperty("--modal-visibility", "hidden");
  else definition.style.setProperty("--modal-visibility", "visible");

  visible = !visible;
};

const makeVisible = () => {
  definition.style.setProperty("--modal-visibility", "visible");
  visible = true;
};

document.addEventListener("dblclick", async function myfunction() {
  let text = window.getSelection();
  let textPosition = text.getRangeAt(0).getBoundingClientRect();
  let { bottom, right } = textPosition;
  bottom = Math.round(bottom);
  right = Math.round(right);
  // console.log("Positions are", bottom, right);
  await getMeaning(text.toString());
  definition.style.setProperty("--position-x", right);
  definition.style.setProperty("--position-y", bottom);
  makeVisible();
});

const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", toggleVisibility);
