const $webSocketServerUrlInput = document.querySelector("#input");
const $connect = document.querySelector("#connect");
const history = JSON.parse(localStorage.getItem("URL_HISTORY")) || [];

const $input = $("#input");
const $history = $("#history");

history.forEach((item) => {
  $history.append(`<li>${item}</li>`);
});

$history.find("li").on("click", (e) => {
  const val = $(e.currentTarget).text();
  $input.val(val);
});

$connect.addEventListener("click", () => {
  const HOST = $webSocketServerUrlInput.value;
  chrome.extension.sendMessage({ host: HOST });

  const array = [...new Set([...history, HOST.replace(/\s/g, "")])];
  localStorage.setItem("URL_HISTORY", JSON.stringify(array));
});

// ws://192.168.2.86:50000
