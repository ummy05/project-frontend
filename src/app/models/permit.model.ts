export interface Permit {

  id: number;

  permitNumber: string;

  controlNumber: string;

  // ==============================
  // OWNER INFORMATION
  // ==============================

  businessName: string;

  ownerName: string;

  ownerEmail: string;

  phoneNumber: string;

  // ==============================
  // EVENT INFORMATION
  // ==============================

  permitType:
    | 'WEDDING_EVENT'
    | 'MUSIC_EVENT'
    | 'BEACH_EVENT'
    | 'CULTURAL_EVENT'
    | 'PRIVATE_EVENT'
    | 'SPORTS_EVENT'
    | 'OTHER_EVENT';

  eventName: string;

  description: string;

  eventDate: string;

  eventTime: string;

  location: string;

  // ==============================
  // SHEHIA
  // ==============================

  shehia: string;

  // ==============================
  // PAYMENT
  // ==============================

  permitFee: number;

  paidAmount: number;

  // ==============================
  // STATUS
  // ==============================

  status:
    | 'WAITING_PAYMENT'
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'EXPIRED';

  remarks: string;

  // ==============================
  // DATES
  // ==============================

  issueDate: string | null;

  expiryDate: string | null;

  createdAt: string;
}