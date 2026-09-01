import { Check } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  changeAccountPassword,
  deactivateAccount,
  deleteAccountData,
  getAccountSettings,
  sendEmailVerificationCode,
  setTwoFactorEnabled,
  verifyEmailWithCode,
  type AccountSettingsState,
  type ChangePasswordFieldErrors,
} from '../../data/accountSettings'
import { setAuthenticated } from '../../lib/auth'
import { Button, Input, Modal, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { SettingsPreferenceCard } from './SettingsPreferenceCard'

const DELETE_CONFIRMATION = 'DELETE'

/**
 * Candidate Settings — account security and profile actions.
 */
export function AccountSettingsPanel() {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountSettingsState>(() =>
    getAccountSettings(),
  )

  const [verifyEmailOpen, setVerifyEmailOpen] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  )
  const [codeSent, setCodeSent] = useState(false)

  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordFieldErrors>(
    {},
  )

  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [twoFactorMode, setTwoFactorMode] = useState<'enable' | 'disable'>(
    'enable',
  )

  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const refreshAccount = useCallback(() => {
    setAccount(getAccountSettings())
  }, [])

  function resetVerifyEmailModal() {
    setVerifyEmailOpen(false)
    setVerificationCode('')
    setVerificationError(null)
    setCodeSent(false)
  }

  function resetChangePasswordModal() {
    setChangePasswordOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordErrors({})
  }

  function handleSendVerificationCode() {
    sendEmailVerificationCode()
    refreshAccount()
    setCodeSent(true)
    setVerificationError(null)
    toast.success('Verification code sent to your email.', {
      title: 'Email Verification',
    })
  }

  function handleVerifyEmail() {
    const result = verifyEmailWithCode(verificationCode)
    if (!result.ok) {
      setVerificationError(result.error ?? 'Verification failed.')
      return
    }

    refreshAccount()
    resetVerifyEmailModal()
    toast.success('Your email address has been verified.', {
      title: 'Email Verification',
    })
  }

  function handleChangePassword() {
    const result = changeAccountPassword(
      currentPassword,
      newPassword,
      confirmPassword,
    )

    if (!result.ok) {
      setPasswordErrors(result.errors ?? {})
      return
    }

    resetChangePasswordModal()
    toast.success('Your password has been updated.', {
      title: 'Change Password',
    })
  }

  function openTwoFactorModal(mode: 'enable' | 'disable') {
    setTwoFactorMode(mode)
    setTwoFactorOpen(true)
  }

  function handleTwoFactorConfirm() {
    const enabled = twoFactorMode === 'enable'
    setTwoFactorEnabled(enabled)
    refreshAccount()
    setTwoFactorOpen(false)
    toast.success(
      enabled
        ? 'Two-factor authentication is now enabled.'
        : 'Two-factor authentication has been disabled.',
      { title: 'Two-Factor Authentication' },
    )
  }

  function handleDeactivate() {
    deactivateAccount()
    setDeactivateOpen(false)
    setAuthenticated(false)
    toast.success('Your account has been deactivated.', {
      title: 'Deactivate Account',
    })
    navigate('/login', { replace: true })
  }

  function handleDeleteAccount() {
    if (deleteConfirmation.trim() !== DELETE_CONFIRMATION) {
      return
    }

    deleteAccountData()
    setDeleteOpen(false)
    setDeleteConfirmation('')
    setAuthenticated(false)
    toast.success('Your account has been permanently deleted.', {
      title: 'Delete Account',
    })
    navigate('/login', { replace: true })
  }

  return (
    <>
      <SettingsPanel title="Account Settings">
        <SettingsPreferenceCard
          title="Email Address"
          description={account.email}
          action={
            account.emailVerified ? (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#21A54E] px-3.5 text-sm font-semibold text-white">
                Verified
                <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </span>
            ) : (
              <Button
                type="button"
                className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
                onClick={() => setVerifyEmailOpen(true)}
              >
                Verify
              </Button>
            )
          }
        />

        <SettingsPreferenceCard
          title="Change Password"
          description="Update your password regularly to keep your account secure"
          action={
            <Button
              type="button"
              className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change
            </Button>
          }
        />

        <SettingsPreferenceCard
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          action={
            account.twoFactorEnabled ? (
              <Button
                type="button"
                variant="outline"
                className="!h-9 !rounded-md border-[#2D2061] px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#F5F6FF]"
                onClick={() => openTwoFactorModal('disable')}
              >
                Disable
              </Button>
            ) : (
              <Button
                type="button"
                className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
                onClick={() => openTwoFactorModal('enable')}
              >
                Enable
              </Button>
            )
          }
        />

        <SettingsPreferenceCard
          title="Deactivate Account"
          description="Deactivating your account will hide your profile and pause all activity. You can reactivate it anytime by logging back in."
          action={
            <Button
              type="button"
              className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              onClick={() => setDeactivateOpen(true)}
            >
              Deactivate
            </Button>
          }
        />

        <SettingsPreferenceCard
          title="Delete Account"
          description="Deleting your account will permanently remove all your data, including your profile and job applications. This action cannot be undone."
          action={
            <Button
              type="button"
              className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          }
        />
      </SettingsPanel>

      <Modal
        open={verifyEmailOpen}
        onClose={resetVerifyEmailModal}
        title="Verify Email Address"
      >
        <p className="text-sm text-[#5c5878]">
          We will send a verification code to{' '}
          <span className="font-semibold text-[#2D2061]">{account.email}</span>.
        </p>

        {codeSent ? (
          <div className="mt-4">
            <Input
              name="verificationCode"
              label="Verification code"
              requiredMark
              value={verificationCode}
              onChange={(event) => {
                setVerificationCode(event.target.value)
                setVerificationError(null)
              }}
              error={verificationError ?? undefined}
              placeholder="Enter 6-digit code"
              autoComplete="one-time-code"
            />
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="!h-9 !rounded-md"
            onClick={resetVerifyEmailModal}
          >
            Cancel
          </Button>
          {codeSent ? (
            <Button
              type="button"
              className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              onClick={handleVerifyEmail}
            >
              Verify
            </Button>
          ) : (
            <Button
              type="button"
              className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              onClick={handleSendVerificationCode}
            >
              Send code
            </Button>
          )}
        </div>
      </Modal>

      <Modal
        open={changePasswordOpen}
        onClose={resetChangePasswordModal}
        title="Change Password"
      >
        <div className="flex flex-col gap-4">
          <Input
            name="currentPassword"
            label="Current password"
            requiredMark
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value)
              setPasswordErrors((prev) => ({
                ...prev,
                currentPassword: undefined,
              }))
            }}
            error={passwordErrors.currentPassword}
            autoComplete="current-password"
          />
          <Input
            name="newPassword"
            label="New password"
            requiredMark
            type="password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value)
              setPasswordErrors((prev) => ({
                ...prev,
                newPassword: undefined,
              }))
            }}
            error={passwordErrors.newPassword}
            autoComplete="new-password"
          />
          <Input
            name="confirmPassword"
            label="Confirm new password"
            requiredMark
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setPasswordErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }))
            }}
            error={passwordErrors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="!h-9 !rounded-md"
            onClick={resetChangePasswordModal}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={handleChangePassword}
          >
            Update password
          </Button>
        </div>
      </Modal>

      <Modal
        open={twoFactorOpen}
        onClose={() => setTwoFactorOpen(false)}
        title={
          twoFactorMode === 'enable'
            ? 'Enable Two-Factor Authentication'
            : 'Disable Two-Factor Authentication'
        }
      >
        <p className="text-sm text-[#5c5878]">
          {twoFactorMode === 'enable'
            ? 'Two-factor authentication adds an extra verification step when you sign in. Are you sure you want to enable it?'
            : 'Disabling two-factor authentication will remove the extra sign-in verification step. Are you sure you want to disable it?'}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="!h-9 !rounded-md"
            onClick={() => setTwoFactorOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={handleTwoFactorConfirm}
          >
            {twoFactorMode === 'enable' ? 'Enable' : 'Disable'}
          </Button>
        </div>
      </Modal>

      <Modal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        title="Deactivate Account"
      >
        <p className="text-sm text-[#5c5878]">
          Your profile will be hidden and activity paused until you sign in
          again. You can reactivate your account at any time by logging back in.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="!h-9 !rounded-md"
            onClick={() => setDeactivateOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
        </div>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteConfirmation('')
        }}
        title="Delete Account"
      >
        <p className="text-sm text-[#5c5878]">
          This will permanently remove your profile and job applications. This
          action cannot be undone. Type{' '}
          <span className="font-semibold text-[#2D2061]">
            {DELETE_CONFIRMATION}
          </span>{' '}
          to confirm.
        </p>
        <div className="mt-4">
          <Input
            name="deleteConfirmation"
            label="Confirmation"
            requiredMark
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            placeholder={DELETE_CONFIRMATION}
            autoComplete="off"
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="!h-9 !rounded-md"
            onClick={() => {
              setDeleteOpen(false)
              setDeleteConfirmation('')
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!h-9 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={deleteConfirmation.trim() !== DELETE_CONFIRMATION}
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </div>
      </Modal>
    </>
  )
}
