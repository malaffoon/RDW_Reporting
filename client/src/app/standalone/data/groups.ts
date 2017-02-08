function randomId() {
  return Math.random().toString().substring(10);
}

export const groups = [
  {
    id: randomId(),
    name: 'Anderson, Mary 4th Grade Math Noon'
  },
  {
    id: randomId(),
    name: 'Anderson, Mary 4th Grade Math Morning'
  },
  {
    id: randomId(),
    name: 'Vista Advanced Math'
  }
];
