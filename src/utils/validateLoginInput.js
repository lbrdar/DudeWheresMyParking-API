
export default function validateLoginInput(input) {
  const validation = {
    valid: true,
    errors: []
  };

  // FIXME: protect from sql injection

  if (input.userId === undefined) {
    validation.valid = false;
    validation.errors.push('User ID is required');
  }
  if (input.password === undefined) {
    validation.valid = false;
    validation.errors.push('Password is required');
  }
  return validation;
}