export interface UserOptions {
  viewAudit: boolean;
  districtAdmin: boolean;
  districts: { label: string; value: number }[];
  statuses: { label: string; value: string }[];
}
