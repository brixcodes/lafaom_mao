import { apiService } from './base'
import { PermissionEnum } from '@/types/permissions'

// Helper function pour obtenir les descriptions
const getPermissionDescription = (permission: string): string => {
  const descriptions: Record<string, string> = {
    // User permissions
    'CAN_VIEW_USER': 'Peut consulter les utilisateurs',
    'CAN_CREATE_USER': 'Peut créer des utilisateurs',
    'CAN_UPDATE_USER': 'Peut modifier les utilisateurs',
    'CAN_DELETE_USER': 'Peut supprimer les utilisateurs',
    
    // Role permissions
    'CAN_VIEW_ROLE': 'Peut consulter les rôles',
    'CAN_CREATE_ROLE': 'Peut créer des rôles',
    'CAN_UPDATE_ROLE': 'Peut modifier les rôles',
    'CAN_DELETE_ROLE': 'Peut supprimer les rôles',
    'CAN_GIVE_ROLE': 'Peut assigner des rôles',
    'CAN_GIVE_PERMISSION': 'Peut gérer les permissions',
    
    // Blog permissions
    'CAN_VIEW_BLOG': 'Peut consulter les blogs',
    'CAN_CREATE_BLOG': 'Peut créer des blogs',
    'CAN_UPDATE_BLOG': 'Peut modifier les blogs',
    'CAN_DELETE_BLOG': 'Peut supprimer les blogs',
    'CAN_PUBLISH_BLOG': 'Peut publier des blogs',
    
    // Job offer permissions
    'CAN_VIEW_JOB_OFFER': 'Peut consulter les offres d\'emploi',
    'CAN_CREATE_JOB_OFFER': 'Peut créer des offres d\'emploi',
    'CAN_UPDATE_JOB_OFFER': 'Peut modifier des offres d\'emploi',
    'CAN_DELETE_JOB_OFFER': 'Peut supprimer des offres d\'emploi',
    
    // Job application permissions
    'CAN_VIEW_JOB_APPLICATION': 'Peut consulter les candidatures emploi',
    'CAN_CHANGE_JOB_APPLICATION_STATUS': 'Peut changer le statut des candidatures emploi',
    'CAN_DELETE_JOB_ATTACHMENT': 'Peut supprimer les pièces jointes des candidatures',
    
    // Training session permissions
    'CAN_VIEW_TRAINING_SESSION': 'Peut consulter les sessions de formation',
    'CAN_CREATE_TRAINING_SESSION': 'Peut créer des sessions de formation',
    'CAN_UPDATE_TRAINING_SESSION': 'Peut modifier des sessions de formation',
    'CAN_DELETE_TRAINING_SESSION': 'Peut supprimer des sessions de formation',
    
    // Training permissions
    'CAN_VIEW_TRAINING': 'Peut consulter les formations',
    'CAN_CREATE_TRAINING': 'Peut créer des formations',
    'CAN_UPDATE_TRAINING': 'Peut modifier des formations',
    'CAN_DELETE_TRAINING': 'Peut supprimer des formations',
    
    // Student application permissions
    'CAN_VIEW_STUDENT_APPLICATION': 'Peut consulter les candidatures formation',
    'CAN_CHANGE_STUDENT_APPLICATION_STATUS': 'Peut changer le statut des candidatures formation',
    'CAN_DELETE_STUDENT_ATTACHMENT': 'Peut supprimer les pièces jointes des candidatures formation',
    
    // Reclamation type permissions
    'CAN_VIEW_RECLAMATION_TYPE': 'Peut consulter les types de réclamation',
    'CAN_CREATE_RECLAMATION_TYPE': 'Peut créer des types de réclamation',
    'CAN_UPDATE_RECLAMATION_TYPE': 'Peut modifier des types de réclamation',
    'CAN_DELETE_RECLAMATION_TYPE': 'Peut supprimer des types de réclamation',
    
    // Reclamation permissions
    'CAN_VIEW_RECLAMATION': 'Peut consulter les réclamations',
    'CAN_CHANGE_RECLAMATION_STATUS': 'Peut changer le statut des réclamations',
    
    // Specialty permissions
    'CAN_VIEW_SPECIALTY': 'Peut consulter les spécialités',
    'CAN_CREATE_SPECIALTY': 'Peut créer des spécialités',
    'CAN_UPDATE_SPECIALTY': 'Peut modifier des spécialités',
    'CAN_DELETE_SPECIALTY': 'Peut supprimer des spécialités',
    
    // Organization center permissions
    'CAN_VIEW_ORGANIZATION_CENTER': 'Peut consulter les centres d\'organisation',
    'CAN_CREATE_ORGANIZATION_CENTER': 'Peut créer des centres d\'organisation',
    'CAN_UPDATE_ORGANIZATION_CENTER': 'Peut modifier des centres d\'organisation',
    'CAN_DELETE_ORGANIZATION_CENTER': 'Peut supprimer des centres d\'organisation',
    
    // Payment permissions
    'CAN_VIEW_PAYMENT': 'Peut consulter les paiements',
  }
  return descriptions[permission] || permission
}

export const permissionService = {
  // Obtenir toutes les permissions disponibles
  getPermissions() {
    // Retourne la liste de toutes les permissions depuis l'enum
    return Object.entries(PermissionEnum).map(([key, value]) => ({
      name: value,
      key: key,
      description: getPermissionDescription(key)
    }))
  },

  async getUserPermissions(userId: string) {
    try {
      console.log('📎 Récupération permissions - UserId:', userId)
      
      // GET /users/permissions/{user_id}
      const response = await apiService.get(`/users/permissions/${userId}`)
      
      console.log('✅ Permissions utilisateur - Réponse:', response)
      return response
    } catch (error) {
      console.error('Erreur lors du chargement des permissions utilisateur:', error)
      
      // En production, on lance l'erreur plutôt que de retourner des données vides
      if (error?.response?.status === 403) {
        throw new Error('Vous n\'avez pas les permissions pour consulter les rôles de cet utilisateur.')
      } else if (error?.response?.status === 404) {
        throw new Error('Utilisateur non trouvé.')
      } else if (error?.message === 'Network Error') {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.')
      }
      
      // Fallback uniquement en cas d'erreur serveur pour éviter les blocages complets
      if (error?.response?.status === 500) {
        console.warn('Erreur serveur, utilisation de données vides comme fallback')
        return { data: [] }
      }
      
      throw new Error(error?.response?.data?.message || 'Erreur lors du chargement des permissions.')
    }
  },
  
  async assignPermissions(userId: string, permissions: string[]) {
    // POST /users/assign-permissions
    return apiService.post('/users/assign-permissions', { user_id: userId, permissions })
  },
  
  async revokePermissions(userId: string, permissions: string[]) {
    console.log('📎 Révocation permissions - Envoi:', { user_id: userId, permissions })
    
    // POST /users/revoke-permissions
    const response = await apiService.post('/users/revoke-permissions', { user_id: userId, permissions })
    
    console.log('✅ Révocation permissions - Réponse:', response)
    return response
  },
  
  // Gestion des rôles
  async assignRole(userId: string, roleId: number) {
    try {
      console.log('📎 Assignation rôle - Envoi:', { user_id: userId, role_id: roleId })
      
      // POST /users/assign-roles
      const response = await apiService.post('/users/assign-roles', { user_id: userId, role_id: roleId })
      
      console.log('✅ Assignation rôle - Réponse:', response)
      return response
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle:', error)
      
      // Gestion d'erreur améliorée pour la production
      if (error?.response?.status === 500) {
        throw new Error('Erreur serveur lors de l\'assignation du rôle. Veuillez réessayer.')
      } else if (error?.response?.status === 403) {
        throw new Error('Vous n\'avez pas les permissions nécessaires pour assigner ce rôle.')
      } else if (error?.response?.status === 404) {
        throw new Error('Utilisateur ou rôle non trouvé.')
      } else if (error?.message === 'Network Error') {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.')
      }
      
      throw new Error(error?.response?.data?.message || 'Erreur inconnue lors de l\'assignation du rôle.')
    }
  },
  
  async revokeRole(userId: string, roleId: number) {
    try {
      console.log('📎 Révocation rôle - Envoi:', { user_id: userId, role_id: roleId })
      
      // POST /users/revoke-role
      const response = await apiService.post('/users/revoke-role', { user_id: userId, role_id: roleId })
      
      console.log('✅ Révocation rôle - Réponse:', response)
      return response
    } catch (error) {
      console.error('Erreur lors de la révocation du rôle:', error)
      
      // Gestion d'erreur améliorée pour la production
      if (error?.response?.status === 500) {
        throw new Error('Erreur serveur lors de la révocation du rôle. Veuillez réessayer.')
      } else if (error?.response?.status === 403) {
        throw new Error('Vous n\'avez pas les permissions nécessaires pour révoquer ce rôle.')
      } else if (error?.response?.status === 404) {
        throw new Error('Utilisateur ou rôle non trouvé.')
      } else if (error?.message === 'Network Error') {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.')
      }
      
      throw new Error(error?.response?.data?.message || 'Erreur inconnue lors de la révocation du rôle.')
    }
  },
  
  // Obtenir tous les rôles disponibles
  async getRoles() {
    try {
      // Essayer d'abord l'appel API
      const response = await apiService.get('/users/roles')
      return response.data || response
    } catch (error) {
      console.warn('Impossible de récupérer les rôles depuis l\'API, utilisation des rôles par défaut:', error)
      
      // Fallback avec des rôles par défaut synchronisés avec le backend
      return [
        { id: 1, name: 'super_admin', description: 'Super administrateur avec tous les droits' },
        { id: 2, name: 'manager', description: 'Gestionnaire avec droits étendus' },
        { id: 3, name: 'visitor', description: 'Visiteur avec droits limités' }
      ]
    }
  }
}
