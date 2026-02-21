import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Production() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduction() {
            try {
                setLoading(true);
                const response = await api.get('/production');
                setMachines(response.data);
            } catch (err) {
                console.error("Production failed to load:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduction();
    }, []);

    if (loading) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading machine status...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="section active">
            <div className="three-cols" style={{ marginBottom: '24px' }}>
                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-body">
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px', fontWeight: 500 }}>Today's Output</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--accent)', letterSpacing: '-1px' }}>
                            12,450 <span style={{ fontSize: '16px', color: 'var(--text3)' }}>kg</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--green)', marginTop: '4px' }}>↑ 8.2% vs yesterday</div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-body">
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px', fontWeight: 500 }}>Quality Pass Rate</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--green)', letterSpacing: '-1px' }}>
                            97.2<span style={{ fontSize: '16px' }}>%</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>343 units rejected</div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-body">
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px', fontWeight: 500 }}>Material Consumed</div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: 'var(--orange)', letterSpacing: '-1px' }}>
                            13.8 <span style={{ fontSize: '16px', color: 'var(--text3)' }}>ton</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>All materials today</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Production Lines</div>
                        <div className="card-subtitle">Current status and speeds for all active heavy machinery</div>
                    </div>
                    <button className="btn btn-primary btn-sm">+ Add Entry</button>
                </div>
                <div className="card-body" style={{ padding: '0 22px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Machine ID</th>
                                <th>Machine Name</th>
                                <th>Temperature</th>
                                <th>Speed (RPM)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {machines.map((m) => (
                                <tr key={m.id}>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{m.id}</td>
                                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{m.temp}°C</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{m.speed}</td>
                                    <td>
                                        <span className={`badge ${m.status === 'Active' ? 'badge-active' : 'badge-leave'}`}>{m.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
