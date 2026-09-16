export type UserRole = "OWNER" | "STAFF";

export type MemberStatus =
  | "ACTIVE"
  | "INACTIVE";

export type TransactionStatus =
  | "PENDING"
  | "PAID"
  | "UNPAID"
  | "CANCELLED"
  | "COMPLETED";

export type PointEntryType =
  | "EARN"
  | "REDEEM"
  | "ADJUST"
  | "EXPIRE";

export type RewardStatus =
  | "AVAILABLE"
  | "USED"
  | "EXPIRED"
  | "CANCELLED";

export interface Member {
  id: string;
  member_code: string;
  phone: string;
  name: string;
  address: string | null;
  status: MemberStatus;
  access_token_hash?: string | null;
  token_created_at?: string | null;
  token_revoked_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  unit: string;
  price: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  member_id: string;
  receipt_code: string;
  customer_name: string | null;
  customer_phone: string | null;
  received_at: string | null;
  completed_at: string | null;
  subtotal: number;
  discount: number;
  service_fee: number;
  grand_total: number;
  payment_amount: number;
  payment_status: string | null;
  status: TransactionStatus;
  created_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  service_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
}

export interface PointLedger {
  id: string;
  member_id: string;
  transaction_id: string | null;
  type: PointEntryType;
  points: number | null;
  description: string | null;
  created_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  rule_type: string;
  rule_config: Record<string, unknown>;
  starts_at: string | null;
  ends_at: string | null;
}

export interface Reward {
  id: string;
  member_id: string;
  promotion_id: string | null;
  name: string;
  description: string | null;
  status: RewardStatus;
  points_cost: number | null;
  expires_at: string | null;
  created_at: string;
}
