import { useState, useEffect } from 'react'
import { LoginPage } from './components/LoginPage.jsx'
import { Navigation } from './components/Navigation.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { UserManagement } from './components/UserManagement.jsx'
import Content from './pages/Content.jsx'
import { CRMManagement } from './components/CRMManagement.jsx'
import Analytics from './components/Analytics.jsx'
import Settings from './components/Settings.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // التحقق من وجود token عند تحميل التطبيق
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'team':
        return <UserManagement />
      case 'content':
        return <Content />
      case 'crm':
        return <CRMManagement />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  // إذا لم يكن المستخدم مسجل الدخول، عرض صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div dir="rtl">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  )
}

export default App

