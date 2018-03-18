const express = require("express"),
  axios = require("axios"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  messages = require("./messages"),
  constants = require("./constants"),
  buttons = require("./buttons"),
  utils = require("./utils");

const { welcomeButtons } = buttons;
const { PLAN_TRIP, PLANE_TICKET } = constants;
const { sendMessageWithOptions, sendMessage } = messages;
const {
  getUserProfile,
  markSeen,
  typingOff,
  typingOn,
  getFlights,
  shortenURL
} = utils;

const app = express();

app.set("port", process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("combined"));

app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Chiangbot"));

app
  .route("/webhook")

  .get((req, res) => {
    const { query } = req;
    if (
      "hub.verify_token" in query &&
      query["hub.verify_token"] === "nomadcoders"
    ) {
      res.send(req.query["hub.challenge"]);
    } else {
      res.status(400).send("Wrong token");
    }
  })

  .post((req, res) => {
    const { body } = req;

    if (body.object === "page") {
      body.entry.forEach(async entry => {
        if ("messaging" in entry) {
          console.log(JSON.stringify(entry));
          let webhook_event = entry.messaging[0];
          if ("sender" in webhook_event) {
            let senderId = webhook_event.sender.id;
            markSeen(senderId);
            const userInfoRequest = await getUserProfile(senderId);
            const userInfo = userInfoRequest.data;
            if ("postback" in webhook_event) {
              const { postback } = webhook_event;
              typingOn(senderId);
              switch (postback.payload) {
                case "Start":
                  sendMessage(
                    senderId,
                    `Hello ${
                      userInfo.first_name
                    } I'm Chaingbot, your personal concierge for your next trip to Chiang Mai,`
                  );
                  setTimeout(() => {
                    sendMessageWithOptions(
                      senderId,
                      "How can I help you today?",
                      welcomeButtons
                    );
                    typingOff(senderId);
                  }, 1500);
                  break;
                case PLAN_TRIP:
                  sendMessage(senderId, "");
                  break;
                case PLANE_TICKET:
                  const flightReq = await getFlights();
                  const { data: { data } } = flightReq;
                  let flightData = "";
                  data.forEach(async flight => {
                    const departureTime = flight.dTimeUTC;

                    let date = new Date();
                    date.setSeconds(departureTime);
                    dateString = `${
                      date.getUTCDate() < 10
                        ? `0${date.getUTCDate()}`
                        : date.getUTCDate()
                    }/${
                      date.getUTCMonth() < 10
                        ? `0${date.getUTCMonth()}`
                        : date.getUTCMonth()
                    }`;
                    flightData =
                      flightData +
                      `ICN🇰🇷 -> CNX🇹🇭 ${dateString} 💵${
                        flight.conversion.KRW
                      } \n`;
                  });
                  console.log(flightData);
                  sendMessage(
                    senderId,
                    `I found the following flights \n${flightData}`
                  );
                  break;
              }
            } else if ("message" in webhook_event) {
              const dadReq = await axios.get("https://icanhazdadjoke.com/", {
                headers: { Accept: "application/json" }
              });
              typingOn(senderId);
              console.log(dadReq);
              typingOff(senderId);
              sendMessage(senderId, dadReq.data.joke);
            }
          }
        }
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  });

app.listen(app.get("port"), () => {
  console.log(`Running on port ${app.get("port")}`);
});
