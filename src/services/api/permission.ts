import { apiService } from './base'

export const permissionService = {
  async getUserPermissions(userId: string) {
    // GET /users/permissions?user_id=...
    return apiService.get('/users/permissions', { user_id: userId })
  },
  async assignPermissions(userId: string, permissions: string[]) {
    // POST /users/assign-permissions
    return apiService.postNoConfirm('/users/assign-permissions', { user_id: userId, permissions })
  },
  async revokePermissions(userId: string, permissions: string[]) {
    // POST /users/revoke-permissions
    return apiService.postNoConfirm('/users/revoke-permissions', { user_id: userId, permissions })
  },
}
