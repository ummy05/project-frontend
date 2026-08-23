// src/app/models/license.model.ts

export interface License {

  id: number;

  licenseNumber: string;

  controlNumber: string;

  businessName: string;

  ownerName: string;

  ownerEmail: string;

  phoneNumber: string;

  licenseType: string;

  district: string;

  location: string;

  issueDate: string | null;

  expiryDate: string | null;

  durationMonths: number;

  renewalStartDate?: string | null;

  renewalEndDate?: string | null;

  licenseFee: number;

  paidAmount: number;

  status: string;

  remarks?: string | null;

  renewal: boolean;

  renewalCount: number;

  createdAt: string;
}