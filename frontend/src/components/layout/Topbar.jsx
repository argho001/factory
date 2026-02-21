import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const getTitleFromPath = (path) => {
    switch (path) {
        case '/': return 'Dashboard';
        case '/workers': return 'Workers Info';
        case '/workers/add': return 'Add Worker';
        case '/register': return 'Worker Register';
        case '/materials': return 'Material Info';
        case '/production': return 'Production';
        case '/sales/clients': return 'Clients';
        case '/sales/orders': return 'Sales Orders';
        case '/finance/invoice': return 'Invoices';
        case '/finance/payroll': return 'Payroll';
        case '/settings': return 'Settings';
        default: return 'Overview';
    }
};

export default function Topbar({ toggleSidebar }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    const location = useLocation();
    const pageTitle = getTitleFromPath(location.pathname);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="topbar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="page-title">{pageTitle}</h1>
                    <div className="breadcrumb">PlastiCore / {pageTitle}</div>
                </div>
            </div>
            <div className="topbar-right">
                <div className="topbar-clock">{time}</div>
                <div className="notif-btn">
                    🔔<div className="notif-dot"></div>
                </div>
                <div className="topbar-avatar">AR</div>
            </div>
        </div>
    );
}
