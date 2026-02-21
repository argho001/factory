import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import html2pdf from 'html2pdf.js';

export default function Invoice() {
    const [data, setData] = useState({ invoices: [], payrollTotal: 0 });
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ client: '', amount: '', date: '' });
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const invoiceRef = useRef(null);

    async function fetchFinance() {
        try {
            setLoading(true);
            const response = await api.get('/finance');
            setData(response.data);
        } catch (err) {
            console.error("Finance failed to load:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFinance();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client || !formData.amount) {
            alert("Please fill in Client and Amount.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/invoices', formData);
            setFormData({ client: '', amount: '', date: '' });
            setShowAddForm(false);
            fetchFinance(); // Refresh list
        } catch (err) {
            console.error("Failed to create invoice:", err);
            alert("Failed to create invoice.");
        } finally {
            setSubmitting(false);
        }
    };

    const downloadPDF = () => {
        const element = invoiceRef.current;
        const opt = {
            margin: 0.5,
            filename: `${selectedInvoice.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    if (loading && data.invoices.length === 0) {
        return (
            <div className="section active">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <div>Loading financial records...</div>
                </div>
            </div>
        );
    }

    const { invoices } = data;

    return (
        <div className="section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    {invoices.length} invoices this month
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline btn-sm">Export CSV</button>
                    {!showAddForm && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>+ New Invoice</button>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--accent-mid)', background: 'var(--accent-light)' }}>
                    <div className="card-header">
                        <div className="card-title">Create New Invoice</div>
                    </div>
                    <form className="card-body" onSubmit={handleFormSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Client Name *</label>
                                <input type="text" name="client" value={formData.client} onChange={handleInputChange} placeholder="e.g. Ahmed Plastics Co." />
                            </div>
                            <div className="form-group">
                                <label>Total Amount (BDT) *</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="e.g. 15000" />
                            </div>
                            <div className="form-group">
                                <label>Invoice Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)} disabled={submitting}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Invoice'}
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
                                <th>Invoice No.</th>
                                <th>Client</th>
                                <th>Amount (BDT)</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--accent)' }}>{inv.id}</span></td>
                                    <td style={{ fontWeight: 500 }}>{inv.client}</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', fontWeight: 600 }}>৳{inv.amount.toLocaleString()}</td>
                                    <td style={{ color: 'var(--text3)', fontSize: '12px' }}>{inv.date}</td>
                                    <td>
                                        <span className={`badge ${inv.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>{inv.status}</span>
                                    </td>
                                    <td><button className="btn btn-outline btn-sm" onClick={() => setSelectedInvoice(inv)}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedInvoice && (
                <div className="invoice-preview" style={{ marginTop: '20px', position: 'relative' }}>
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
                        onClick={() => setSelectedInvoice(null)}
                    >
                        ✕ Close
                    </button>

                    <div ref={invoiceRef} style={{ padding: '40px', background: 'white', borderRadius: 'var(--radius)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid var(--border)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'DM Serif Display', serif", fontSize: '18px', boxShadow: '0 4px 12px rgba(26,86,219,0.3)' }}>P</div>
                                    <div className="inv-logo">PlastiCore</div>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Industrial Plastic Solutions</div>
                                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '6px', lineHeight: '1.6' }}>Tejgaon Industrial Area, Dhaka-1208<br />+880 2-9898765 &middot; VAT: BD-VAT-24601</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '6px' }}>Invoice</div>
                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'var(--accent)' }}>#{selectedInvoice.id}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '6px', lineHeight: '1.6' }}>Issued: {selectedInvoice.date}</div>
                                <div style={{ marginTop: '10px' }}>
                                    <span className="inv-badge" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: selectedInvoice.status === 'Paid' ? 'var(--green-light)' : 'var(--orange-light)', color: selectedInvoice.status === 'Paid' ? 'var(--green)' : 'var(--orange)' }}>
                                        {selectedInvoice.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '28px' }}>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Billed To</div>
                                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{selectedInvoice.client}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.7' }}>Corporate ID / Address Info Here</div>
                            </div>
                        </div>

                        <table style={{ marginBottom: '24px', width: '100%' }}>
                            <thead style={{ background: 'var(--bg)' }}>
                                <tr>
                                    <th style={{ padding: '10px 12px 10px 12px', textAlign: 'left' }}>Description</th>
                                    <th style={{ textAlign: 'left' }}>Qty</th>
                                    <th style={{ textAlign: 'left' }}>Unit</th>
                                    <th style={{ textAlign: 'left' }}>Rate</th>
                                    <th style={{ textAlign: 'right', paddingRight: '12px' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ fontWeight: 500, padding: '12px' }}>Custom Manufacturing Order</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>1</td>
                                    <td style={{ color: 'var(--text2)' }}>LOT</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>৳{selectedInvoice.amount.toLocaleString()}</td>
                                    <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', textAlign: 'right', paddingRight: '12px' }}>৳{selectedInvoice.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '12px' }}>
                            <div style={{ width: '240px' }}>
                                <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}><span className="info-label" style={{ fontSize: '13px', color: 'var(--text2)' }}>Subtotal</span><span className="info-value" style={{ fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>৳{selectedInvoice.amount.toLocaleString()}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Total Due</span>
                                    <span className="inv-total" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '24px', color: 'var(--accent)' }}>৳{selectedInvoice.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨 Print</button>
                        <button className="btn btn-primary btn-sm" onClick={downloadPDF}>↓ Download PDF</button>
                    </div>
                </div>
            )}
        </div>
    );
}
