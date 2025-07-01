const badWords = require("naughty-words");

export function moderateText(text: string): string {
  const regex = new RegExp(`\\b(${badWords.es.join("|")})\\b`, "gi");
  return text.replace(regex, "[redacted]");
}
