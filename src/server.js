const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  messages = require("./messages"),
  constants = require("./constants"),
  utils = require("./utils");

const { PLAN_TRIP, PLANE_TICKET } = constants;
const { sendMessage, sendWelcome } = messages;
const { getUserProfile, markSeen, typingOff, typingOn } = utils;

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
              switch (postback.payload) {
                case "Start":
                  typingOn(senderId);
                  sendMessage(
                    senderId,
                    `Hello ${
                      userInfo.first_name
                    } I'm Chaingbot, your personal concierge for your next trip to Chiang Mai,`
                  );
                  setTimeout(() => {
                    sendWelcome(senderId);
                    typingOff(senderId);
                  }, 1500);
                case PLAN_TRIP:
                  sendMessage(senderId, "");
              }
            } else if ("message" in webhook_event) {
              console.log("talking to", userInfo.first_name);
              typingOff(senderId);
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
