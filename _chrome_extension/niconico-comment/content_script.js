const niconicoComment = {
  methods: {
    getUniqueId: () => {
      return (
        new Date().getTime().toString(16) +
        Math.floor(1000 * Math.random()).toString(16)
      );
    },
    showMsg: (comment) => {
      const uid = niconicoComment.methods.getUniqueId();
      const html = `<p class="niconicoComment ${uid}" style="color:${comment.color}">${comment.msg}</p>`;

      $("body").append(html);

      const $currentComment = $(`.${uid}`);
      $currentComment.css("top", Math.random() * window.innerHeight + "px");
      setTimeout(() => {
        $currentComment.remove();
      }, 20000);
    },
  },
  googleFontHtmls: [
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@800&display=swap" rel="stylesheet">`,
  ],
};

$(() => {
  niconicoComment.googleFontHtmls.forEach((html) => {
    $("body").append(html);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  return Promise.resolve(msg).then((val) => {
    if (val.msg) {
      const comment = JSON.parse(val.msg);
      niconicoComment.methods.showMsg(comment);
    } else if (val.alert) {
      alert(val.alert);
    }
  });
});
