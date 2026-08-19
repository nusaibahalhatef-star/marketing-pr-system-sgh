import React from 'react';
import { LayoutDashboard, Users, FileText, UserSquare2, BarChart3, Settings as SettingsIcon, LogOut } from 'lucide-react';
export const Navigation = ({ currentPage, onNavigate, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} /> },
    { id: 'team', label: 'إدارة المستخدمين', icon: <Users size={20} /> },
    { id: 'content', label: 'إدارة المحتوى', icon: <FileText size={20} /> },
    { id: 'crm', label: 'إدارة العملاء', icon: <UserSquare2 size={20} /> },
    { id: 'analytics', label: 'التحليلات', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'الإعدادات', icon: <SettingsIcon size={20} /> },
  ];
  return (
    <nav style={{ background: '#004A99', color: 'white', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', marginLeft: '20px', color: '#C5A059' }}>SGH Marketing</div>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: currentPage === item.id ? '#003366' : 'transparent', border: 'none', color: 'white', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>مرحباً، {user?.name}</span>
        <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> خروج
        </button>
      </div>
    </nav>
  );
};
