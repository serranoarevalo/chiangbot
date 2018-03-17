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

const getFlights = () => {
  const today = new Date();
  const requiredDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 10
  );
  const days = requiredDate.getUTCDate();
  const month = requiredDate.getUTCMonth() + 1;
  const year = requiredDate.getUTCFullYear();
  const dateString = `${days}%2F${month < 10 ? "0" + month : month}%2F${year}`;
  return axios.get(
    `https://api.skypicker.com/flights?flyFrom=ICN&to=CNX&typeFlight=round&curr=KRW&dateTo=${dateString}`
  );
};

module.exports = {
  getUserProfile,
  typingOn,
  typingOff,
  markSeen,
  getFlights
};
