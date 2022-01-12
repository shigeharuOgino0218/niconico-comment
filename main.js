let HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);

// 接続した際のコールバック
ws.onopen = () => {
  console.log("WebSocket 接続成功");
};

ws.onmessage = ({ data }) => {
  const comment = JSON.parse(data);
  $("#history").prepend(`<p class="text-xs text-gray-400">${comment.msg}</p>`);
};

// コメントの連打がやりにくいのでダブルタップでのズームを無効化.
document.addEventListener("dblclick", (e) => e.preventDefault(), {
  passive: false,
});

let comment = {
  msg: "",
  color: "#ffffff",
};

$(() => {
  $("#submit").on("click", () => {
    const msg = $("#comment").val();
    comment.msg = msg;
    ws.send(JSON.stringify(comment));
  });

  $(".comment-btn").on("click", (e) => {
    const msg = $(e.currentTarget).text();
    comment.msg = msg;
    ws.send(JSON.stringify(comment));
  });

  $("#color").on("input", (e) => {
    const color = e.currentTarget.value;
    updateColor(color);
  });

  $(".color-btn").on("click", (e) => {
    const color = rgb2hex($(e.currentTarget).css("background-color"));
    updateColor(color);
  });
});

/** ----------------------------------------
 * functions
 ---------------------------------------- */

function hex(x) {
  return ("0" + parseInt(x).toString(16)).slice(-2);
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function updateColor(color) {
  $("#colorPreview").css("background-color", color);
  $("#colorName").text(color.toUpperCase());
  comment.color = color;
}
