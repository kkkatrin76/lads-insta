// Apply dialogue rules.

export function processEvents(state, events) {
  let next = {
    ...state,
    visibleComments: [...(state.visibleComments ?? [])],
    addedPosts: [...(state.addedPosts ?? [])],
  };

  for (const event of events) {
    switch (event.type) {
      case "SHOW_COMMENT":
        next.visibleComments.push(event.comment);
        break;

      case "SET_STEP":
        next.currentStep = event.step;
        break;

      case "ADD_POST":
        if (event.post) {
          next.addedPosts.push(event.post);
        }
        break;

      default:
        break;
    }
  }

  return next;
}