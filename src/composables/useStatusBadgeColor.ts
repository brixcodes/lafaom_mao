import { TrainingStatus } from '@/types/training'

export const useStatusBadgeColor = (status: TrainingStatus): string => {
  const colorMap: Record<TrainingStatus, string> = {
    [TrainingStatus.ACTIVE]: 'success',
    [TrainingStatus.INACTIVE]: 'warning',
  }

  return colorMap[status] || 'default'
}

export const useSessionStatusBadgeColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    OPEN_FOR_REGISTRATION: 'success',
    CLOSE_FOR_REGISTRATION: 'warning',
    ONGOING: 'info',
    COMPLETED: 'secondary',
  }

  return colorMap[status] || 'default'
}

export const useApplicationStatusBadgeColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    RECEIVED: 'info',
    APPROVED: 'success',
    REFUSED: 'error',
  }

  return colorMap[status] || 'default'
}
