import React, { useState } from 'react';
export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: 'Admin', email: email, role: 'admin' }, 'fake-token');
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#004A99', marginBottom: '30px' }}>تسجيل الدخول - SGH</h2>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>البريد الإلكتروني</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} required />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>كلمة المرور</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#004A99', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>دخول</button>
      </form>
    </div>
  );
};
