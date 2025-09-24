// ===========================================
// ENUMS GLOBAUX - FRONTEND
// ===========================================
// Tous les enums du backend traduits en TypeScript

// ===========================================
// USER ENUMS
// ===========================================

export enum UserTypeEnum {
  ADMIN = 'admin',
  STAFF = 'staff',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export enum CivilityEnum {
  MR = 'Mr',
  MMME = 'Mme',
  MLLE = 'Mlle',
}

export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  VISITOR = 'visitor',
}

// ===========================================
// TRAINING ENUMS
// ===========================================

export enum TrainingTypeEnum {
  ON_SITE = 'On-Site',
  OFF_SITE = 'Off-Site',
}

export enum TrainingStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum DurationEnum {
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}

export enum TrainingSessionStatusEnum {
  OPEN_FOR_REGISTRATION = 'OPEN_FOR_REGISTRATION',
  CLOSE_FOR_REGISTRATION = 'CLOSE_FOR_REGISTRATION',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export enum ApplicationStatusEnum {
  RECEIVED = 'RECEIVED',
  SUBMITTED = 'SUBMITTED',
  REFUSED = 'REFUSED',
  APPROVED = 'APPROVED',
}

// ===========================================
// RECLAMATION ENUMS
// ===========================================

export enum ReclamationStatusEnum {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum ReclamationPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// ===========================================
// PAYMENT ENUMS
// ===========================================

export enum PaymentStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
  CANCELLED = 'cancelled',
  ERROR = 'error',
  REPAY = 'rembourse',
}

// ===========================================
// ORGANIZATION CENTER ENUMS
// ===========================================

export enum OrganizationStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum OrganizationTypeEnum {
  MAIN = 'main',
  BRANCH = 'branch',
  PARTNER = 'partner',
  AFFILIATE = 'affiliate',
}

// ===========================================
// BLOG ENUMS
// ===========================================

export enum StatusEnum {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
}

// ===========================================
// PERMISSION ENUMS
// ===========================================
// Note: Les permissions sont maintenant définies dans @/types/permissions.ts
// pour éviter la duplication et maintenir la cohérence avec le backend
