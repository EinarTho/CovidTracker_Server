const roomArrayValidator = roomArray => {
  console.log(roomArray);
  for (let i = 0; i < roomArray.length; i++) {
    if (!roomArray[i].floor || !roomArray[i].roomId || !roomArray[i].name) {
      return false;
    }
  }
  return true;
};

module.exports = roomArrayValidator;
