// Types de base pour l'API
export interface BaseModel {
  id: string | number
  created_at: string
  updated_at: string
  delete_at?: string | null
}

export interface BaseOutSuccess<T = any> {
  message: string
  success: boolean
  data: T
}

export interface BaseOutFail {
  message: string
  error_code: string
  success: false
}

export interface BaseOutPage<T = any> {
  message: string
  success: boolean
  data: T[]
  page: number
  page_size: number
  total_number: number
}

// Enums
export enum UserTypeEnum {
  ADMIN = 'admin',
  STAFF = 'staff',
  STUDENT = 'student',
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum Status {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
}

export enum ApplicationStatusEnum {
  RECEIVED = 'RECEIVED',
  REFUSED = 'REFUSED',
  APPROVED = 'APPROVED',
}

export enum TrainingTypeEnum {
  ON_SITE = 'On-Site',
  OFF_SITE = 'Off-Site',
}

export enum TrainingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum TrainingSessionStatusEnum {
  OPEN_FOR_REGISTRATION = 'OPEN_FOR_REGISTRATION',
  CLOSE_FOR_REGISTRATION = 'CLOSE_FOR_REGISTRATION',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export enum DurationEnum {
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum DeviceType {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum PermissionEnum {
  CAN_VIEW_USER = 'CAN_VIEW_USER',
  CAN_CREATE_USER = 'CAN_CREATE_USER',
  CAN_UPDATE_USER = 'CAN_UPDATE_USER',
  CAN_DELETE_USER = 'CAN_DELETE_USER',
  CAN_GIVE_PERMISSION = 'CAN_GIVE_PERMISSION',
  CAN_VIEW_ROLE = 'CAN_VIEW_ROLE',
  CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',
  CAN_UPDATE_ROLE = 'CAN_UPDATE_ROLE',
  CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',
  CAN_CREATE_BLOG = 'CAN_CREATE_BLOG',
  CAN_UPDATE_BLOG = 'CAN_UPDATE_BLOG',
  CAN_DELETE_BLOG = 'CAN_DELETE_BLOG',
  CAN_PUBLISH_BLOG = 'CAN_PUBLISH_BLOG',
}

export enum RoleEnum {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum EMAIL_CHANNEL {
  SMTP = 'smtp',
  MAILGUN = 'mailgun',
}

export enum ErrorMessage {
  INCORRECT_EMAIL_OR_PASSWORD = 'INCORRECT_EMAIL_OR_PASSWORD',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  EMAIL_ALREADY_TAKEN = 'EMAIL_ALREADY_TAKEN',
  PASSWORD_NOT_CORRECT = 'PASSWORD_NOT_CORRECT',
  CODE_ALREADY_USED = 'CODE_ALREADY_USED',
  CODE_HAS_EXPIRED = 'CODE_HAS_EXPIRED',
  REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
  REFRESH_TOKEN_HAS_EXPIRED = 'REFRESH_TOKEN_HAS_EXPIRED',
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  POST_ALREADY_EXISTS = 'POST_ALREADY_EXISTS',
  CATEGORY_ALREADY_EXISTS = 'CATEGORY_ALREADY_EXISTS',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
