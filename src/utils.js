const axios = require("axios"),
  secrets = require("../keys.secret");

const { TOKEN, BITLY_TOKEN } = secrets;

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
  const dateString = `${days}%2F${month < 10 ? `0${month}` : month}%2F${year}`;
  return axios
    .get(
      `https://api.skypicker.com/flights?flyFrom=ICN&to=CNX&typeFlight=round&curr=KRW&dateTo=${dateString}&limit=10`
    )
    .catch(() => console.log("error"));
};

const shortenURL = async longURL => {
  return axios.get(
    `https://api-ssl.bitly.com/v3/shorten?access_token=${BITLY_TOKEN}&longUrl=${longURL}`
  );
};

module.exports = {
  getUserProfile,
  typingOn,
  typingOff,
  markSeen,
  getFlights,
  shortenURL
};
