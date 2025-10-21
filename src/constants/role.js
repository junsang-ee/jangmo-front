export const USER_ROLES = [
  { name: 'ADMIN', value: '관리자' },
  { name: 'MEMBER', value: '회원' },
  { name: 'MERCENARY', value: '용병' },
  { name: 'DIRECTOR', value: '회원(감독)' },
  { name: 'MANAGER', value: '회원(매니저)' },
];

export const translateUserRole = (role) => {
   const result = USER_ROLES.find((value) => value.name === role);
  return result ? result.value : '알 수 없음';
}