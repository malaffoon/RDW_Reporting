
export function randomIntegerOfLength(length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
};

export function randomId(): number {
  return randomIntegerOfLength(4);
}

export function randomSsid(): number {
  return randomIntegerOfLength(5);
}

export function intBetween(min:number, max: number) {
  return Math.round((Math.random() * (max - min)) + min);
}
