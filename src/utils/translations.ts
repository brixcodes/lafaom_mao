// Traductions françaises pour les rôles et permissions
export const roleTranslations: Record<string, string> = {
  'SUPER_ADMIN': 'Super Administrateur',
  'MANAGER': 'Gestionnaire',
  'VISITOR': 'Visiteur',
  'ADMIN': 'Administrateur',
  'STAFF': 'Personnel',
  'TEACHER': 'Formateur',
  'STUDENT': 'Étudiant',
  'super_admin': 'Super Administrateur',
  'manager': 'Gestionnaire',
  'visitor': 'Visiteur',
  'admin': 'Administrateur',
  'staff': 'Personnel',
  'teacher': 'Formateur',
  'student': 'Étudiant'
}

export const permissionTranslations: Record<string, string> = {
  // Permissions utilisateurs
  'can_view_user': 'Consulter les utilisateurs',
  'can_create_user': 'Créer des utilisateurs',
  'can_update_user': 'Modifier les utilisateurs',
  'can_delete_user': 'Supprimer les utilisateurs',
  
  // Permissions rôles
  'can_view_role': 'Consulter les rôles',
  'can_create_role': 'Créer des rôles',
  'can_update_role': 'Modifier les rôles',
  'can_delete_role': 'Supprimer les rôles',
  'can_give_role': 'Assigner des rôles',
  'can_give_permission': 'Assigner des permissions',
  
  // Permissions blog
  'can_view_blog': 'Consulter les articles',
  'can_create_blog': 'Créer des articles',
  'can_update_blog': 'Modifier les articles',
  'can_delete_blog': 'Supprimer les articles',
  'can_publish_blog': 'Publier des articles',
  
  // Permissions offres d'emploi
  'can_view_job_offer': 'Consulter les offres d\'emploi',
  'can_create_job_offer': 'Créer des offres d\'emploi',
  'can_update_job_offer': 'Modifier les offres d\'emploi',
  'can_delete_job_offer': 'Supprimer les offres d\'emploi',
  
  // Permissions candidatures emploi
  'can_view_job_application': 'Consulter les candidatures emploi',
  'can_create_job_application': 'Créer des candidatures emploi',
  'can_update_job_application': 'Modifier les candidatures emploi',
  'can_delete_job_application': 'Supprimer les candidatures emploi',
  'can_change_job_application_status': 'Modifier le statut des candidatures emploi',
  'can_delete_job_attachment': 'Supprimer les pièces jointes des candidatures',
  
  // Permissions sessions de formation
  'can_update_training_session': 'Modifier les sessions de formation',
  'can_create_training_session': 'Créer des sessions de formation',
  'can_delete_training_session': 'Supprimer les sessions de formation',
  'can_view_training_session': 'Consulter les sessions de formation',
  
  // Permissions formations
  'can_view_training': 'Consulter les formations',
  'can_create_training': 'Créer des formations',
  'can_update_training': 'Modifier les formations',
  'can_delete_training': 'Supprimer les formations',
  
  // Permissions candidatures étudiants
  'can_view_student_application': 'Consulter les candidatures étudiants',
  'can_change_student_application_status': 'Modifier le statut des candidatures étudiants',
  'can_delete_student_attachment': 'Supprimer les pièces jointes des candidatures étudiants',
  
  // Permissions types de réclamation
  'can_update_reclamation_type': 'Modifier les types de réclamation',
  'can_create_reclamation_type': 'Créer des types de réclamation',
  'can_delete_reclamation_type': 'Supprimer les types de réclamation',
  'can_view_reclamation_type': 'Consulter les types de réclamation',
  
  // Permissions réclamations
  'can_view_reclamation': 'Consulter les réclamations',
  'can_change_reclamation_status': 'Modifier le statut des réclamations',
  
  // Permissions spécialités
  'can_view_specialty': 'Consulter les spécialités',
  'can_create_specialty': 'Créer des spécialités',
  'can_update_specialty': 'Modifier les spécialités',
  'can_delete_specialty': 'Supprimer les spécialités',
  
  // Permissions centres d'organisation
  'can_view_organization_center': 'Consulter les centres d\'organisation',
  'can_create_organization_center': 'Créer des centres d\'organisation',
  'can_update_organization_center': 'Modifier les centres d\'organisation',
  'can_delete_organization_center': 'Supprimer les centres d\'organisation',
  
  // Permissions paiements
  'can_view_payment': 'Consulter les paiements'
}

// Traductions pour l'interface de gestion des rôles et permissions
export const interfaceTranslations = {
  // Titres et sections
  'role_management': 'Gestion des Rôles',
  'permission_management': 'Gestion des Permissions',
  'user_information': 'Informations utilisateur',
  
  // Boutons et actions
  'assign_role': 'Assigner un rôle',
  'assign_permissions': 'Assigner des permissions',
  'assign': 'Assigner',
  'revoke': 'Révoquer',
  'cancel': 'Annuler',
  'confirm': 'Confirmer',
  'close': 'Fermer',
  'reset': 'Réinitialiser',
  'refresh': 'Actualiser',
  
  // Messages d'état
  'no_role_assigned': 'Aucun rôle assigné à cet utilisateur',
  'no_permissions_assigned': 'Aucune permission assignée à cet utilisateur',
  'role_already_assigned': 'Rôle déjà assigné',
  'user_has_role_warning': 'Cet utilisateur a déjà un rôle assigné. Pour changer de rôle, révoquez d\'abord le rôle actuel.',
  
  // Statistiques
  'roles_assigned': 'rôle(s) assigné(s)',
  'permissions_assigned': 'permission(s) assignée(s)',
  'permissions_found': 'permission(s) trouvée(s)',
  
  // Formulaires et sélections
  'select_role': 'Sélectionner un rôle',
  'select_permissions': 'Sélectionner des permissions',
  'filter_by_category': 'Filtrer par catégorie',
  'search_permission': 'Rechercher une permission',
  
  // Confirmations
  'confirm_title': 'Êtes-vous sûr ?',
  'confirm_revoke_role': 'Souhaitez-vous réellement révoquer ce rôle ? L\'utilisateur perdra toutes les permissions associées.',
  'confirm_revoke_permission': 'Souhaitez-vous réellement révoquer la permission',
  'confirm_assign_role': 'Souhaitez-vous réellement assigner le rôle',
  'confirm_assign_permissions': 'Souhaitez-vous réellement assigner',
  'confirm_assign_all_permissions': 'Souhaitez-vous réellement assigner toutes les permissions disponibles ? L\'utilisateur aura un accès complet au système.',
  'confirm_assign_manager_permissions': 'Souhaitez-vous réellement assigner les permissions de Gestionnaire ? L\'utilisateur pourra gérer les utilisateurs, formations et contenus.',
  'confirm_assign_viewer_permissions': 'Souhaitez-vous réellement assigner les permissions de consultation ? L\'utilisateur pourra uniquement consulter les données sans les modifier.',
  'confirm_revoke_all': 'Souhaitez-vous réellement révoquer toutes les permissions et rôles ? L\'utilisateur perdra complètement l\'accès au système. Cette action est irréversible.',
  
  // Messages de conséquence
  'user_will_lose_permissions': 'L\'utilisateur perdra toutes les permissions associées.',
  'user_will_lose_capacity': 'L\'utilisateur perdra cette capacité.',
  'user_will_have_full_access': 'L\'utilisateur aura un accès complet au système.',
  'user_will_have_role_permissions': 'Il aura toutes les permissions associées à ce rôle.',
  'user_will_have_functionalities': 'Il aura accès aux fonctionnalités correspondantes.',
  'user_can_manage': 'L\'utilisateur pourra gérer les utilisateurs, formations et contenus.',
  'user_can_view_only': 'L\'utilisateur pourra uniquement consulter les données sans les modifier.',
  'user_will_lose_access': 'L\'utilisateur perdra complètement l\'accès au système.',
  'action_irreversible': 'Cette action est irréversible.',
  
  // Actions rapides
  'assign_all_permissions': 'Assigner toutes les permissions',
  'assign_manager_permissions': 'Assigner les permissions Gestionnaire',
  'assign_viewer_permissions': 'Assigner les permissions Consultation',
  'revoke_all_permissions': 'Révoquer toutes les permissions'
}

// Fonction pour traduire un rôle
export const translateRole = (role: string): string => {
  return roleTranslations[role] || role
}

// Fonction pour traduire les textes de l'interface
export const translateInterface = (key: string): string => {
  return (interfaceTranslations as Record<string, string>)[key] || key
}

// Fonction pour traduire une permission
export const translatePermission = (permission: string): string => {
  return permissionTranslations[permission] || permission
}

// Fonction pour traduire une liste de permissions
export const translatePermissions = (permissions: string[]): string[] => {
  return permissions.map(permission => translatePermission(permission))
}

// Fonction pour traduire une liste de rôles
export const translateRoles = (roles: string[]): string[] => {
  return roles.map(role => translateRole(role))
}

// Fonction pour obtenir la description d'un rôle
export const getRoleDescription = (role: string): string => {
  const descriptions: Record<string, string> = {
    'SUPER_ADMIN': 'Accès complet à toutes les fonctionnalités du système',
    'MANAGER': 'Gestion des utilisateurs, contenus et opérations courantes',
    'VISITOR': 'Accès en lecture seule aux informations publiques',
    'ADMIN': 'Administration complète du système',
    'STAFF': 'Accès aux fonctionnalités de gestion quotidienne',
    'TEACHER': 'Gestion des formations et des étudiants',
    'STUDENT': 'Accès aux formations et aux ressources d\'apprentissage'
  }
  return descriptions[role] || 'Rôle personnalisé'
}

// Fonction pour obtenir la catégorie d'une permission
export const getPermissionCategory = (permission: string): string => {
  if (permission.includes('USER')) return 'Utilisateurs'
  if (permission.includes('ROLE')) return 'Rôles'
  if (permission.includes('BLOG')) return 'Articles'
  if (permission.includes('JOB_OFFER')) return 'Offres d\'emploi'
  if (permission.includes('JOB_APPLICATION')) return 'Candidatures emploi'
  if (permission.includes('TRAINING_SESSION')) return 'Sessions de formation'
  if (permission.includes('TRAINING')) return 'Formations'
  if (permission.includes('STUDENT_APPLICATION')) return 'Candidatures étudiants'
  if (permission.includes('RECLAMATION_TYPE')) return 'Types de réclamation'
  if (permission.includes('RECLAMATION')) return 'Réclamations'
  if (permission.includes('SPECIALTY')) return 'Spécialités'
  if (permission.includes('ORGANIZATION_CENTER')) return 'Centres d\'organisation'
  if (permission.includes('PAYMENT')) return 'Paiements'
  return 'Autres'
}

// Fonction pour obtenir l'icône d'une permission
export const getPermissionIcon = (permission: string): string => {
  if (permission.includes('VIEW')) return 'ri-eye-line'
  if (permission.includes('CREATE')) return 'ri-add-line'
  if (permission.includes('UPDATE')) return 'ri-edit-line'
  if (permission.includes('DELETE')) return 'ri-delete-bin-line'
  if (permission.includes('CHANGE')) return 'ri-refresh-line'
  if (permission.includes('EXPORT')) return 'ri-download-line'
  if (permission.includes('PUBLISH')) return 'ri-send-plane-line'
  return 'ri-shield-line'
}

// Fonction pour obtenir la couleur d'une permission
export const getPermissionColor = (permission: string): string => {
  if (permission.includes('VIEW')) return 'info'
  if (permission.includes('CREATE')) return 'success'
  if (permission.includes('UPDATE')) return 'warning'
  if (permission.includes('DELETE')) return 'error'
  if (permission.includes('CHANGE')) return 'primary'
  if (permission.includes('EXPORT')) return 'secondary'
  if (permission.includes('PUBLISH')) return 'success'
  return 'default'
}
