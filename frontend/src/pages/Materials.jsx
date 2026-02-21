import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Materials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        stock: '',
        unit: 'kg',
        reorderLevel: ''
    });
    const [submitting, setSubmitting] = useState(false);

    async function fetchInventory() {
        try {
            setLoading(true);
            const response = await api.get('/inventory');
            setMaterials(response.data);
        } catch (err) {
            console.error("Materials failed to load:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.stock || !formData.reorderLevel) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/inventory', formData);
            setFormData({ name: '', stock: '', unit: 'kg', reorderLevel: '' });
            setShowAddForm(false);
            fetchInventory(); // Map new data
        } catch (err) {
            console.error("Failed to add material:", err);
            alert("Failed to add material. Please check network.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && materials.length === 0) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading inventory counts...</div>
                </div>
            </div>
        );
    }

    const criticalCount = materials.filter(m => m.status === 'Critical' || m.status === 'Low').length;

    return (
        <div className="section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    {materials.length} materials tracked · {criticalCount} requiring attention
                </div>
                {!showAddForm && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>+ Add Material</button>
                )}
            </div>

            {showAddForm && (
                <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--accent-mid)', background: 'var(--accent-light)' }}>
                    <div className="card-header">
                        <div className="card-title">Add New Material</div>
                    </div>
                    <form className="card-body" onSubmit={handleFormSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Material Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. PVC Compound" />
                            </div>
                            <div className="form-group">
                                <label>Unit *</label>
                                <select name="unit" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">kg</option>
                                    <option value="tons">tons</option>
                                    <option value="rolls">rolls</option>
                                    <option value="liters">liters</option>
                                    <option value="pcs">pcs</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Initial Stock *</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Current inventory amount" />
                            </div>
                            <div className="form-group">
                                <label>Reorder Level *</label>
                                <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleInputChange} placeholder="Alert threshold" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)} disabled={submitting}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                {submitting ? 'Adding...' : 'Save Material'}
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
                                <th>Code</th>
                                <th>Material</th>
                                <th>Stock</th>
                                <th>Reorder At</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map(m => {
                                const pct = Math.min((m.stock / (m.reorderLevel * 2)) * 100, 100);
                                const barColor = m.stock <= m.reorderLevel ? 'var(--red)' : m.stock < m.reorderLevel * 1.5 ? 'var(--orange)' : 'var(--green)';
                                const badgeClass = m.stock <= m.reorderLevel ? 'badge-critical' : m.stock < m.reorderLevel * 1.5 ? 'badge-low' : 'badge-ok';
                                const statusText = m.stock <= m.reorderLevel ? 'Critical' : m.stock < m.reorderLevel * 1.5 ? 'Low Stock' : 'Normal';

                                return (
                                    <tr key={m.id}>
                                        <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)' }}>{m.id}</span></td>
                                        <td style={{ fontWeight: 500 }}>{m.name}</td>
                                        <td>
                                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{m.stock} {m.unit}</div>
                                            <div className="progress-track" style={{ width: '90px' }}>
                                                <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }}></div>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{m.reorderLevel} {m.unit}</td>
                                        <td><span className={`badge ${badgeClass}`}>{statusText}</span></td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
