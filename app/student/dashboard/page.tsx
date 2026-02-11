import { StudentDashboard } from '@/components/student-dashboard'
import StudentSidebarLayout from '@/components/student-sidebar-layout'

export default function StudentDashboardPage() {
  return (
    <StudentSidebarLayout>
      <StudentDashboard />
    </StudentSidebarLayout>
  )
}
