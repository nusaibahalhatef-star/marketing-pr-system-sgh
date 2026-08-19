import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Button } from './ui/button.jsx'
import { Avatar, AvatarFallback } from './ui/avatar.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.jsx'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  ShieldCheck
} from 'lucide-react'
import RolesAndPermissions from './RolesAndPermissions.jsx'

export function UserManagement() {
  const [teamMembers, setTeamMembers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role_id: '',
    department: 'التسويق والعلاقات العامة'
  })
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // جلب أعضاء الفريق من API
  const fetchTeamMembers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الفريق')
      }

      const data = await response.json()
      setTeamMembers(data.users || [])
      
      // حساب الإحصائيات
      const activeMembers = (data.users || []).filter(m => m.is_active).length
      setStats({
        total: (data.users || []).length,
        active: activeMembers,
        inactive: (data.users || []).length - activeMembers
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // جلب الأدوار من API
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRoles(data || [])
      }
    } catch (err) {
      console.error('Error fetching roles:', err)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
    fetchRoles()
  }, [])

  // إضافة عضو جديد
  const handleAddMember = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إضافة العضو')
      }

      setIsAddDialogOpen(false)
      resetForm()
      await fetchTeamMembers()
      alert('تم إضافة العضو بنجاح!')
    } catch (err) {
      setError(err.message)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // تحديث عضو
  const handleUpdateMember = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }

      const response = await fetch(`${API_URL}/api/users/${selectedMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في تحديث البيانات')
      }

      setIsEditDialogOpen(false)
      setSelectedMember(null)
      resetForm()
      await fetchTeamMembers()
      alert('تم تحديث البيانات بنجاح!')
    } catch (err) {
      setError(err.message)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // حذف عضو
  const handleDeleteMember = async (memberId) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('فشل في حذف العضو')
      }

      await fetchTeamMembers()
      alert('تم حذف العضو بنجاح!')
    } catch (err) {
      setError(err.message)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // إعادة تعيين بيانات النموذج
  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      role_id: '',
      department: 'التسويق والعلاقات العامة'
    })
  }

  // فتح نافذة التعديل
  const openEditDialog = (member) => {
    setSelectedMember(member)
    setFormData({
      full_name: member.full_name,
      email: member.email,
      password: '',
      phone: member.phone || '',
      role_id: member.role_id || '',
      department: member.department || 'التسويق والعلاقات العامة'
    })
    setIsEditDialogOpen(true)
  }

  // فلترة الأعضاء
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role_id === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين والفريق</h1>
          <p className="text-gray-500">إدارة أعضاء الفريق، الأدوار، والصلاحيات في النظام</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2"
          >
            <Users size={18} />
            المستخدمين
          </Button>
          <Button 
            variant={activeTab === 'roles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('roles')}
            className="flex items-center gap-2"
          >
            <ShieldCheck size={18} />
            الأدوار والصلاحيات
          </Button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">إجمالي الفريق</p>
                    <h3 className="text-2xl font-bold">{stats.total}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Users size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">نشط حالياً</p>
                    <h3 className="text-2xl font-bold text-green-600">{stats.active}</h3>
                  </div>
                  <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">غير نشط</p>
                    <h3 className="text-2xl font-bold text-red-600">{stats.inactive}</h3>
                  </div>
                  <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <Clock size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* أدوات التحكم */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="البحث عن عضو..." 
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="ml-2" size={16} />
                      <SelectValue placeholder="تصفية حسب الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="flex items-center gap-2">
                    <UserPlus size={18} />
                    إضافة عضو
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm">
                      <th className="pb-3 font-medium">العضو</th>
                      <th className="pb-3 font-medium">الدور</th>
                      <th className="pb-3 font-medium">القسم</th>
                      <th className="pb-3 font-medium">الحالة</th>
                      <th className="pb-3 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">جاري التحميل...</td>
                      </tr>
                    ) : filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">لا يوجد أعضاء مطابقين للبحث</td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {member.full_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{member.full_name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                              {member.role_name || 'بدون دور'}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">{member.department || 'التسويق'}</td>
                          <td className="py-4">
                            {member.is_active ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                <CheckCircle2 size={14} />
                                نشط
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                                <Clock size={14} />
                                غير نشط
                              </span>
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                                <Edit size={16} className="text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
                                <Trash2 size={16} className="text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <RolesAndPermissions />
      )}

      {/* نافذة إضافة عضو */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عضو جديد للفريق</DialogTitle>
            <DialogDescription>
              أدخل بيانات العضو الجديد وحدد دوره في النظام.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input 
                  id="name" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">الدور الوظيفي</Label>
                <Select 
                  value={formData.role_id} 
                  onValueChange={(value) => setFormData({...formData, role_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'جاري الإضافة...' : 'إضافة العضو'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل عضو */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات العضو</DialogTitle>
            <DialogDescription>
              قم بتحديث بيانات العضو أو تغيير دوره الوظيفي.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateMember}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">الاسم الكامل</Label>
                <Input 
                  id="edit-name" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">كلمة المرور (اتركها فارغة لعدم التغيير)</Label>
                <Input 
                  id="edit-password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">الدور الوظيفي</Label>
                <Select 
                  value={formData.role_id} 
                  onValueChange={(value) => setFormData({...formData, role_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'جاري التحديث...' : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
