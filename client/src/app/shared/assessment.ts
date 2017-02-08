import {Item} from "./item";

export interface Assessment {

  readonly id: number;
  readonly items?: Array<Item>;

}
