/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return '';
  if (!size || string.length === 0) return string;

  let newString = '';
  let accumulator = 1;

  for (let i = 0; i < string.length; i++) {
    if (string[i] === string[i + 1] && accumulator >= size) continue;

    string[i] !== string[i + 1] ? accumulator = 1 : accumulator++;
    newString += string[i]; 
  }

  return newString;
}
