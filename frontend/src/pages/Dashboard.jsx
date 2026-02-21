import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Users, Settings, Activity, Clock } from 'lucide-react';

export default function Dashboard() {
    const [data, setData] = useState({ stats: null, activities: [], machines: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true);
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (err) {
                console.error("Dashboard failed to load:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading dashboard metrics...</div>
                </div>
            </div>
        );
    }

    const { stats, activities, machines } = data;

    return (
        <div className="section active">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-top">
                        <div className="stat-icon-box si-blue"><Users size={20} /></div>
                        <div className={`stat-change ${stats.workersTrend?.startsWith('+') ? 'up' : 'warn'}`}>
                            {stats.workersTrend?.startsWith('+') ? '↑' : '↓'} {stats.workersTrend}
                        </div>
                    </div>
                    <div className="stat-value">{stats.totalWorkers}</div>
                    <div className="stat-label">Total Workers</div>
                </div>

                <div className="stat-card">
                    <div className="stat-top">
                        <div className="stat-icon-box si-green"><Activity size={20} /></div>
                        <div className={`stat-change ${stats.outputTrend?.startsWith('+') ? 'up' : 'warn'}`}>
                            {stats.outputTrend?.startsWith('+') || !stats.outputTrend?.startsWith('-') ? '↑' : '↓'} {stats.outputTrend}
                        </div>
                    </div>
                    <div className="stat-value">{stats.dailyOutputKg?.toLocaleString()}</div>
                    <div className="stat-label">Daily Output (kg)</div>
                </div>

                <div className="stat-card">
                    <div className="stat-top">
                        <div className="stat-icon-box si-orange"><Settings size={20} /></div>
                        <div className="stat-change warn">{stats.inactiveMachines} offline</div>
                    </div>
                    <div className="stat-value">{stats.activeMachines}</div>
                    <div className="stat-label">Active Machines</div>
                </div>

                <div className="stat-card">
                    <div className="stat-top">
                        <div className="stat-icon-box si-purple"><Clock size={20} /></div>
                        <div className={`stat-change ${stats.qualityTrend?.startsWith('+') ? 'up' : 'warn'}`}>
                            {stats.qualityTrend?.startsWith('+') ? '↑' : '↓'} {stats.qualityTrend}
                        </div>
                    </div>
                    <div className="stat-value">{stats.qualityPassRate}%</div>
                    <div className="stat-label">Quality Pass Rate</div>
                </div>
            </div>

            <div className="dash-grid">
                {/* Live Material Info Preview */}
                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Live Material Info</div>
                            <div className="card-subtitle">Real-time inventory levels</div>
                        </div>
                        <button className="btn btn-outline btn-sm">View All</button>
                    </div>
                    <div className="card-body" style={{ padding: '0 22px' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.materials?.map((m) => {
                                    const badgeClass = m.stock <= m.reorderLevel ? 'badge-critical' : m.stock < m.reorderLevel * 1.5 ? 'badge-low' : 'badge-ok';
                                    const statusText = m.stock <= m.reorderLevel ? 'Critical' : m.stock < m.reorderLevel * 1.5 ? 'Low Stock' : 'Normal';

                                    return (
                                        <tr key={m.id}>
                                            <td style={{ fontWeight: 500 }}>{m.name}</td>
                                            <td>
                                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>{m.stock} {m.unit}</div>
                                            </td>
                                            <td><span className={`badge ${badgeClass}`}>{statusText}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Activity */}
                <div className="card" style={{ marginBottom: 0 }}>
                    <div className="card-header">
                        <div>
                            <div className="card-title">Recent Activity</div>
                            <div className="card-subtitle">System notifications & alerts</div>
                        </div>
                    </div>
                    <div className="card-body" style={{ padding: '10px 22px' }}>
                        {activities.map((act) => (
                            <div key={act.id} className="activity-item">
                                <div className="activity-icon" style={{ background: 'var(--bg2)' }}>🔔</div>
                                <div>
                                    <div className="activity-text">{act.text}</div>
                                    <div className="activity-time">{act.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
