// === ENUMS ===
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

export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  VISITOR = 'visitor',
}

export enum CivilityEnum {
  MR = 'Mr',
  MME = 'Mme', 
  MLLE = 'Mlle',
}

export enum PermissionEnum {
  // User permissions
  CAN_VIEW_USER = 'can_view_user',
  CAN_CREATE_USER = 'can_create_user',
  CAN_UPDATE_USER = 'can_update_user',
  CAN_DELETE_USER = 'can_delete_user',
  
  // Role permissions
  CAN_VIEW_ROLE = 'can_view_role',
  CAN_CREATE_ROLE = 'can_create_role',
  CAN_UPDATE_ROLE = 'can_update_role',
  CAN_DELETE_ROLE = 'can_delete_role',
  
  // Permission management
  CAN_GIVE_ROLE = 'can_give_role',
  CAN_GIVE_PERMISSION = 'can_give_permission',
  
  // Blog permissions
  CAN_VIEW_BLOG = 'can_view_blog',
  CAN_CREATE_BLOG = 'can_create_blog',
  CAN_UPDATE_BLOG = 'can_update_blog',
  CAN_DELETE_BLOG = 'can_delete_blog',
  CAN_PUBLISH_BLOG = 'can_publish_blog',
  
  // Job offer permissions
  CAN_VIEW_JOB_OFFER = 'can_view_job_offer',
  CAN_CREATE_JOB_OFFER = 'can_create_job_offer',
  CAN_UPDATE_JOB_OFFER = 'can_update_job_offer',
  CAN_DELETE_JOB_OFFER = 'can_delete_job_offer',
  
  // Job application permissions
  CAN_VIEW_JOB_APPLICATION = 'can_view_job_application',
  CAN_CHANGE_JOB_APPLICATION_STATUS = 'can_change_job_application_status',
}

export enum NotificationChannelEnum {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

export enum AddressTypeEnum {
  PRIMARY = 'primary',
  BILLING = 'billing',
}

// Types pour le module User
export interface User extends BaseModel {
  id: string
  first_name: string
  last_name: string
  birth_date?: string | null
  civility?: string | null
  country_code?: string | null
  mobile_number?: string | null
  fix_number?: string | null
  email?: string | null
  password: string
  picture?: string | null
  status: UserStatusEnum
  lang: string
  web_token?: string | null
  last_login?: string | null
  user_type: UserTypeEnum
  two_factor_enabled: boolean
}

export interface UserSimpleOut extends BaseModel {
  id: string
  first_name: string
  last_name: string
  birth_date?: string | null
  civility?: string | null
  country_code?: string | null
  mobile_number?: string | null
  fix_number?: string | null
  email?: string | null
  picture?: string | null
  status: UserStatusEnum
  lang: string
  web_token?: string | null
  last_login?: string | null
  user_type: UserTypeEnum
  two_factor_enabled: boolean
}

export interface AddressOut extends BaseModel {
  id: number
  country_code?: string
  city?: string
  street?: string
  postal_code?: string
  state?: string
}

export interface ProfessionStatusOut extends BaseModel {
  id: number
  professional_status?: string
  professional_experience_in_months: number
  socio_professional_category?: string
  job_position?: string
  employer?: string
}

export interface SchoolCurriculumOut extends BaseModel {
  id: number
  qualification?: string
  last_degree_obtained?: string
  date_of_last_degree?: string
}

export interface UserFullOut extends UserSimpleOut {
  professions_status?: ProfessionStatusOut
  addresses: AddressOut[]
  school_curriculum?: SchoolCurriculumOut
}

export interface CreateUserInput {
  first_name: string
  last_name: string
  password: string
  birth_date?: string | null
  civility?: string | null
  country_code?: string | null
  mobile_number?: string | null
  fix_number?: string | null
  email?: string | null
  status: UserStatusEnum
  lang: string
  web_token?: string | null
  user_type: UserTypeEnum
  two_factor_enabled: boolean
}

export interface UpdateUserInput {
  first_name: string
  last_name: string
  password: string
  birth_date?: string | null
  civility?: string | null
  country_code?: string | null
  mobile_number?: string | null
  fix_number?: string | null
  email?: string | null
  status: UserStatusEnum
  lang: string
  web_token?: string | null
  two_factor_enabled: boolean
}

export interface UserFilter {
  page?: number
  page_size?: number
  search?: string
  user_type?: UserTypeEnum
  country_code?: string
  order_by?: 'created_at' | 'last_login' | 'first_name' | 'last_name'
  asc?: 'asc' | 'desc'
}

export interface AssignPermissionsInput {
  user_id: string
  permissions: string[]
}

export interface AssignRoleInput {
  user_id: string
  role_id: number
}

export interface RoleOut extends BaseModel {
  id: number
  name: string
  description?: string
}

export interface PermissionOut {
  user_id?: string
  role_id?: number
  permission: string
}

export interface UserListInput {
  user_ids: string[]
}

export interface ListDataInput {
  data: number[]
}

// Import BaseModel and BaseOutSuccess from index
import type { BaseModel, BaseOutSuccess, BaseOutPage } from './index'

// Response types
export interface UserOutSuccess extends BaseOutSuccess<UserSimpleOut> {}
export interface UserFullOutSuccess extends BaseOutSuccess<UserFullOut> {}
export interface UserListOutSuccess extends BaseOutSuccess<UserSimpleOut[]> {}
export interface UsersPageOutSuccess extends BaseOutPage<UserSimpleOut> {}
export interface RoleOutSuccess extends BaseOutSuccess<RoleOut> {}
export interface RoleListOutSuccess extends BaseOutSuccess<RoleOut[]> {}
export interface PermissionOutSuccess extends BaseOutSuccess<PermissionOut> {}
export interface PermissionListOutSuccess extends BaseOutSuccess<PermissionOut[]> {}

// === INPUT SCHEMAS COMPLÉMENTAIRES ===
export interface UpdateStatusInput {
  status: UserStatusEnum
}

// === COMPUTED TYPES ===
export interface UserWithPermissions extends UserSimpleOut {
  permissions?: PermissionOut[]
  roles?: RoleOut[]
  computedFullName?: string
  computedStatus?: {
    label: string
    color: string
    icon: string
  }
  computedUserType?: {
    label: string
    color: string
    icon: string
  }
}

// === UI HELPERS ===
export interface UserFilterOption {
  label: string
  value: string
  icon?: string
  color?: string
}

export interface UserBulkAction {
  id: string
  label: string
  icon: string
  color?: string
  requiresConfirmation: boolean
  confirmMessage?: string
}

export interface UserFormField {
  key: keyof CreateUserInput | keyof UpdateUserInput
  label: string
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'tel' | 'switch'
  required?: boolean
  options?: { label: string; value: any }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// === SORT OPTIONS ===
export const USER_SORT_OPTIONS: { title: string; value: string }[] = [
  { title: 'Plus récents', value: 'created_at_desc' },
  { title: 'Plus anciens', value: 'created_at_asc' },
  { title: 'Prénom A-Z', value: 'first_name_asc' },
  { title: 'Prénom Z-A', value: 'first_name_desc' },
  { title: 'Nom A-Z', value: 'last_name_asc' },
  { title: 'Nom Z-A', value: 'last_name_desc' },
  { title: 'Dernière connexion', value: 'last_login_desc' },
]

// === STATUS MAPPINGS ===
export const USER_STATUS_MAP = {
  [UserStatusEnum.ACTIVE]: {
    label: 'Actif',
    color: 'success',
    icon: 'ri-check-circle-line',
  },
  [UserStatusEnum.INACTIVE]: {
    label: 'Inactif',
    color: 'warning', 
    icon: 'ri-pause-circle-line',
  },
  [UserStatusEnum.BLOCKED]: {
    label: 'Bloqué',
    color: 'error',
    icon: 'ri-forbid-line',
  },
  [UserStatusEnum.DELETED]: {
    label: 'Supprimé',
    color: 'grey',
    icon: 'ri-delete-bin-line',
  },
}

export const USER_TYPE_MAP = {
  [UserTypeEnum.ADMIN]: {
    label: 'Administrateur',
    color: 'purple',
    icon: 'ri-admin-line',
  },
  [UserTypeEnum.STAFF]: {
    label: 'Staff',
    color: 'blue',
    icon: 'ri-user-star-line',
  },
  [UserTypeEnum.TEACHER]: {
    label: 'Enseignant',
    color: 'orange',
    icon: 'ri-graduation-cap-line',
  },
  [UserTypeEnum.STUDENT]: {
    label: 'Étudiant',
    color: 'green',
    icon: 'ri-book-open-line',
  },
}

export const CIVILITY_OPTIONS = [
  { label: 'Monsieur', value: CivilityEnum.MR },
  { label: 'Madame', value: CivilityEnum.MME },
  { label: 'Mademoiselle', value: CivilityEnum.MLLE },
]

export const LANGUAGE_OPTIONS = [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
]

// === HELPER FUNCTIONS ===
export const formatFullName = (user: UserSimpleOut | User): string => {
  const firstName = user.first_name || ''
  const lastName = user.last_name || ''
  return `${firstName} ${lastName}`.trim() || 'Utilisateur sans nom'
}
