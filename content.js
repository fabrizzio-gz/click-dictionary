async function getMeaning() {
  let response = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en_US/hello"
  );
  // .then((response) => response.json())
  // .then((data) => console.log(data));
  let body = await response.json();
  body = body[0];
  let { word, meanings } = body;
  console.log(word);
  let meaning = meanings[0];
  let { partOfSpeech, definitions } = meaning;
  console.log(partOfSpeech);
  console.log(definitions[0].definition);
}

document.addEventListener("dblclick", async function myfunction() {
  let text = window.getSelection();
  let textPosition = text.getRangeAt(0).getBoundingClientRect();
  console.log(textPosition);
  let { bottom, right } = textPosition;
  bottom = Math.round(bottom);
  right = Math.round(right);
  console.log("Positions are", bottom, right);
  await getMeaning(text.toString());
  const definition = document.getElementById("dictDefinition");
  definition.style.setProperty("--position-x", right);
  definition.style.setProperty("--position-y", bottom);
  definition.style.setProperty("--modal-visibility", "visible");
});
