export interface UserOptions {
  singleDistrictAdmin: boolean;
  district: { label: string; value: number };
  statuses: { label: string; value: string }[];
}
