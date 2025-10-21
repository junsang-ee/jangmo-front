export const USER_COMMON_STATUSES = [
  {name: '정상 이용가능', value:'ENABLED'},
  {name: '이용불가', value: 'DISABLED'},
  {name: '승인대기', value: 'PENDING'}
];

export const MEMBER_STATUSES = [
  {name: '정상 이용가능', value:'ENABLED'},
  {name: '이용불가', value: 'DISABLED'},
  {name: '승인대기', value: 'PENDING'},
  {name: '부상', value: 'INJURED'},
];

export const MERCENARY_STATUSES = [
  {name: '정상 이용가능', value:'ENABLED'},
  {name: '이용불가', value: 'DISABLED'},
  {name: '승인대기', value: 'PENDING'},
  {name: '만료', value: 'EXPIRED'},
];

export const translateMemberStatus = (value) => {
  const result = MEMBER_STATUSES.find((status) => status.value === value);
  return result.name;
}

export const translateMercenaryStatus = (value) => {
  const result = MERCENARY_STATUSES.find((status) => status.value === value);
  return result.name;
}



