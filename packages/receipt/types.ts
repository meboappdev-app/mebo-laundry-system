export interface ReceiptItem {
  serviceName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface NormalizedReceipt {
  receiptCode: string;
  customerName: string | null;
  customerPhone: string | null;
  receivedAt: string | null;
  completedAt: string | null;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  serviceFee: number;
  grandTotal: number;
  paymentAmount: number;
  paymentStatus: string | null;
  sourceUrl: string;
}
