import { useCallback, useRef, useState } from 'react'
import {
  ProfileAddCompensationPanel,
  ProfileAddEducationPanel,
  ProfileAddJobPanel,
  ProfileCompensationSection,
  ProfileEditPersonalPanel,
  ProfileEducationSection,
  ProfileJobInfoSection,
  ProfileLeftSection,
  ProfilePersonalInfoSection,
  ProfileResumeBanner,
  ProfileSkillsSection,
} from '../components/my-profile'
import { PageContainer, PageHeader } from '../components/layout'
import {
  addCompensation,
  addEducation,
  addJobInformation,
  addProfileSkill,
  getMyProfile,
  getPendingItems,
  removeProfileSkill,
  setProfileResume,
  updatePersonalInfo,
  type MyProfileState,
  type PendingItemId,
} from '../data/myProfile'
import { toast } from '../components/ui'

/**
 * Candidate portal — My Profile with empty and filled section states.
 */
export function MyProfilePage() {
  const skillsInputRef = useRef<HTMLInputElement>(null)
  const resumeSectionRef = useRef<HTMLElement>(null)
  const skillsSectionRef = useRef<HTMLElement>(null)
  const educationSectionRef = useRef<HTMLElement>(null)

  const [profile, setProfile] = useState<MyProfileState>(() => getMyProfile())
  const [editPersonalOpen, setEditPersonalOpen] = useState(false)
  const [addJobOpen, setAddJobOpen] = useState(false)
  const [addCompensationOpen, setAddCompensationOpen] = useState(false)
  const [addEducationOpen, setAddEducationOpen] = useState(false)

  const pendingItems = getPendingItems(profile)

  const refreshProfile = useCallback(() => {
    setProfile(getMyProfile())
  }, [])

  function scrollToSection(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handlePendingAdd(id: PendingItemId) {
    switch (id) {
      case 'resume':
        scrollToSection(resumeSectionRef)
        return
      case 'personal-info':
        setEditPersonalOpen(true)
        return
      case 'job-information':
        setAddJobOpen(true)
        return
      case 'compensation':
        setAddCompensationOpen(true)
        return
      case 'education':
        scrollToSection(educationSectionRef)
        setAddEducationOpen(true)
        return
      case 'skills':
        scrollToSection(skillsSectionRef)
        skillsInputRef.current?.focus()
        return
      default: {
        const _exhaustive: never = id
        return _exhaustive
      }
    }
  }

  function handleResumeUpload(file: File) {
    setProfileResume(file.name)
    refreshProfile()
    toast.success('Resume uploaded successfully.', { title: 'My Profile' })
  }

  function handleAddSkill(skill: string) {
    const result = addProfileSkill(skill)
    if (result.ok) {
      refreshProfile()
      toast.success('Skill added.', { title: 'My Profile' })
    }
    return result
  }

  function handleRemoveSkill(skill: string) {
    removeProfileSkill(skill)
    refreshProfile()
  }

  return (
    <>
      <PageContainer contentClassName="gap-0">
        <PageHeader
          title="My Profile"
          subtitle="Keep your resume, skills, and experience up to date."
        />

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[21rem_minmax(0,1fr)] xl:items-start">
          <aside className="xl:sticky xl:top-0">
            <ProfileLeftSection
              profile={profile}
              pendingItems={pendingItems}
              onProfileUpdate={refreshProfile}
              onPendingAdd={handlePendingAdd}
            />
          </aside>

          <div className="flex min-w-0 flex-col gap-4">
            <section ref={resumeSectionRef}>
              <ProfileResumeBanner
                fileName={profile.resumeFileName}
                onUpload={handleResumeUpload}
              />
            </section>

            <ProfilePersonalInfoSection
              personalInfo={profile.personalInfo}
              onEdit={() => setEditPersonalOpen(true)}
            />

            <ProfileJobInfoSection
              entries={profile.jobInformation}
              onAdd={() => setAddJobOpen(true)}
            />

            <ProfileCompensationSection
              entries={profile.compensation}
              onAdd={() => setAddCompensationOpen(true)}
            />

            <section ref={educationSectionRef}>
              <ProfileEducationSection
                entries={profile.education}
                onAdd={() => setAddEducationOpen(true)}
              />
            </section>

            <section ref={skillsSectionRef}>
              <ProfileSkillsSection
                skills={profile.skills}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
                inputRef={skillsInputRef}
              />
            </section>
          </div>
        </div>
      </PageContainer>

      <ProfileEditPersonalPanel
        open={editPersonalOpen}
        personalInfo={profile.personalInfo}
        onClose={() => setEditPersonalOpen(false)}
        onSave={(info) => {
          updatePersonalInfo(info)
          refreshProfile()
          toast.success('Personal information updated.', { title: 'My Profile' })
        }}
      />

      <ProfileAddJobPanel
        open={addJobOpen}
        onClose={() => setAddJobOpen(false)}
        onSave={(entry) => {
          addJobInformation(entry)
          refreshProfile()
          toast.success('Job information added.', { title: 'My Profile' })
        }}
      />

      <ProfileAddCompensationPanel
        open={addCompensationOpen}
        onClose={() => setAddCompensationOpen(false)}
        onSave={(entry) => {
          addCompensation(entry)
          refreshProfile()
          toast.success('Compensation added.', { title: 'My Profile' })
        }}
      />

      <ProfileAddEducationPanel
        open={addEducationOpen}
        onClose={() => setAddEducationOpen(false)}
        onSave={(entry) => {
          addEducation(entry)
          refreshProfile()
          toast.success('Education added.', { title: 'My Profile' })
        }}
      />
    </>
  )
}
