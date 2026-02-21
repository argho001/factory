import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function AddWorker() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        shift: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.role || !formData.shift) {
            alert("Please fill in all required fields marked with *");
            return;
        }

        try {
            setLoading(true);
            await api.post('/workers', {
                name: `${formData.firstName} ${formData.lastName}`,
                role: formData.role,
                shift: formData.shift,
            });
            // Basic approach without robust Toast Context for simplicity.
            alert(`Worker ${formData.firstName} registered successfully!`);
            navigate('/workers');
        } catch (err) {
            console.error("Failed to add worker:", err);
            alert("Failed to add worker. Please check the network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section active">
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">New Worker Registration</div>
                        <div className="card-subtitle">All fields marked * are required</div>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text3)', background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                        Auto Generated ID
                    </span>
                </div>
                <form className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} onSubmit={handleSubmit}>

                    <div>
                        <div className="section-divider">Personal Information</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" placeholder="Enter first name" onChange={handleChange} value={formData.firstName} />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" placeholder="Enter last name" onChange={handleChange} value={formData.lastName} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="section-divider">Employment Details</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Designation *</label>
                                <select name="role" onChange={handleChange} value={formData.role}>
                                    <option value="">Select designation</option>
                                    <option>Machine Operator</option>
                                    <option>Supervisor</option>
                                    <option>Quality Inspector</option>
                                    <option>Packaging Worker</option>
                                    <option>Maintenance Technician</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Shift *</label>
                                <select name="shift" onChange={handleChange} value={formData.shift}>
                                    <option value="">Select shift</option>
                                    <option>Morning (6AM - 2PM)</option>
                                    <option>Evening (2PM - 10PM)</option>
                                    <option>Night (10PM - 6AM)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/workers')} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Registering...' : 'Register Worker'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
