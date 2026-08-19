import React from 'react';
export const Dashboard = () => (
  <div style={{ padding: '30px' }}>
    <h1 style={{ color: '#004A99' }}>لوحة التحكم الرئيسية</h1>
    <p>مرحباً بك في نظام إدارة التسويق والعلاقات العامة للمستشفى السعودي الألماني.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>إحصائية {i}</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#004A99' }}>{i * 125}</p>
        </div>
      ))}
    </div>
  </div>
);
