import { JobListings } from '@/components/job-listings'
import StudentSidebarLayout from '@/components/student-sidebar-layout'

export default function JobListingsPage() {
  return (
    <StudentSidebarLayout>
      <JobListings />
    </StudentSidebarLayout>
  )
}
