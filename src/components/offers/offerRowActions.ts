import type { ThreeDotsMenuItem } from '../ui/ThreeDotsMenu'
import type { OfferStatus } from '../../data/offers'

export type OfferRowActionId =
  | 'view'
  | 'submitApproval'
  | 'duplicate'
  | 'delete'
  | 'sendReminder'
  | 'revise'
  | 'withdraw'
  | 'moveToOnboarding'
  | 'updateJoiningDate'
  | 'rescind'
  | 'renew'

type OfferMenuItem = Pick<ThreeDotsMenuItem, 'id' | 'label' | 'destructive'> & {
  id: OfferRowActionId
}

/**
 * Status-specific ⋮ actions for Offer Management rows.
 * Declined and Withdrawn share the same menu.
 */
export function getOfferRowMenuItems(status: OfferStatus): OfferMenuItem[] {
  switch (status) {
    case 'draft':
      return [
        { id: 'view', label: 'View Offer' },
        { id: 'submitApproval', label: 'Submit for Approval' },
        { id: 'duplicate', label: 'Duplicate' },
        { id: 'delete', label: 'Delete', destructive: true },
      ]
    case 'sent':
      return [
        { id: 'view', label: 'View Offer' },
        { id: 'sendReminder', label: 'Send Reminder' },
        { id: 'revise', label: 'Revise Offer' },
        { id: 'withdraw', label: 'Withdraw Offer' },
      ]
    case 'accepted':
      return [
        { id: 'view', label: 'View Offer' },
        { id: 'moveToOnboarding', label: 'Move to Onboarding' },
        { id: 'updateJoiningDate', label: 'Update Joining Date' },
        { id: 'rescind', label: 'Rescind Offer', destructive: true },
      ]
    case 'declined':
    case 'withdrawn':
      return [
        { id: 'view', label: 'View Offer' },
        { id: 'duplicate', label: 'Duplicate' },
      ]
    case 'expired':
      return [
        { id: 'view', label: 'View Offer' },
        { id: 'renew', label: 'Renew/Create New' },
        { id: 'duplicate', label: 'Duplicate' },
      ]
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}
