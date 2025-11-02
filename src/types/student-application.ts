// Types et interfaces pour les candidatures d'étudiants (My Student Application)

// Types de base pour les réponses API
export interface BaseOutSuccess {
  message: string
  success: boolean
}

export interface BaseOutPage {
  data: any[]
  page: number
  number: number
  total_number: number
}

// ===== ENUMS =====

export enum ApplicationStatusEnum {
  SUBMITTED = 'SUBMITTED',
  REFUSED = 'REFUSED', 
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED' // Ajouté selon le backend
}

// ===== INPUT INTERFACES =====

export interface StudentApplicationCreateInput {
  email: string
  target_session_id: string
  first_name?: string
  last_name?: string
  phone_number?: string
  country_code?: string
  attachments?: string[]
}

export interface StudentApplicationUpdateInput {
  status?: ApplicationStatusEnum
  refusal_reason?: string
}

export interface StudentApplicationSubmitInput {
  application_id: number
  target_session_id: string
}

export interface StudentApplicationFilter {
  page: number
  page_size: number
  search?: string
  training_id?: string
  training_session_id?: string
  user_id?: string
  is_paid?: boolean
  status?: string
  order_by?: 'created_at'
  asc?: 'asc' | 'desc'
}

export interface StudentAttachmentInput {
  name: string
  file: File
}

export interface ChangeStudentApplicationStatusInput {
  status: string
  reason: string
}

export interface PayTrainingFeeInstallmentInput {
  training_session_id: string
  amount: number
}

// ===== OUTPUT INTERFACES =====

export interface StudentAttachmentOut {
  id: number
  application_id: number
  document_type: string
  file_path: string
  created_at: string
  updated_at: string
}

export interface StudentApplicationOut {
  id: number
  user_id: string
  training_id: string
  target_session_id: string
  application_number: string
  status: string
  payment_id?: string
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  currency: string
  training_title?: string
  training_session_start_date?: string
  training_session_end_date?: string
  user_email?: string
  user_first_name?: string
  user_last_name?: string
  created_at: string
  updated_at: string
}

export interface StudentApplicationFullOut {
  id: number
  user_id: string
  training_id: string
  target_session_id: string
  application_number: string
  status: string
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  currency: string
  created_at: string
  updated_at: string
  payment_id?: string
  payment_method?: string
  training?: TrainingOut
  training_session?: TrainingSessionOut
  attachments?: StudentAttachmentOut[]
}

// ===== RELATED MODELS =====

export interface TrainingOut {
  id: string
  title: string
  description?: string
  duration?: string
  training_type?: string
  enrollment?: string
  created_at: string
  updated_at: string
}

export interface TrainingSessionOut {
  id: string
  training_id: string
  center_id?: number
  start_date?: string
  end_date?: string
  registration_deadline: string
  available_slots?: number
  status: string
  registration_fee?: number
  training_fee?: number
  currency: string
  required_attachments?: string[]
  installment_percentage?: number[]
  moodle_course_id?: number
  created_at: string
  updated_at: string
}

export interface UserOut {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  country_code?: string
  user_type: string
  created_at: string
  updated_at: string
}

// ===== PAYMENT INTERFACES =====

export interface TrainingFeeInstallmentPayment {
  id: number
  application_id: number
  training_session_id: string
  user_id: string
  amount: number
  currency: string
  payment_id?: string
  installment_number: number
  created_at: string
  updated_at: string
}

export interface PaymentInitOut {
  payment_url: string
  payment_id: string
  amount: number
  currency: string
  status: string
  created_at: string
}

// ===== SUCCESS RESPONSE INTERFACES =====

export interface StudentApplicationOutSuccess extends BaseOutSuccess {
  data: StudentApplicationFullOut
}

export interface StudentApplicationsPageOutSuccess extends BaseOutPage {
  data: StudentApplicationOut[]
}

export interface StudentAttachmentOutSuccess extends BaseOutSuccess {
  data: StudentAttachmentOut
}

export interface StudentAttachmentListOutSuccess extends BaseOutSuccess {
  data: StudentAttachmentOut[]
}

// ===== PAYMENT INTERFACES =====

export interface TrainingFeePaymentOut {
  application_id: number
  payment_id: string
  amount: number
  currency: string
  status: string
  payment_url?: string
  created_at: string
}

export interface TrainingFeePaymentSuccess extends BaseOutSuccess {
  data: TrainingFeePaymentOut
}

export interface PaymentInitSuccess extends BaseOutSuccess {
  data: PaymentInitOut
}

// ===== STATISTICS INTERFACES =====

export interface StudentApplicationStats {
  total_applications: number
  pending_applications: number
  approved_applications: number
  refused_applications: number
  total_fees_paid: number
  pending_payments: number
  applications_by_month: Array<{
    month: string
    count: number
  }>
  applications_by_status: Array<{
    status: string
    count: number
  }>
  applications_by_training: Array<{
    training_id: string
    training_title: string
    count: number
  }>
}

export interface StudentApplicationStatsSuccess extends BaseOutSuccess {
  data: StudentApplicationStats
}

// ===== BULK OPERATIONS INTERFACES =====

export interface BulkUpdateStudentApplicationsInput {
  application_ids: number[]
  data: StudentApplicationUpdateInput
}

export interface BulkDeleteStudentApplicationsInput {
  application_ids: number[]
}

export interface BulkOperationResult {
  message: string
  updated_count?: number
  deleted_count?: number
  failed_count: number
  failed_ids: number[]
}

export interface BulkOperationSuccess extends BaseOutSuccess {
  data: BulkOperationResult
}

// ===== EXPORT INTERFACES =====

export interface StudentApplicationExportInput {
  format: 'csv' | 'excel' | 'pdf'
  filters?: StudentApplicationFilter
  fields?: string[]
  include_attachments?: boolean
}

export interface StudentApplicationExportResult {
  file_url: string
  file_name: string
  file_size: number
  created_at: string
  expires_at: string
}

export interface StudentApplicationExportSuccess extends BaseOutSuccess {
  data: StudentApplicationExportResult
}

// ===== NOTIFICATION INTERFACES =====

export interface StudentApplicationNotification {
  id: string
  application_id: number
  type: 'status_change' | 'payment_required' | 'deadline_reminder' | 'approval' | 'rejection'
  title: string
  message: string
  is_read: boolean
  created_at: string
  read_at?: string
}

export interface StudentApplicationNotificationList {
  data: StudentApplicationNotification[]
  unread_count: number
  total_count: number
}

export interface StudentApplicationNotificationSuccess extends BaseOutSuccess {
  data: StudentApplicationNotificationList
}

// ===== HISTORY INTERFACES =====

export interface StudentApplicationHistoryItem {
  id: number
  application_id: number
  action: string
  description: string
  user_id: string
  user_name: string
  user_email: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  created_at: string
}

export interface StudentApplicationHistory {
  data: StudentApplicationHistoryItem[]
  total_count: number
}

export interface StudentApplicationHistorySuccess extends BaseOutSuccess {
  data: StudentApplicationHistory
}

// ===== VALIDATION INTERFACES =====

export interface StudentApplicationValidationResult {
  can_edit: boolean
  can_delete: boolean
  can_submit: boolean
  can_pay: boolean
  reason?: string
  warnings?: string[]
}

export interface StudentApplicationValidationSuccess extends BaseOutSuccess {
  data: StudentApplicationValidationResult
}

// ===== UTILITY INTERFACES =====

export interface StudentApplicationStatusChip {
  text: string
  color: string
  icon: string
}

export interface StudentApplicationFormData {
  id?: number
  email: string
  target_session_id: string
  first_name: string
  last_name: string
  phone_number: string
  country_code: string
  attachments: File[]
}

export interface StudentApplicationSearchFilters {
  search?: string
  status?: ApplicationStatusEnum
  training_id?: string
  training_session_id?: string
  is_paid?: boolean
  date_from?: string
  date_to?: string
}

// ===== COMPUTED PROPERTIES HELPERS =====

export interface StudentApplicationComputed {
  statusChip: StudentApplicationStatusChip
  canEdit: boolean
  canDelete: boolean
  canSubmit: boolean
  canPay: boolean
  isOverdue: boolean
  daysUntilDeadline: number
}

// ===== API RESPONSE TYPES =====

export interface StudentApplicationListResponse {
  data: StudentApplicationOut[]
  page: number
  number: number
  total_number: number
}

export interface StudentApplicationDetailResponse {
  message: string
  data: StudentApplicationFullOut
}

export interface StudentApplicationCreateResponse {
  message: string
  data: StudentApplicationFullOut
}

export interface StudentApplicationUpdateResponse {
  message: string
  data: StudentApplicationFullOut
}

export interface StudentApplicationDeleteResponse {
  message: string
  success: boolean
}

// ===== FORM VALIDATION INTERFACES =====

export interface StudentApplicationFormValidation {
  email: boolean
  first_name: boolean
  last_name: boolean
  phone_number: boolean
  target_session_id: boolean
  attachments: boolean
}

export interface StudentApplicationFormErrors {
  email?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  target_session_id?: string
  attachments?: string
  general?: string
}

// ===== NOTIFICATION INTERFACES =====

export interface StudentApplicationNotification {
  id: string
  application_id: number
  type: 'status_change' | 'payment_required' | 'deadline_reminder' | 'approval' | 'rejection'
  title: string
  message: string
  is_read: boolean
  created_at: string
  read_at?: string
}

export interface StudentApplicationNotificationList {
  data: StudentApplicationNotification[]
  unread_count: number
}

// ===== EXPORT ALL TYPES =====
// Toutes les interfaces sont déjà exportées individuellement ci-dessus
