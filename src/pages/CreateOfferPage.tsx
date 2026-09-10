import { Navigate } from 'react-router-dom'

/**
 * Legacy create-offer route — opens the listing Create Offer side panel.
 */
export function CreateOfferPage() {
  return (
    <Navigate to="/offer-management" replace state={{ createOffer: true }} />
  )
}
