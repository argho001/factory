import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ client: '', product: '', amount: '', unit: 'kg' });

    async function fetchData() {
        try {
            setLoading(true);
            const [ordersRes, clientsRes] = await Promise.all([
                api.get('/orders'),
                api.get('/clients')
            ]);
            setOrders(ordersRes.data);
            setClients(clientsRes.data);
            if (clientsRes.data.length > 0) {
                setFormData(prev => ({ ...prev, client: prev.client || clientsRes.data[0].name }));
            }
        } catch (err) {
            console.error("Orders or Clients failed to load:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client || !formData.product || !formData.amount) {
            alert("Please fill in required fields.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/orders', {
                client: formData.client,
                product: formData.product,
                amount: Number(formData.amount),
                unit: formData.unit
            });
            setFormData({ ...formData, product: '', amount: '' });
            setShowAddForm(false);
            fetchData();
        } catch (err) {
            console.error("Failed to add order:", err);
            alert("Failed to create order.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    {orders.length} active orders
                </div>
                {!showAddForm && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>+ New Order</button>
                )}
            </div>

            {showAddForm && (
                <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--accent-mid)', background: 'var(--accent-light)' }}>
                    <div className="card-header">
                        <div className="card-title">Create Sales Order</div>
                    </div>
                    <form className="card-body" onSubmit={handleFormSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Select Client *</label>
                                <select name="client" value={formData.client} onChange={handleInputChange}>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input type="text" name="product" value={formData.product} onChange={handleInputChange} placeholder="e.g. HDPE Pipe 4&quot;" />
                            </div>
                            <div className="form-group">
                                <label>Quantity *</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Quantity" />
                            </div>
                            <div className="form-group">
                                <label>Unit *</label>
                                <select name="unit" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">kg</option>
                                    <option value="tons">tons</option>
                                    <option value="rolls">rolls</option>
                                    <option value="pcs">pcs</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)} disabled={submitting}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Order'}
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
                                <th>Order ID</th>
                                <th>Client</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                let badgeCls = 'badge-pending';
                                if (order.status === 'Processing') badgeCls = 'badge-active';
                                if (order.status === 'Delivered') badgeCls = 'badge-paid';

                                return (
                                    <tr key={order.id}>
                                        <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--accent)' }}>{order.id}</span></td>
                                        <td style={{ fontWeight: 500 }}>{order.client}</td>
                                        <td style={{ color: 'var(--text2)' }}>{order.product}</td>
                                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>{order.amount.toLocaleString()} {order.unit}</td>
                                        <td style={{ color: 'var(--text3)', fontSize: '12px' }}>{order.date}</td>
                                        <td>
                                            <span className={`badge ${badgeCls}`}>{order.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
