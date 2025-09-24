import type { BaseOutSuccess } from './base'

// Enums
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

// Interfaces
export interface OrganizationCenter {
  id: number
  name: string
  address: string
  city: string
  postal_code?: string
  country_code: string
  telephone_number: string
  mobile_number: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  status: OrganizationStatusEnum
  organization_type: OrganizationTypeEnum
  description?: string
  created_at: string
  updated_at: string
}

// Input/Output Types
export interface OrganizationCenterCreateInput {
  name: string
  address: string
  city: string
  postal_code?: string
  country_code: string
  telephone_number: string
  mobile_number: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  status?: OrganizationStatusEnum
  organization_type?: OrganizationTypeEnum
  description?: string
}

export interface OrganizationCenterUpdateInput {
  name: string
  address: string
  city: string
  postal_code?: string
  country_code: string
  telephone_number: string
  mobile_number: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  status: OrganizationStatusEnum
  organization_type: OrganizationTypeEnum
  description?: string
}

export interface OrganizationCenterStatusUpdateInput {
  status: OrganizationStatusEnum
}

export interface OrganizationCenterFilter {
  page?: number
  page_size?: number
  search?: string
  status?: OrganizationStatusEnum
  organization_type?: OrganizationTypeEnum
  country_code?: string
  city?: string
  order_by?: 'name' | 'city' | 'created_at' | 'updated_at'
  asc?: 'asc' | 'desc'
}

export interface OrganizationCenterListInput {
  organization_center_ids: number[]
}

// API Response Types
export interface OrganizationCenterOutSuccess extends BaseOutSuccess {
  data: OrganizationCenter
}

export interface OrganizationCenterListOutSuccess extends BaseOutSuccess {
  data: OrganizationCenter[]
}

export interface OrganizationCenterListOutSuccess extends BaseOutSuccess {
  data: OrganizationCenter[]
  page: number
  number: number
  total_number: number
}

// Helper Types
export interface OrganizationCenterFormData {
  name: string
  address: string
  city: string
  postal_code: string
  country_code: string
  telephone_number: string
  mobile_number: string
  email: string
  website: string
  latitude: string
  longitude: string
  status: OrganizationStatusEnum
  organization_type: OrganizationTypeEnum
  description: string
}

// Filter Options
export interface OrganizationCenterFilterOptions {
  statusOptions: Array<{ title: string; value: OrganizationStatusEnum }>
  typeOptions: Array<{ title: string; value: OrganizationTypeEnum }>
  countryOptions: Array<{ title: string; value: string }>
  cityOptions: Array<{ title: string; value: string }>
}

// Location Types
export interface OrganizationCenterLocation {
  country_code: string
  city?: string
}

// Statistics Types
export interface OrganizationCenterStats {
  total: number
  active: number
  inactive: number
  byType: Record<OrganizationTypeEnum, number>
  byCountry: Record<string, number>
}
