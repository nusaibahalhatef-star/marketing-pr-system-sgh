import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit2, Save, X, Check, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import '../styles/RolesAndPermissions.css';

const RolesAndPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/roles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('خطأ في جلب الأدوار:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/roles/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
      }
    } catch (error) {
      console.error('خطأ في جلب الصلاحيات:', error);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: newRoleName,
          description: newRoleDesc 
        })
      });

      if (response.ok) {
        await fetchRoles();
        setNewRoleName('');
        setNewRoleDesc('');
        alert('تم إضافة الدور بنجاح');
      } else {
        const errorData = await response.json();
        alert(`خطأ: ${errorData.error}`);
      }
    } catch (error) {
      console.error('خطأ في إضافة الدور:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id) => {
    if (!confirm('هل تريد حذف هذا الدور؟ سيتم فقدان جميع الصلاحيات المرتبطة به.')) return;

    try {
      const response = await fetch(`${API_URL}/api/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setRoles(roles.filter(r => r.id !== id));
      } else {
        const errorData = await response.json();
        alert(`خطأ: ${errorData.error}`);
      }
    } catch (error) {
      console.error('خطأ في حذف الدور:', error);
    }
  };

  const handleUpdateRole = async (role) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/roles/${role.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: role.name,
          description: role.description,
          permissions: role.permissions.map(p => p.id || p)
        })
      });

      if (response.ok) {
        await fetchRoles();
        setEditingRole(null);
        alert('تم تحديث الدور بنجاح');
      } else {
        const errorData = await response.json();
        alert(`خطأ: ${errorData.error}`);
      }
    } catch (error) {
      console.error('خطأ في تحديث الدور:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (roleId, permissionId) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.some(p => (p.id || p) === permissionId);
        let newPermissions;
        if (hasPermission) {
          newPermissions = role.permissions.filter(p => (p.id || p) !== permissionId);
        } else {
          newPermissions = [...role.permissions, permissionId];
        }
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            إضافة دور جديد
          </CardTitle>
          <CardDescription>قم بإنشاء دور وظيفي جديد وتخصيص صلاحياته لاحقاً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="اسم الدور (مثلاً: مدير محتوى)"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="flex-[2]">
              <Input
                placeholder="وصف الدور..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
              />
            </div>
            <Button onClick={handleAddRole} disabled={loading || !newRoleName}>
              {loading ? 'جاري الإضافة...' : 'إضافة دور'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {roles.map(role => (
          <Card key={role.id} className={editingRole === role.id ? 'ring-2 ring-blue-500' : ''}>
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield size={24} />
                  </div>
                  <div>
                    {editingRole === role.id ? (
                      <Input
                        value={role.name}
                        onChange={(e) => setRoles(roles.map(r => r.id === role.id ? { ...r, name: e.target.value } : r))}
                        className="font-bold text-lg h-8"
                      />
                    ) : (
                      <CardTitle>{role.name}</CardTitle>
                    )}
                    <CardDescription>
                      {editingRole === role.id ? (
                        <Input
                          value={role.description || ''}
                          onChange={(e) => setRoles(roles.map(r => r.id === role.id ? { ...r, description: e.target.value } : r))}
                          className="mt-1 h-7 text-xs"
                          placeholder="أضف وصفاً..."
                        />
                      ) : (
                        role.description || 'لا يوجد وصف'
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingRole === role.id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdateRole(role)} className="bg-green-600 hover:bg-green-700">
                        <Save size={16} className="ml-1" /> حفظ
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingRole(null); fetchRoles(); }}>
                        <X size={16} className="ml-1" /> إلغاء
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingRole(role.id)}>
                        <Edit2 size={16} className="ml-1" /> تعديل
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteRole(role.id)}>
                        <Trash2 size={16} className="ml-1" /> حذف
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                الصلاحيات الممنوحة:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {permissions.map(permission => {
                  const isChecked = role.permissions.some(p => (p.id || p) === permission.id);
                  return (
                    <div 
                      key={permission.id} 
                      className={`flex items-center p-3 rounded-lg border transition-all ${
                        isChecked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer w-full">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={isChecked}
                          onChange={() => togglePermission(role.id, permission.id)}
                          disabled={editingRole !== role.id}
                        />
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${isChecked ? 'text-blue-900' : 'text-gray-600'}`}>
                            {permission.description || permission.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{permission.name}</span>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesAndPermissions;
