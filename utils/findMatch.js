const findMatchingEntries = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      console.log(arr1[i].room, arr2[j].room);
      if (arr1[i].room === arr2[j].room && arr1[i].date === arr2[j].date) {
        return true;
      }
    }
  }
  return false;
};
module.exports = findMatchingEntries;
