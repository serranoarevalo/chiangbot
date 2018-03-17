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
const { getUserProfile, markSeen, typingOff, typingOn, getFlights } = utils;

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
                  sendMessage(
                    senderId,
                    "I can only buy tickets with one 10 days in advance so I'm gonna show a list of tickets with their price"
                  );
                  typingOn(senderId);
                  const flightReq = await getFlights();
                  typingOff(senderId);
                  const flightData = "";
                  const { data: { data } } = flightReq;
                  data.forEach(flight => {
                    const departureTime = flight.dTimeUTC;
                    let date = new Date();
                    date = date.setSeconds(departureTime);
                    date = `${date.getUTCDate()}/${date.getUTCMonth()}`;
                    const string = `${date} \n`;
                    flightData.concat(string);
                    console.log(flight);
                  });
                  sendMessage(senderId, flightData);
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
