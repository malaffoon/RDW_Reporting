
import {randomId} from "./support/generator";
export const iab_items = [
  {
    claim: 'Concepts and Procedures',
    target: 'Target F',
    score: 0,
    maximumScore: 1
  },
  {
    claim: 'Problem Solving',
    target: 'Target A',
    score: 2,
    maximumScore: 2
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target F',
    score: 1,
    maximumScore: 1
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target E',
    score: 2,
    maximumScore: 2
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target G',
    score: 1,
    maximumScore: 1
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target G',
    score: 0,
    maximumScore: 1
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target H',
    score: 2,
    maximumScore: 2
  }
].map((item:any , index) => {
  item.id = randomId();
  item.number = index + 1;
  return item;
});
