const constants = require("./constants");

const { PLAN_TRIP, PLANE_TICKET } = constants;

const welcomeButtons = [
  {
    type: "postback",
    title: "Plan trip (✈️ + 🏨)",
    payload: PLAN_TRIP
  },
  {
    type: "postback",
    title: "Get plane ticket ✈️",
    payload: PLANE_TICKET
  }
];

module.exports = {
  welcomeButtons
};
