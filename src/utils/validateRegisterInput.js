
export default function validateRegisterInput(input) {
  const validation = {
    valid: true,
    errors: []
  };

  // FIXME: protect from sql injection

  if (input.username === undefined) {
    validation.valid = false;
    validation.errors.push('Username is required');
  }
  if (input.password === undefined) { // TODO: add validation through regex to accept only real passwords (e.g. 8 char long, has both numbers and characters, ..)
    validation.valid = false;
    validation.errors.push('Password is required');
  }
  return validation;
}