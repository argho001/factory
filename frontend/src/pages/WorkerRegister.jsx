import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function WorkerRegister() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWorkersForAttendance() {
            try {
                setLoading(true);
                const response = await api.get('/workers');
                setWorkers(response.data);
            } catch (err) {
                console.error("Workers failed to load:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWorkersForAttendance();
    }, []);

    if (loading) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading attendance roster...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="section active">
            <div className="two-cols" style={{ marginBottom: '20px' }}>
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Daily Attendance Register</div>
                            <div className="card-subtitle">Mark attendance for today's shift</div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-grid" style={{ marginBottom: '18px' }}>
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className="form-group">
                                <label>Shift</label>
                                <select>
                                    <option>Shift A — Morning</option>
                                    <option>Shift B — Evening</option>
                                    <option>Shift C — Night</option>
                                </select>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Worker</th>
                                    <th>In Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map((w, idx) => (
                                    <tr key={w.id}>
                                        <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)' }}>{w.id}</span></td>
                                        <td style={{ fontWeight: 500 }}>{w.name}</td>
                                        <td><input type="time" defaultValue={idx === 1 ? '08:15' : idx === 2 ? '' : '08:00'} style={{ width: '110px', padding: '5px 9px' }} /></td>
                                        <td>
                                            <span className={`badge ${w.attendance === 'Present' ? 'badge-active' : 'badge-leave'}`}>
                                                {w.attendance || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary btn-sm">Save Attendance</button>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Monthly Summary — February</div>
                    </div>
                    <div className="card-body">
                        <div className="three-cols" style={{ marginBottom: '20px' }}>
                            <div style={{ textAlign: 'center', padding: '14px', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--green)' }}>38</div>
                                <div style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 500, marginTop: '2px' }}>Present</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '14px', background: 'var(--red-light)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--red)' }}>10</div>
                                <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 500, marginTop: '2px' }}>Absent</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '14px', background: 'var(--orange-light)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--orange)' }}>3</div>
                                <div style={{ fontSize: '11px', color: 'var(--orange)', fontWeight: 500, marginTop: '2px' }}>Late</div>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Worker</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map((w, i) => (
                                    <tr key={w.id}>
                                        <td style={{ fontWeight: 500 }}>{w.name}</td>
                                        <td style={{ color: 'var(--green)', fontFamily: "'DM Mono', monospace" }}>{20 + (i % 3)}</td>
                                        <td style={{ color: 'var(--red)', fontFamily: "'DM Mono', monospace" }}>{i % 2}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
