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
  text = window.getSelection().toString();
  await getMeaning();
  const message = document.querySelector("#dictMessage");
  message.style.setProperty("--modal-visibility", "visible");
});
