import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Payroll() {
    const [data, setData] = useState({ workers: [], payrollTotal: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWorkersForPayroll() {
            try {
                setLoading(true);
                // We reuse the workers endpoint for payroll base data mockup
                const response = await api.get('/workers');
                const finance = await api.get('/finance');
                setData({ workers: response.data, payrollTotal: finance.data.payrollTotal });
            } catch (err) {
                console.error("Payroll failed to load:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWorkersForPayroll();
    }, []);

    if (loading) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Calculating payroll...</div>
                </div>
            </div>
        );
    }

    // Helper calculating mock net pay for presentation
    const getNetPay = (role) => {
        switch (role) {
            case 'Supervisor': return 25910;
            case 'Quality Control': return 25300;
            default: return 20900;
        }
    };

    return (
        <div className="section active">
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Monthly Payroll</div>
                        <div className="card-subtitle">February 2025 · 22 working days</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline btn-sm">Export</button>
                        <button className="btn btn-primary btn-sm">Process Payroll</button>
                    </div>
                </div>
                <div className="card-body" style={{ padding: '0 22px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Worker</th>
                                <th>Designation</th>
                                <th>Days Worked</th>
                                <th>Net Pay</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.workers.map((w, idx) => (
                                <tr key={w.id}>
                                    <td style={{ fontWeight: 500 }}>{w.name}</td>
                                    <td style={{ color: 'var(--text2)', fontSize: '12px' }}>{w.role}</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', textAlign: 'center' }}>
                                        {idx === 2 ? 18 : idx === 1 ? 21 : 22}
                                    </td>
                                    <td className="net-pay">৳{getNetPay(w.role).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${idx % 3 === 0 ? 'badge-paid' : 'badge-pending'}`}>
                                            {idx % 3 === 0 ? 'Paid' : 'Pending'}
                                        </span>
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
