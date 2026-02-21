import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Search, Filter } from 'lucide-react';

export default function WorkersInfo() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWorkers() {
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
        fetchWorkers();
    }, []);

    const getAvatarInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getRandomGradient = (name) => {
        const gradients = [
            'linear-gradient(135deg,#1a56db,#3b82f6)',
            'linear-gradient(135deg,#7c3aed,#9f67fa)',
            'linear-gradient(135deg,#d97706,#f59e0b)',
            'linear-gradient(135deg,#059669,#10b981)',
            'linear-gradient(135deg,#dc2626,#ef4444)'
        ];
        // Simple hash to keep colors consistent per name
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[hash % gradients.length];
    };

    if (loading) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading employee records...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    {workers.length} employees across 3 shifts
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                        <input type="text" placeholder="Search by name or ID…" style={{ width: '210px', paddingLeft: '32px' }} />
                    </div>
                    <select style={{ width: '150px' }}>
                        <option>All Shifts</option>
                        <option>Morning (6AM - 2PM)</option>
                        <option>Evening (2PM - 10PM)</option>
                        <option>Night (10PM - 6AM)</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="card-body" style={{ padding: '0 22px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Worker ID</th>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Shift</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((w) => (
                                <tr key={w.id}>
                                    <td>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--accent)', fontWeight: 500 }}>
                                            {w.id}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="worker-avatar" style={{ background: getRandomGradient(w.name) }}>
                                                {getAvatarInitials(w.name)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{w.name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{w.name.split(' ')[0].toLowerCase()}@plasticore.bd</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{w.role}</td>
                                    <td style={{ color: 'var(--text2)' }}>{w.shift}</td>
                                    <td>
                                        <span className={`badge ${w.status === 'Active' ? 'badge-active' : w.status === 'Training' ? 'badge-training' : 'badge-leave'}`}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td><button className="btn btn-outline btn-sm">Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
