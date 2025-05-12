import User from "../models/User";

const adjectives = [
  "Happy",
  "Cool",
  "Brave",
  "Clever",
  "Witty",
  "Mighty",
  "Chill",
  "Lucky",
  "Swift",
  "Sneaky",
  "Fuzzy",
  "Nimble",
  "Gentle",
  "Quirky",
];

const nouns = [
  "Fox",
  "Otter",
  "Tiger",
  "Panda",
  "Bear",
  "Falcon",
  "Koala",
  "Eagle",
  "Lynx",
  "Turtle",
  "Wolf",
  "Cat",
  "Hawk",
  "Badger",
  "Cheetah",
];
export const getRandomUsername = async () => {
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(1 + Math.random() * 100);

    const username = `${randomAdjective}${randomNoun}${randomNumber}`;
    const exists = await User.find({ username: username });

    if (exists.length == 0) {
      return username;
    }
  }

  // fallback in case above fails
  const fallbackAnimal = nouns[Math.floor(Math.random() * nouns.length)];
  const fallbackNumber = Math.floor(Math.random() * 9000);
  return `Anonymous${fallbackAnimal}${fallbackNumber}`;
};
