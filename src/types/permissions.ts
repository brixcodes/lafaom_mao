// Système de permissions unifié synchronisé avec le backend
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
  CAN_DELETE_JOB_ATTACHMENT = 'can_delete_job_attachment',
  
  // Training session permissions
  CAN_UPDATE_TRAINING_SESSION = 'can_update_training_session',
  CAN_CREATE_TRAINING_SESSION = 'can_create_training_session',
  CAN_DELETE_TRAINING_SESSION = 'can_delete_training_session',
  CAN_VIEW_TRAINING_SESSION = 'can_view_training_session',
  
  // Training permissions
  CAN_VIEW_TRAINING = 'can_view_training',
  CAN_CREATE_TRAINING = 'can_create_training',
  CAN_UPDATE_TRAINING = 'can_update_training',
  CAN_DELETE_TRAINING = 'can_delete_training',
  
  // Student application permissions
  CAN_VIEW_STUDENT_APPLICATION = 'can_view_student_application',
  CAN_CHANGE_STUDENT_APPLICATION_STATUS = 'can_change_student_application_status',
  CAN_DELETE_STUDENT_ATTACHMENT = 'can_delete_student_attachment',
  
  // Reclamation type permissions
  CAN_UPDATE_RECLAMATION_TYPE = 'can_update_reclamation_type',
  CAN_CREATE_RECLAMATION_TYPE = 'can_create_reclamation_type',
  CAN_DELETE_RECLAMATION_TYPE = 'can_delete_reclamation_type',
  CAN_VIEW_RECLAMATION_TYPE = 'can_view_reclamation_type',
  
  // Reclamation permissions
  CAN_VIEW_RECLAMATION = 'can_view_reclamation',
  CAN_CHANGE_RECLAMATION_STATUS = 'can_change_reclamation_status',
  
  // Specialty permissions
  CAN_VIEW_SPECIALTY = 'can_view_specialty',
  CAN_CREATE_SPECIALTY = 'can_create_specialty',
  CAN_UPDATE_SPECIALTY = 'can_update_specialty',
  CAN_DELETE_SPECIALTY = 'can_delete_specialty',
  
  // Organization center permissions
  CAN_VIEW_ORGANIZATION_CENTER = 'can_view_organization_center',
  CAN_CREATE_ORGANIZATION_CENTER = 'can_create_organization_center',
  CAN_UPDATE_ORGANIZATION_CENTER = 'can_update_organization_center',
  CAN_DELETE_ORGANIZATION_CENTER = 'can_delete_organization_center',
  
  // Payment permissions
  CAN_VIEW_PAYMENT = 'can_view_payment',
}

// Rôles synchronisés avec le backend
export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  VISITOR = 'visitor',
}

// Types pour les permissions et rôles
export interface PermissionOut {
  user_id: string | null
  role_id: number | null
  permission: string
}

export interface RoleOut {
  id: number
  name: string
  description?: string
}

export interface AssignPermissionsInput {
  user_id: string
  permissions: string[]
}

export interface AssignRoleInput {
  user_id: string
  role_id: number
}

// Permissions par rôle (basé sur la logique métier)
export const rolePermissions: Record<RoleEnum, PermissionEnum[]> = {
  [RoleEnum.SUPER_ADMIN]: Object.values(PermissionEnum), // Toutes les permissions
  [RoleEnum.MANAGER]: [
    PermissionEnum.CAN_VIEW_USER,
    PermissionEnum.CAN_CREATE_USER,
    PermissionEnum.CAN_UPDATE_USER,
    PermissionEnum.CAN_VIEW_ROLE,
    PermissionEnum.CAN_VIEW_BLOG,
    PermissionEnum.CAN_CREATE_BLOG,
    PermissionEnum.CAN_UPDATE_BLOG,
    PermissionEnum.CAN_DELETE_BLOG,
    PermissionEnum.CAN_PUBLISH_BLOG,
    PermissionEnum.CAN_VIEW_JOB_OFFER,
    PermissionEnum.CAN_CREATE_JOB_OFFER,
    PermissionEnum.CAN_UPDATE_JOB_OFFER,
    PermissionEnum.CAN_DELETE_JOB_OFFER,
    PermissionEnum.CAN_VIEW_JOB_APPLICATION,
    PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS,
    PermissionEnum.CAN_DELETE_JOB_ATTACHMENT,
    PermissionEnum.CAN_VIEW_TRAINING_SESSION,
    PermissionEnum.CAN_CREATE_TRAINING_SESSION,
    PermissionEnum.CAN_UPDATE_TRAINING_SESSION,
    PermissionEnum.CAN_DELETE_TRAINING_SESSION,
    PermissionEnum.CAN_VIEW_TRAINING,
    PermissionEnum.CAN_CREATE_TRAINING,
    PermissionEnum.CAN_UPDATE_TRAINING,
    PermissionEnum.CAN_DELETE_TRAINING,
    PermissionEnum.CAN_VIEW_STUDENT_APPLICATION,
    PermissionEnum.CAN_CHANGE_STUDENT_APPLICATION_STATUS,
    PermissionEnum.CAN_DELETE_STUDENT_ATTACHMENT,
    PermissionEnum.CAN_VIEW_RECLAMATION_TYPE,
    PermissionEnum.CAN_CREATE_RECLAMATION_TYPE,
    PermissionEnum.CAN_UPDATE_RECLAMATION_TYPE,
    PermissionEnum.CAN_DELETE_RECLAMATION_TYPE,
    PermissionEnum.CAN_VIEW_RECLAMATION,
    PermissionEnum.CAN_CHANGE_RECLAMATION_STATUS,
    PermissionEnum.CAN_VIEW_SPECIALTY,
    PermissionEnum.CAN_CREATE_SPECIALTY,
    PermissionEnum.CAN_UPDATE_SPECIALTY,
    PermissionEnum.CAN_DELETE_SPECIALTY,
    PermissionEnum.CAN_VIEW_ORGANIZATION_CENTER,
    PermissionEnum.CAN_CREATE_ORGANIZATION_CENTER,
    PermissionEnum.CAN_UPDATE_ORGANIZATION_CENTER,
    PermissionEnum.CAN_DELETE_ORGANIZATION_CENTER,
    PermissionEnum.CAN_VIEW_PAYMENT,
  ],
  [RoleEnum.VISITOR]: [
    PermissionEnum.CAN_VIEW_BLOG,
    PermissionEnum.CAN_VIEW_JOB_OFFER,
    PermissionEnum.CAN_VIEW_TRAINING,
    PermissionEnum.CAN_VIEW_TRAINING_SESSION,
  ],
}

// Permissions spécifiques aux formations (pour compatibilité avec l'ancien système)
export enum TrainingPermission {
  VIEW_TRAININGS = PermissionEnum.CAN_VIEW_TRAINING,
  CREATE_TRAINING = PermissionEnum.CAN_CREATE_TRAINING,
  EDIT_TRAINING = PermissionEnum.CAN_UPDATE_TRAINING,
  DELETE_TRAINING = PermissionEnum.CAN_DELETE_TRAINING,
  MANAGE_SESSIONS = PermissionEnum.CAN_UPDATE_TRAINING_SESSION,
  REVIEW_APPLICATIONS = PermissionEnum.CAN_VIEW_STUDENT_APPLICATION,
}

// Rôles utilisateur (pour compatibilité avec l'ancien système)
export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR', 
  STUDENT = 'STUDENT',
}

// Mapping des anciens rôles vers les nouveaux
export const userRoleToRoleEnum: Record<UserRole, RoleEnum> = {
  [UserRole.ADMIN]: RoleEnum.SUPER_ADMIN,
  [UserRole.INSTRUCTOR]: RoleEnum.MANAGER,
  [UserRole.STUDENT]: RoleEnum.VISITOR,
}

// Permissions par ancien rôle (pour compatibilité)
export const legacyRolePermissions: Record<UserRole, PermissionEnum[]> = {
  [UserRole.ADMIN]: rolePermissions[RoleEnum.SUPER_ADMIN],
  [UserRole.INSTRUCTOR]: [
    PermissionEnum.CAN_VIEW_TRAINING,
    PermissionEnum.CAN_UPDATE_TRAINING_SESSION,
    PermissionEnum.CAN_VIEW_STUDENT_APPLICATION,
    PermissionEnum.CAN_CHANGE_STUDENT_APPLICATION_STATUS,
  ],
  [UserRole.STUDENT]: [
    PermissionEnum.CAN_VIEW_TRAINING,
    PermissionEnum.CAN_VIEW_TRAINING_SESSION,
  ],
}