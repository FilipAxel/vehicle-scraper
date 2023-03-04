export const toPascalCase = (str) => {
  return `${str}`
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(
      /\s+(.)(\w*)/g,
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
    )
    .replace(/\w/, (s) => s.toUpperCase());
};

export const replaceSpecialCharacters = (str) => {
  let finalStr = '';

  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    switch (char) {
      case 'Ö':
        char = 'O';
        break;
      case 'Ä':
        char = 'A';
        break;
      case 'ö':
        char = 'o';
        break;
      case 'ä':
        char = 'a';
        break;
      case 'å':
        char = 'a';
        break;
      case 'Å':
        char = 'A';
        break;
      default:
        break;
    }

    finalStr += char;
  }

  return finalStr;
};

export const validateRegNr = (regnr) => {
  return regnr.match(/[a-zA-ZåäöÅÄÖ\d\s]{2,7}/g).length == 1;
};
