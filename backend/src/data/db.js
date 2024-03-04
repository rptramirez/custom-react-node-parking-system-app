let parkingData = {
    entryPoints: ['A', 'B', 'C'],
    parkingSlots: [
      [{ size: 'SP', vehicle: null }, { size: 'MP', vehicle: null }, { size: 'LP', vehicle: null }],
      [{ size: 'SP', vehicle: null }, { size: 'MP', vehicle: null }, { size: 'LP', vehicle: null }],
      [{ size: 'SP', vehicle: null }, { size: 'MP', vehicle: null }, { size: 'LP', vehicle: null }],
    ],
    parkingSizes: [0, 1, 2],
  };
  
  module.exports = {
    getParkingData: () => parkingData,
    updateParkingData: (newParkingData) => {
      parkingData = newParkingData;
    },
  };