import { useState } from 'react'
import { Navigation } from './components/Navigation.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { TeamManagement } from './components/TeamManagement.jsx'
import { ContentManagement } from './components/ContentManagement.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'team':
        return <TeamManagement />
      case 'content':
        return <ContentManagement />
      case 'crm':
        return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">صفحة إدارة المرضى (CRM) - قيد التطوير</h1>
        </div>
      case 'analytics':
        return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">صفحة التحليلات - قيد التطوير</h1>
        </div>
      case 'settings':
        return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">صفحة الإعدادات - قيد التطوير</h1>
        </div>
      default:
        return <Dashboard />
    }
  }

  return (
    <div dir="rtl">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App
