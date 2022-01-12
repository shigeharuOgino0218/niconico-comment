const niconicoComment = {
  methods: {
    getUniqueId: () => {
      return (
        new Date().getTime().toString(16) +
        Math.floor(1000 * Math.random()).toString(16)
      );
    },
    showMsg: (comment) => {
      /**
       * できるだけレーンが重ならないようにする.
       * 全てがアクティブなレーンになった場合, レーンを解放する.
       */
      const lanes = niconicoComment.lanes;
      const lane = lanes[Math.floor(Math.random() * lanes.length)];

      if (lane.active) {
        if (!lanes.filter((item) => !item.active).length) {
          lanes.forEach((item) => item.active = false);
        }
        niconicoComment.methods.showMsg(comment);
        return;
      }

      const uid = niconicoComment.methods.getUniqueId();
      const html = `<p class="niconicoComment ${uid}" style="color:${comment.color}">${comment.msg}</p>`;

      $("body").append(html);

      const $currentComment = $(`.${uid}`);

      $currentComment.css("top", lane.position + "px");
      lane.active = true;

      setTimeout(() => {
        $currentComment.remove();
        lane.active = false;
      }, 20000);
    },
  },
  fontSize: 32,
  lanes: [],
  googleFontHtmls: [
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@800&display=swap" rel="stylesheet">`,
  ],
};

/**
 * コメントが流れるレーンを用意する.
 */
niconicoComment.methods.createCommentLane = () => {
  const self = niconicoComment;
  const length = Math.floor(window.innerHeight / self.fontSize);
  const lanes = new Array(length);

  for (let i = 0; i < length; i++) {
    lanes[i] = { position: self.fontSize * i, active: false };
  }

  self.lanes = lanes;
  z;
};

$(() => {
  niconicoComment.methods.createCommentLane();

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
