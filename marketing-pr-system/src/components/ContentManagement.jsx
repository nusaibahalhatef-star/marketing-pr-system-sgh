import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { 
  FileText, 
  Image, 
  Video,
  Calendar,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Plus
} from 'lucide-react'

export function ContentManagement() {
  const contentStats = [
    {
      title: 'المقالات المنشورة',
      value: '48',
      change: '+12',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'المحتوى المجدول',
      value: '24',
      change: '+8',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'إجمالي المشاهدات',
      value: '125K',
      change: '+18%',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'معدل التفاعل',
      value: '8.5%',
      change: '+2.3%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const recentContent = [
    {
      id: 1,
      title: 'أهمية الفحص الدوري الشامل',
      type: 'مقالة',
      platform: 'الموقع الإلكتروني',
      status: 'منشور',
      views: 2450,
      likes: 156,
      shares: 42,
      date: '2025-10-05'
    },
    {
      id: 2,
      title: 'نصائح للوقاية من أمراض القلب',
      type: 'فيديو',
      platform: 'يوتيوب',
      status: 'منشور',
      views: 5230,
      likes: 324,
      shares: 89,
      date: '2025-10-04'
    },
    {
      id: 3,
      title: 'حملة التوعية بالسكري',
      type: 'صورة',
      platform: 'انستغرام',
      status: 'مجدول',
      views: 0,
      likes: 0,
      shares: 0,
      date: '2025-10-08'
    },
    {
      id: 4,
      title: 'دليل التغذية الصحية',
      type: 'مقالة',
      platform: 'المدونة',
      status: 'مسودة',
      views: 0,
      likes: 0,
      shares: 0,
      date: '2025-10-10'
    }
  ]

  const socialMediaPerformance = [
    { platform: 'فيسبوك', followers: '45K', engagement: '6.2%', posts: 32 },
    { platform: 'تويتر', followers: '28K', engagement: '4.8%', posts: 48 },
    { platform: 'انستغرام', followers: '62K', engagement: '9.5%', posts: 56 },
    { platform: 'لينكد إن', followers: '18K', engagement: '5.3%', posts: 24 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              إدارة المحتوى الرقمي
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              إدارة المحتوى على الموقع الإلكتروني ووسائل التواصل الاجتماعي
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            إنشاء محتوى جديد
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentStats.map((stat, index) => (
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

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              المحتوى الأخير
            </CardTitle>
            <CardDescription>
              آخر المحتوى المنشور والمجدول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div 
                  key={content.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-4 space-x-reverse flex-1">
                    <div className={`p-3 rounded-lg ${
                      content.type === 'مقالة' ? 'bg-blue-100 dark:bg-blue-900' :
                      content.type === 'فيديو' ? 'bg-purple-100 dark:bg-purple-900' :
                      'bg-pink-100 dark:bg-pink-900'
                    }`}>
                      {content.type === 'مقالة' && <FileText className="h-5 w-5 text-blue-600" />}
                      {content.type === 'فيديو' && <Video className="h-5 w-5 text-purple-600" />}
                      {content.type === 'صورة' && <Image className="h-5 w-5 text-pink-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {content.title}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                        <span>{content.platform}</span>
                        <span>•</span>
                        <span>{content.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mr-4">
                    {content.status === 'منشور' && (
                      <>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Eye className="h-4 w-4" />
                          <span>{content.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Heart className="h-4 w-4" />
                          <span>{content.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Share2 className="h-4 w-4" />
                          <span>{content.shares}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    content.status === 'منشور' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : content.status === 'مجدول'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {content.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Media Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              أداء وسائل التواصل الاجتماعي
            </CardTitle>
            <CardDescription>
              إحصائيات الأداء عبر منصات التواصل الاجتماعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialMediaPerformance.map((platform, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                    {platform.platform}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">المتابعون</span>
                      <span className="font-medium text-slate-900 dark:text-white">{platform.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">معدل التفاعل</span>
                      <span className="font-medium text-green-600">{platform.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">المنشورات</span>
                      <span className="font-medium text-slate-900 dark:text-white">{platform.posts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Calendar Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                التقويم التحريري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">مقالة: نصائح صحية</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">الأحد، 6 أكتوبر</p>
                  </div>
                  <Button size="sm" variant="outline">تعديل</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">فيديو: تمارين رياضية</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">الاثنين، 7 أكتوبر</p>
                  </div>
                  <Button size="sm" variant="outline">تعديل</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">حملة: التوعية بالسرطان</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">الثلاثاء، 8 أكتوبر</p>
                  </div>
                  <Button size="sm" variant="outline">تعديل</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-orange-600" />
                التفاعلات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 space-x-reverse p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      تعليق جديد على مقالة "الفحص الدوري"
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      منذ 15 دقيقة
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      324 إعجاب جديد على فيديو "الوقاية من القلب"
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      منذ ساعة
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Share2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      89 مشاركة لمنشور "حملة التوعية"
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      منذ 3 ساعات
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
