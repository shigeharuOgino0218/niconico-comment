const niconicoComment = {
  methods: {
    sendMsgCurrentPage: (msg) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
      });
    },
  },
  isWSConnected: false,
};

chrome.runtime.onMessage.addListener((msg) => {
  return Promise.resolve(msg).then((val) => {
    if (val.host) {
      if (niconicoComment.isWSConnected) {
        niconicoComment.methods.sendMsgCurrentPage({ alert: "接続成功" });
        return;
      }

      const ws = new WebSocket(val.host);

      // 接続した際のコールバック
      ws.onopen = () => {
        niconicoComment.isWSConnected = true;
        niconicoComment.methods.sendMsgCurrentPage({ alert: "接続成功" });
      };

      ws.onclose = () => {
        niconicoComment.isWSConnected = false;
      };

      // WebSocket Server からメッセージを受け取ったときに実行される.
      ws.onmessage = ({ data }) => {
        niconicoComment.methods.sendMsgCurrentPage({ msg: data });
      };
    }
  });
});
