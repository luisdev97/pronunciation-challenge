const { readFileSync, writeFileSync } = require("fs");
console.clear();
const FILE_PATH = "./sample.json";
const RESULT_PATH = "./result.txt";
const ENCODE_FORMAT = "utf8";

const vowels = "aeiouAEIOU".split("");

let json = JSON.parse(readFileSync(FILE_PATH, ENCODE_FORMAT));
console.log(json)
let array = Array.from(new Set(json.slice(0)));
let pronouncedArray = [];
let outputObject = {};

function checkIsVowel(char) {
  return vowels.includes(char);
}

function endVowel(word) {
  const match = word.match(/[aeiou](?!.*[aeiou])/i);
  return match?.index;
}

pronouncedArray = array.map((word, index) => {
  let splittedWord = word.split("");

  const lastVowelIndex = endVowel(word);
  const firstConsonant = splittedWord.find((c) => !checkIsVowel(c));

  splittedWord.forEach((char, index) => {
    if (index > lastVowelIndex) {
      splittedWord[index] = "";
    } else {
      if (!checkIsVowel(char) && char !== "") {
        splittedWord[index] = firstConsonant;
        if (!checkIsVowel(word[index + 1])) {
          splittedWord[index + 1] = "";
        }
      }

      if (checkIsVowel(char) && checkIsVowel(splittedWord[index + 1])) {
        splittedWord[index] = splittedWord[index + 1];
        splittedWord[index + 1] = "";
      }
    }
  });

  if (checkIsVowel(splittedWord[0])) {
    splittedWord.unshift(firstConsonant);
  }

  return splittedWord.join("");
});

array.forEach((word, index) => {
  const keyTranslated = pronouncedArray[index];
  const existingKey = outputObject.hasOwnProperty(word);

  if (!existingKey) {
    const samePronunciationCount =
      pronouncedArray.filter((w) => w === keyTranslated).length - 1;
    outputObject[word] = samePronunciationCount;
  }

  const samePronunciationCount =
    pronouncedArray.filter((w) => w === word).length - 1;
});

let textToPrint = "";

const orderedKeys = Object.keys(outputObject).sort();
orderedKeys.forEach((key) => {
  textToPrint += `${key} ${outputObject[key]} \n`;
});

writeFileSync(RESULT_PATH, textToPrint, "utf-8");
