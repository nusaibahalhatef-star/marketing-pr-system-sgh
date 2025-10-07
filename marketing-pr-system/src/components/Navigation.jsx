import { Button } from '@/components/ui/button.jsx'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  UserCheck,
  BarChart3,
  Settings
} from 'lucide-react'

export function Navigation({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'team', label: 'إدارة الفريق', icon: Users },
    { id: 'content', label: 'إدارة المحتوى', icon: FileText },
    { id: 'crm', label: 'إدارة المرضى', icon: UserCheck },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ]

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8 space-x-reverse">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <span className="mr-3 text-xl font-bold text-slate-900 dark:text-white">
                المستشفى السعودي الألماني
              </span>
            </div>
            
            <div className="hidden md:flex space-x-4 space-x-reverse">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    className={`flex items-center ${
                      currentPage === item.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button variant="outline" size="sm">
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
