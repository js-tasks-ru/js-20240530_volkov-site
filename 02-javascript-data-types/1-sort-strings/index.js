/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArray = [...arr];
  const localeRules = ['ru-RU-u-kf-upper', 'en-US-u-kf-upper'];

  if (param === 'desc') return newArray.sort((a, b) => b.localeCompare(a, localeRules));

  return newArray.sort((a, b) => a.localeCompare(b, localeRules));
}
