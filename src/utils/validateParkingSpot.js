
export default function validateParkingSpot(parkingSpot) {
  const validation = {
    valid: true,
    errors: []
  };

  // FIXME: protect from sql injection

  if (parkingSpot.type_id === undefined) {
    validation.valid = false;
    validation.errors.push('Parking spot type must be defined');
  }
  if (!parkingSpot.latitude || !parkingSpot.longitude) {
    validation.valid = false;
    validation.errors.push('Parking spot coordinates are required');
  }
  return validation;
}