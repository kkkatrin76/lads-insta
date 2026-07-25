// The game state
export const initialState = {
  currentPost: "pizza",
  currentStep: "intro",

  visibleComments: [],

  selectedChoices: [],

  flags: {},

  stats: {
    reputation: 0
  },

  relationships: {},

  inventory: [],

  scenePosts: {},

  playerProfile: {
    name: "You",
    image: "/icons/you.png"
  },

  customUsernames: {}
};