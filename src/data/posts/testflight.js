export const posts = {
  post1: {
    user: "sylus",
    image: "s01.jpeg",
    caption: "I see two kittens.",
    replyDelayMs: 2000,
    initialState: {
      visibleComments: ["c1"],
      currentStep: "reply1"
    },
    
    comments: {
      c1: {
        user: "luke",
        text: "Catception....."
      },
      c2: {
        user: "sylus",
        replyTo: "me",
        text: "Good girl."
      },
      c3: {
        user: "luke",
        text: "I regret commenting on this post. I regret it so much."
      },
      c4: {
        user: "sylus",
        replyTo: "me",
        text: "If you wanted to spar you couldve just said so."
      },
    },

    dialogue: {
      reply1: {
        choices: [{
          text: "meow",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c2"
          }, {
            type: "SHOW_COMMENT",
            comment: "c3"
          }]
        }, {
          text: "i'm going to scratch your eyes out",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c4"
          }]
        }]
      },
    }
  },

  post2: {
    user: "valko",
    image: "v01.jpeg",
    caption: "New record today! >:3",
    replyDelayMs: 2000,
    initialState: {
      visibleComments: ["c1"],
      currentStep: "reply1"
    },

    comments: {
      c1: {
        user: "caleb",
        text: "💪🏻💪🏻💪🏻"
      },
      c2: {
        user: "valko",
        replyTo: "me",
        text: "Come to the gym then pup"
      },
      c3: {
        user: "valko",
        replyTo: "me",
        text: "Try to not drool baby"
      },
      c4: {
        user: "valko",
        text: "I'm not teasing, come to the gym and let me bench ya :3"
      },
    },

    dialogue: {
      reply1: {
        choices: [{
          text: "bench me next",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c2"
          }, {
            type: "SET_STEP",
            step: "reply2"
          }]
        }, {
          text: "holy shit",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c3"
          }]
        }]
      },

      reply2: {
        choices: [{
          text: "don't tease me!!!!",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c4"
          }]
        },

        {
          text: "coming over. where are you?",

          events: [{
            type: "ADD_POST",
            post: {
              user: "valko",
              caption: ">:3",
              image: "v02.jpeg",
              initialState: {
                visibleComments: ["c1"],
                currentStep: ""
              },

              comments: {
                c1: {
                  user: "me",
                  text: "🙈"
                },
              }
            }
          }, {
            type: "SHOW_NOTIFICATION",
            text: "New post added to the main feed!"
          }
        ]}
      ]}
    }
  },

  post3: {
    user: "zayne",
    caption: "What does it mean when your girlfriend asks you to demonstrate how to tie knots?",
    replyDelayMs: 2000,
    initialState: {
      visibleComments: ["c1", "c2"],
      currentStep: "reply1"
    },
    
    comments: {
      c1: {
        user: "valko",
        text: "Buddy..............."
      },
      c2: {
        user: "greyson",
        text: "Oh................."
      },
      c3: {
        user: "zayne",
        replyTo: "me",
        text: "For some reason, I feel insulted."
      }
    },

    dialogue: {
      reply1: {
        choices: [{
          text: "everyone, this is what i must live with",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c3"
          }]
        }]
      }
    }
  },

  post4: {
    user: "valko",
    caption: "I miss ${name} ;w;",
    replyDelayMs: 2000,
    initialState: {
      visibleComments: [],
      currentStep: "reply1"
    },
    
    comments: {
      c1: {
        user: "valko",
        replyTo: "me",
        text: "🥹"
      },
      c2: {
        user: "valko",
        replyTo: "me",
        text: "I have limited edition chocolates for ya!!"
      },
      c3: {
        user: "valko",
        replyTo: "me",
        text: "Its not a bribe if ya would've gotten them either way, pancake ❤️"
      },
      c4: {
        user: "valko",
        replyTo: "me",
        text: "Ily more, hurry and come soon ❤️"
      },
      c5: {
        user: "valko",
        replyTo: "me",
        text: "More chocolate for us!!! 🙌"
      },
      c6: {
        user: "valko",
        replyTo: "me",
        text: "Ok"
      },
      c7: {
        user: "valko",
        replyTo: "me",
        text: "Then I'm coming over!! Be there in 20 mins"
      },
    },

    dialogue: {
      reply1: {
        choices: [{
          text: "NO DONT CRY IM COMING OVER ASAP RN",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c1"
          }, {
            type: "SHOW_COMMENT",
            comment: "c2"
          }, {
            type: "SET_STEP",
            step: "reply2"
          }]
        }, {
          text: "baby i'm sorry ;w; work is so busy rn",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c6"
          }, {
            type: "SHOW_COMMENT",
            comment: "c7"
          }]
        }]
      },

      reply2: {
        choices: [{
          text: "you didn't have to bribe me lol",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c3"
          }]
        }, {
          text: "ily ❤️",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c4"
          }]
        }, {
          text: "LOL i also got you some 🍫",

          events: [{
            type: "SHOW_COMMENT",
            comment: "c5"
          }]
        }]
      }
    }
  },
};