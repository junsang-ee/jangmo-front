import { jwtDecode } from 'jwt-decode';

const tokenValidator = async(token) => {
    if (token) {
      let decodedToken = jwtDecode(token);
      let expireAt = new Date(decodedToken.exp * 1000);
      if (Date.now() < expireAt.getTime()) {
        return token;
      } else {
        await $alert('세션이 만료되었습니다.');
        throw 'Login';
      }
    } else {
      throw 'Login';
    }
  };

export { tokenValidator };