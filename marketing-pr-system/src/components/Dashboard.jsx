import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { 
  Users, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'

export function Dashboard() {
  const stats = [
    {
      title: 'المهام النشطة',
      value: '24',
      change: '+12%',
      icon: CheckCircle2,
      color: 'text-blue-600'
    },
    {
      title: 'الحملات الجارية',
      value: '8',
      change: '+3',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'المرضى الجدد',
      value: '156',
      change: '+18%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'المواعيد اليوم',
      value: '42',
      change: '+5',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ]

  const recentTasks = [
    { id: 1, title: 'إعداد حملة إعلانية للفحص الشامل', status: 'قيد التنفيذ', priority: 'عالية' },
    { id: 2, title: 'تحديث محتوى الموقع الإلكتروني', status: 'مكتملة', priority: 'متوسطة' },
    { id: 3, title: 'متابعة رسائل العملاء على وسائل التواصل', status: 'معلقة', priority: 'عالية' },
    { id: 4, title: 'إعداد تقرير أداء الربع الأول', status: 'قيد التنفيذ', priority: 'متوسطة' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              لوحة التحكم الرئيسية
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              نظام إدارة التسويق والعلاقات العامة - المستشفى السعودي الألماني
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            إضافة مهمة جديدة
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
                المهام الأخيرة
              </CardTitle>
              <CardDescription>
                متابعة المهام والأنشطة الجارية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'مكتملة' ? 'bg-green-500' :
                        task.status === 'قيد التنفيذ' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`} />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {task.title}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          الحالة: {task.status}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'عالية' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                إدارة الفريق
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                إدارة المحتوى
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                إدارة المواعيد
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                التقارير والتحليلات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                أداء الحملات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">حملة الفحص الشامل</span>
                  <span className="font-bold text-green-600">+24%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">حملة التوعية الصحية</span>
                  <span className="font-bold text-blue-600">+18%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
                التنبيهات والإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      موعد نهائي قريب
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      تقرير الأداء الشهري يستحق خلال 3 أيام
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      رسائل جديدة
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      12 رسالة جديدة من المرضى تحتاج إلى رد
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
