import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === 'abc1234' && password === '123456') {
            localStorage.setItem('auth', 'true');
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Serif Display', serif", fontSize: '24px', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(26,86,219,0.3)' }}>P</div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--text)', marginBottom: '8px' }}>PlastiCore</h2>
                    <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Sign in to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ padding: '10px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: 'var(--radius)', fontSize: '13px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
