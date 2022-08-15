"use strict";

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";

const DEFAULT_OPTIONS = { type: "alphanumeric", length: 4 };

function random(options = {}) {
  const { type, length, custom } = { ...DEFAULT_OPTIONS, ...options };

  if (length < 1) {
    throw new Error(`length cannot be under 1, your passed ${length}`);
  }

  let chars = custom ? custom : getChars(type);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += getRandomElement(chars);
  }

  return result;
}

function getChars(type) {
  switch (type) {
    case "numeric":
      return numbers;
    case "lower":
      return lowercase;
    case "upper":
      return uppercase;
    case "alpha":
      return lowercase + uppercase;
    case "alphanumeric":
    default:
      return lowercase + uppercase + numbers;
  }
}

function getRandomElement(string) {
  return string[Math.floor(Math.random() * string.length)];
}

module.exports = random;
