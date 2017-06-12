
export default function validateAddress(address) {
  const validation = {
    valid: true,
    errors: []
  };

  // FIXME: protect from sql injection

  if (address.address === undefined) {
    validation.valid = false;
    validation.errors.push('Address is required');
  }
  if (!address.latitude || !address.longitude) {
    validation.valid = false;
    validation.errors.push('Address coordinates are required');
  }
  return validation;
}