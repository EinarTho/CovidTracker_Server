const findMatchingEntries = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        return true;
      }
    }
  }
  return false;
};
console.log(findMatchingEntries([1, 2], [1, 4]));
console.log(new Date().getHours() + new Date().getMinutes() / 60);

module.exports.findMatchingEntries = findMatchingEntries;
