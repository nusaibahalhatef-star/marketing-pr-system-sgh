import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react'

export function TeamManagement() {
  const teamMembers = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مدير التسويق',
      email: 'ahmed@hospital.com',
      phone: '+966 50 123 4567',
      tasks: 12,
      completed: 8,
      status: 'نشط'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      role: 'أخصائية تسويق رقمي',
      email: 'fatima@hospital.com',
      phone: '+966 55 234 5678',
      tasks: 8,
      completed: 6,
      status: 'نشط'
    },
    {
      id: 3,
      name: 'محمد سعيد',
      role: 'مسؤول علاقات عامة',
      email: 'mohammed@hospital.com',
      phone: '+966 50 345 6789',
      tasks: 10,
      completed: 7,
      status: 'نشط'
    },
    {
      id: 4,
      name: 'نورة خالد',
      role: 'منسقة محتوى',
      email: 'noura@hospital.com',
      phone: '+966 55 456 7890',
      tasks: 15,
      completed: 12,
      status: 'نشط'
    },
    {
      id: 5,
      name: 'عبدالله حسن',
      role: 'مندوب ميداني',
      email: 'abdullah@hospital.com',
      phone: '+966 50 567 8901',
      tasks: 6,
      completed: 5,
      status: 'في الميدان'
    },
    {
      id: 6,
      name: 'سارة عبدالرحمن',
      role: 'مصممة جرافيك',
      email: 'sara@hospital.com',
      phone: '+966 55 678 9012',
      tasks: 9,
      completed: 7,
      status: 'نشط'
    }
  ]

  const performanceStats = [
    { label: 'إجمالي المهام', value: 60, color: 'bg-blue-600' },
    { label: 'المهام المكتملة', value: 45, color: 'bg-green-600' },
    { label: 'المهام الجارية', value: 12, color: 'bg-yellow-600' },
    { label: 'المهام المتأخرة', value: 3, color: 'bg-red-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              إدارة فريق التسويق والعلاقات العامة
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              إدارة أعضاء الفريق ومتابعة أدائهم ومهامهم
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            إضافة عضو جديد
          </Button>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.status === 'نشط' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="h-4 w-4 mr-2" />
                    {member.phone}
                  </div>
                </div>

                {/* Task Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">المهام</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {member.completed} / {member.tasks}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{width: `${(member.completed / member.tasks) * 100}%`}}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    عرض المهام
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    تعيين مهمة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
              نظرة عامة على أداء الفريق
            </CardTitle>
            <CardDescription>
              ملخص الأداء والإنتاجية للفريق خلال الشهر الحالي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 space-x-reverse p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">75%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">معدل الإنجاز</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">20%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">مهام جارية</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-10 w-10 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">5%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">مهام متأخرة</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
