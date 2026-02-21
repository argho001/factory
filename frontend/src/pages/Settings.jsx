import React from 'react';

export default function Settings() {
    return (
        <div className="section active">
            <div className="two-cols">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Factory Information</div>
                            <div className="card-subtitle">General settings & details</div>
                        </div>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="form-group"><label>Factory Name</label><input type="text" defaultValue="PlastiCore Industries Ltd." /></div>
                        <div className="form-group"><label>Factory Address</label><textarea style={{ minHeight: '72px' }} defaultValue="Tejgaon Industrial Area, Dhaka-1208, Bangladesh"></textarea></div>
                        <div className="form-group"><label>Phone Number</label><input type="tel" defaultValue="02-9898765" /></div>
                        <div className="form-group"><label>VAT Registration No.</label><input type="text" defaultValue="BD-VAT-24601" /></div>
                        <div className="form-group"><label>Working Hours per Day</label><input type="number" defaultValue="8" /></div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline btn-sm">Discard</button>
                            <button className="btn btn-primary btn-sm">Save Changes</button>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Shift Configuration</div>
                            <div className="card-subtitle">Set working hours per shift</div>
                        </div>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ border: '1px solid var(--accent-mid)', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '10px' }}>Shift A — Morning</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group"><label>Start</label><input type="time" defaultValue="06:00" /></div>
                                <div className="form-group"><label>End</label><input type="time" defaultValue="14:00" /></div>
                            </div>
                        </div>
                        <div style={{ border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>Shift B — Evening</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group"><label>Start</label><input type="time" defaultValue="14:00" /></div>
                                <div className="form-group"><label>End</label><input type="time" defaultValue="22:00" /></div>
                            </div>
                        </div>
                        <div style={{ border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>Shift C — Night</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group"><label>Start</label><input type="time" defaultValue="22:00" /></div>
                                <div className="form-group"><label>End</label><input type="time" defaultValue="06:00" /></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary btn-sm">Update Shifts</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
