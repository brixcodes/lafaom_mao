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
