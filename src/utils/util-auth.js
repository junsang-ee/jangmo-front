import { jwtDecode } from 'jwt-decode';

const tokenValidator = async(token) => {
  if (!token) throw 'Login';
  const decodedToken = jwtDecode(token);
  const expireAt = new Date(decodedToken.exp * 1000);
  if (Date.now() >= expireAt.getTime()) {
    await $alert('세션이 만료되었습니다.');
    throw 'Login';
  }
  return token;
};

export { tokenValidator };