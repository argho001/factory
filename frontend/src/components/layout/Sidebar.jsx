import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, ClipboardList, Package, Settings, FileText, CreditCard, Activity, X, LogOut } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const handleActive = (path) => {
        return location.pathname === path ? 'nav-item active' : 'nav-item';
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo-mark">
                    <div className="logo-icon">P</div>
                    <div>
                        <div className="logo-text">PlastiCore</div>
                        <div className="logo-sub">Factory Management</div>
                    </div>
                </div>
                <button className="mobile-close-btn" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}>
                    <X size={24} />
                </button>
            </div>

            <nav className="nav">
                <div className="nav-section">Operations</div>
                <Link to="/" className={handleActive('/')} onClick={onClose}>
                    <span className="nav-icon"><LayoutDashboard size={18} /></span> Dashboard
                </Link>
                <Link to="/workers" className={handleActive('/workers')} onClick={onClose}>
                    <span className="nav-icon"><Users size={18} /></span> Workers Info
                    <span className="nav-badge info">48</span>
                </Link>
                <Link to="/workers/add" className={handleActive('/workers/add')} onClick={onClose}>
                    <span className="nav-icon"><UserPlus size={18} /></span> Add Worker
                </Link>
                <Link to="/register" className={handleActive('/register')} onClick={onClose}>
                    <span className="nav-icon"><ClipboardList size={18} /></span> Worker Register
                </Link>

                <div className="nav-section">Inventory</div>
                <Link to="/materials" className={handleActive('/materials')} onClick={onClose}>
                    <span className="nav-icon"><Package size={18} /></span> Material Info
                    <span className="nav-badge">3</span>
                </Link>
                <Link to="/production" className={handleActive('/production')} onClick={onClose}>
                    <span className="nav-icon"><Activity size={18} /></span> Production
                </Link>

                <div className="nav-section">Sales</div>
                <Link to="/sales/clients" className={handleActive('/sales/clients')} onClick={onClose}>
                    <span className="nav-icon"><Users size={18} /></span> Clients
                </Link>
                <Link to="/sales/orders" className={handleActive('/sales/orders')} onClick={onClose}>
                    <span className="nav-icon"><Package size={18} /></span> Orders
                </Link>

                <div className="nav-section">Finance</div>
                <Link to="/finance/invoice" className={handleActive('/finance/invoice')} onClick={onClose}>
                    <span className="nav-icon"><FileText size={18} /></span> Invoices
                </Link>
                <Link to="/finance/payroll" className={handleActive('/finance/payroll')} onClick={onClose}>
                    <span className="nav-icon"><CreditCard size={18} /></span> Payroll
                </Link>

                <div className="nav-section">System</div>
                <Link to="/settings" className={handleActive('/settings')} onClick={onClose}>
                    <span className="nav-icon"><Settings size={18} /></span> Settings
                </Link>
            </nav>

            <div className="sidebar-footer">
                <div className="system-status">
                    <div className="status-dot"></div>
                    <span>All systems normal</span>
                </div>
                <div className="admin-chip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="admin-avatar">AR</div>
                        <div>
                            <div className="admin-name">Argho</div>
                            <div className="admin-role">System Administrator</div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('auth');
                            window.location.href = '/';
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: '4px', display: 'flex', alignItems: 'center' }}
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
