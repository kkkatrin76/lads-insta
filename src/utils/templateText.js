export function applyNameTemplate(text, profileName = "You") {
  if (typeof text !== "string") {
    return "";
  }

  return text.split("${name}").join(profileName || "You");
}
