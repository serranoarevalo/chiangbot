const axios = require("axios"),
  secrets = require("../keys.secret");

const { TOKEN } = secrets;

const getUserProfile = id =>
  axios.get(
    `https://graph.facebook.com/v2.6/${id}?fields=first_name,last_name,profile_pic&access_token=${TOKEN}`
  );

const markSeen = id =>
  axios.post(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${TOKEN}`,
    {
      recipient: {
        id
      },
      sender_action: "mark_seen"
    }
  );

const typingOn = id =>
  axios.post(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${TOKEN}`,
    {
      recipient: {
        id
      },
      sender_action: "typing_on"
    }
  );

const typingOff = id =>
  axios.post(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${TOKEN}`,
    {
      recipient: {
        id
      },
      sender_action: "typing_off"
    }
  );

module.exports = {
  getUserProfile,
  typingOn,
  typingOff,
  markSeen
};
