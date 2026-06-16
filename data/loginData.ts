export const loginData = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  invalidUser: {
    username: 'standard_user',
    password: 'wrong_password',
  },
  missingUsername: {
    username: '',
    password: 'wrong_password',
  },
  missingPassword: {
    username: 'standard_user',
    password: '',
  }
};
