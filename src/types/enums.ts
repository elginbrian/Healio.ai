export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum KYCStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum FacilityType {
  HOSPITAL = "HOSPITAL",
  CLINIC = "CLINIC",
  PUSKESMAS = "PUSKESMAS",
  LABORATORY = "LABORATORY",
}

export enum ReceiptStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  FAILED = "FAILED",
}

export enum ExpenseCategory {
  MEDICATION = "MEDICATION",
  CONSULTATION = "CONSULTATION",
  LAB_FEE = "LAB_FEE",
  OTHER = "OTHER",
}

export enum PoolStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  E_WALLET = "E_WALLET",
  CASH = "CASH",
}

export enum PoolMemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum JoinRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ContributionPeriod {
  MONTHLY = "BULANAN",
  WEEKLY = "MINGGUAN",
  ANNUALLY = "TAHUNAN",
}

export enum ClaimApprovalSystem {
  VOTING_50_PERCENT = "VOTING_50_PERCENT",
}

export enum ContributionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum DisbursementStatus {
  PENDING_VOTE = "PENDING_VOTE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSING_PAYOUT = "PROCESSING_PAYOUT",
  DISBURSED = "DISBURSED",
  FAILED_PAYOUT = "FAILED_PAYOUT",
  CANCELLED = "CANCELLED",
}

export enum VoteOption {
  FOR = "FOR",
  AGAINST = "AGAINST",
}
