// Enum des permissions synchronisé avec le backend
export enum PermissionEnum {
  CAN_VIEW_USER = 'can_view_user',
  CAN_CREATE_USER = 'can_create_user',
  CAN_UPDATE_USER = 'can_update_user',
  CAN_DELETE_USER = 'can_delete_user',

  CAN_VIEW_ROLE = 'can_view_role',
  CAN_CREATE_ROLE = 'can_create_role',
  CAN_UPDATE_ROLE = 'can_update_role',
  CAN_DELETE_ROLE = 'can_delete_role',

  CAN_GIVE_ROLE = 'can_give_role',
  CAN_GIVE_PERMISSION = 'can_give_permission',

  CAN_VIEW_BLOG = 'can_view_blog',
  CAN_CREATE_BLOG = 'can_create_blog',
  CAN_UPDATE_BLOG = 'can_update_blog',
  CAN_DELETE_BLOG = 'can_delete_blog',
  CAN_PUBLISH_BLOG = 'can_publish_blog',

  CAN_VIEW_JOB_OFFER = 'can_view_job_offer',
  CAN_CREATE_JOB_OFFER = 'can_create_job_offer',
  CAN_UPDATE_JOB_OFFER = 'can_update_job_offer',
  CAN_DELETE_JOB_OFFER = 'can_delete_job_offer',

  CAN_VIEW_JOB_APPLICATION = 'can_view_job_application',
  CAN_CREATE_JOB_APPLICATION = 'can_create_job_application',
  CAN_UPDATE_JOB_APPLICATION = 'can_update_job_application',
  CAN_DELETE_JOB_APPLICATION = 'can_delete_job_application',
}
