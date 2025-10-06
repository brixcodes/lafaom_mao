// Types strictement alignés sur les schémas Pydantic backend (auth + user)
import type { UserFullOut } from './user'

export interface Token {
  token: string
  token_type: string
  refresh_token?: string
  device_id?: string
  expires_in?: number
}

export interface UserTokenOut {
  access_token: Token
  user: UserFullOut
}

export interface TokenData {
  token?: string
  user_id?: string
  expire_at?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface UpdatePasswordInput {
  password: string
  new_password: string
}

export interface AuthCodeInput {
  code: string
}

export interface UpdateDeviceInput {
  device_id: string
}

export interface ChangeEmailInput {
  email: string
  password?: string
}

export interface ValidateChangeCodeInput {
  code: string
  email: string
}

export interface ValidateForgottenCodeInput {
  email: string
  code: string
  password: string
}

export interface ForgottenPasswordInput {
  email: string
}

export interface RefreshTokenInput {
  refresh_token: string
  device_id?: string
}

export interface SocialTokenInput {
  token: string
  platform?: 'ios' | 'android' | 'web'
}

export interface UpdateUserProfile {
  first_name: string
  last_name: string
  user_type: string
  status: string
  birth_date: string
  civility: string
  country_code?: string
  mobile_number: string
  fix_number: string
  two_factor_enabled: boolean
  lang?: string
}

export interface UpdateCurriculumInput {
  qualification?: string
  last_degree_obtained?: string
  date_of_last_degree?: string
}

export interface UpdateProfessionStatusInput {
  professional_status?: string
  professional_experience_in_months: number
  socio_professional_category?: string
  job_position?: string
  employer?: string
}

export interface UpdateAddressInput {
  primary_address_country_code?: string
  primary_address_city?: string
  primary_address_street?: string
  primary_address_postal_code?: string
  primary_address_state?: string
  billing_address_country_code?: string
  billing_address_city?: string
  billing_address_street?: string
  billing_address_postal_code?: string
  billing_address_state?: string
}

export interface ClientAccessTokenInput {
  grant_type: string
  client_id: string
  client_secret: string
  audience: string
  scope?: string
}
