import { Lock, Minus, Plus } from 'lucide-react'
import { Select } from '../../ui'
import { CLIENT_USER_ROLE_OPTIONS } from '../../../data/clients'
import type { CreateClientFormState } from './types'
import { StepHeader } from './StepChrome'

type Props = {
  value: CreateClientFormState
  onChange: (patch: Partial<CreateClientFormState>) => void
}

export function StepClientUserDetails({ value, onChange }: Props) {
  function updateDraft(
    patch: Partial<CreateClientFormState['draftUser']>,
  ) {
    onChange({ draftUser: { ...value.draftUser, ...patch } })
  }

  function addUser() {
    const { firstName, lastName, email, role } = value.draftUser
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !role) {
      return
    }
    onChange({
      users: [
        ...value.users,
        {
          id: `user-${Date.now()}`,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          role,
        },
      ],
      draftUser: { firstName: '', lastName: '', email: '', role: '' },
    })
  }

  function removeUser(id: string) {
    onChange({ users: value.users.filter((user) => user.id !== id) })
  }

  function toggleLock(id: string) {
    onChange({
      users: value.users.map((user) =>
        user.id === id ? { ...user, locked: !user.locked } : user,
      ),
    })
  }

  return (
    <div>
      <StepHeader title="Client User Details" />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E8E6F0]">
              {['First Name', 'Last Name', 'Email', 'Role', ''].map((label) => (
                <th
                  key={label || 'actions'}
                  className="px-2 pb-3 text-[12px] font-semibold uppercase tracking-wide text-[#6B6B80]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.users.map((user) => (
              <tr key={user.id} className="border-b border-[#F0EEF5]">
                <td className="px-2 py-3 text-sm text-[#2A2740]">
                  {user.firstName}
                </td>
                <td className="px-2 py-3 text-sm text-[#2A2740]">
                  {user.lastName}
                </td>
                <td className="px-2 py-3 text-sm text-[#2A2740]">{user.email}</td>
                <td className="px-2 py-3 text-sm text-[#2A2740]">{user.role}</td>
                <td className="px-2 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      aria-label={`Remove ${user.firstName} ${user.lastName}`}
                      className="inline-flex size-8 items-center justify-center rounded-md bg-[#2D2061] text-white transition-colors hover:bg-[#241a52]"
                    >
                      <Minus className="size-3.5" strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLock(user.id)}
                      aria-label={
                        user.locked
                          ? `Unlock ${user.firstName}`
                          : `Lock ${user.firstName}`
                      }
                      className="inline-flex size-8 items-center justify-center rounded-md bg-[#2D2061] text-white transition-colors hover:bg-[#241a52]"
                    >
                      <Lock className="size-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            <tr>
              <td className="px-2 py-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={value.draftUser.firstName}
                  onChange={(e) => updateDraft({ firstName: e.target.value })}
                  className="h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
              </td>
              <td className="px-2 py-3">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={value.draftUser.lastName}
                  onChange={(e) => updateDraft({ lastName: e.target.value })}
                  className="h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
              </td>
              <td className="px-2 py-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={value.draftUser.email}
                  onChange={(e) => updateDraft({ email: e.target.value })}
                  className="h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
              </td>
              <td className="px-2 py-3">
                <Select
                  options={CLIENT_USER_ROLE_OPTIONS}
                  value={value.draftUser.role}
                  onChange={(e) => updateDraft({ role: e.target.value })}
                  placeholder="Role"
                />
              </td>
              <td className="px-2 py-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addUser}
                    aria-label="Add client user"
                    className="inline-flex size-8 items-center justify-center rounded-md bg-[#2D2061] text-white transition-colors hover:bg-[#241a52]"
                  >
                    <Plus className="size-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
