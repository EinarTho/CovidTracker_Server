const findMatchingEntries = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (
        arr1[i].date === arr2[j].date &&
        arr1[i].time === arr2[j].time &&
        arr1[i].id === arr2[j].id
      ) {
        return true;
      }
    }
  }
  return false;
};
module.exports = findMatchingEntries;
