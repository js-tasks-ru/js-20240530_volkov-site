/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return '';
  if (!size || string.length === 0) return string;

  let accumulator = 1;
  return string.split('').map((letter, index, array) => {
    if (letter !== array[index + 1]) { accumulator = 1; return letter; }
    if (letter === array[index + 1] && accumulator >= size) return '';
      
    accumulator++;
    return letter;
  }).join('');
}
