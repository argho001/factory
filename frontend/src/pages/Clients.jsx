import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: '', email: '' });

    async function fetchClients() {
        try {
            setLoading(true);
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (err) {
            console.error("Clients failed to load:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClients();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.contact) {
            alert("Please fill in required fields (Name and Contact).");
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/clients', formData);
            setFormData({ name: '', contact: '', email: '' });
            setShowAddForm(false);
            fetchClients();
        } catch (err) {
            console.error("Failed to add client:", err);
            alert("Failed to add client.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && clients.length === 0) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading clients...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    {clients.length} active clients
                </div>
                {!showAddForm && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>+ Add Client</button>
                )}
            </div>

            {showAddForm && (
                <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--accent-mid)', background: 'var(--accent-light)' }}>
                    <div className="card-header">
                        <div className="card-title">Add New Client</div>
                    </div>
                    <form className="card-body" onSubmit={handleFormSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Company / Contact Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Client Name" />
                            </div>
                            <div className="form-group">
                                <label>Contact Number *</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="e.g. 01711-..." />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. info@domain.com" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)} disabled={submitting}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Client'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-body" style={{ padding: '0 22px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Client ID</th>
                                <th>Name</th>
                                <th>Contact Number</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--accent)' }}>{client.id}</span></td>
                                    <td style={{ fontWeight: 500 }}>{client.name}</td>
                                    <td style={{ color: 'var(--text2)' }}>{client.contact}</td>
                                    <td style={{ color: 'var(--text2)' }}>{client.email || '-'}</td>
                                    <td>
                                        <span className={`badge ${client.status === 'Active' ? 'badge-active' : 'badge-leave'}`}>{client.status}</span>
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
