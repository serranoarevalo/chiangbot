const request = require("request"),
  axios = require("axios"),
  secrets = require("../keys.secret");

const { TOKEN } = secrets;

const sendMessage = (sender, text) => {
  let messageData = { text };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: TOKEN },
      method: "POST",
      json: {
        recipient: {
          id: sender
        },
        message: messageData
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(`Error message ${error}`);
      } else if (response.body.error) {
        console.log(`Error ${JSON.stringify(response.body.error)}`);
      }
    }
  );
};

const sendMessageWithOptions = (id, message, buttons) => {
  axios.post(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${TOKEN}`,
    {
      recipient: {
        id
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: message,
            buttons: buttons
          }
        }
      }
    }
  );
};

module.exports = {
  sendMessageWithOptions,
  sendMessage
};
