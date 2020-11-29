const validateRoomArray = roomArray => {
  for (let i = 0; i < roomArray.length; i++) {
    if (!roomArray[i].date || !roomArray[i].time || !roomArray[i].id) {
      return false;
    }
  }
  return true;
};

module.exports = validateRoomArray;
