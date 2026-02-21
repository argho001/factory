const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite frontend
app.use(express.json());

// Mock Data
let systemStats = {
    totalWorkers: 48,
    workersTrend: "+3",
    dailyOutputKg: 12450,
    outputTrend: "8.2%",
    activeMachines: 18,
    inactiveMachines: 2,
    qualityPassRate: 98.4,
    qualityTrend: "-0.5%"
};

let workers = [
    { id: "W-1042", name: "Rahim Uddin", role: "Machine Operator", shift: "Morning (6AM - 2PM)", status: "Active", attendance: "Present" },
    { id: "W-1043", name: "Karim Ali", role: "Quality Control", shift: "Morning (6AM - 2PM)", status: "On Leave", attendance: "Absent" },
    { id: "W-1044", name: "Sikdar Hossain", role: "Packaging", shift: "Evening (2PM - 10PM)", status: "Training", attendance: "Present" },
    { id: "W-1045", name: "Jobbar Miah", role: "Loader", shift: "Night (10PM - 6AM)", status: "Active", attendance: "Present" },
];

let materials = [
    { id: "MAT-01", name: "HDPE Granules", stock: 4500, unit: "kg", reorderLevel: 1000, status: "OK" },
    { id: "MAT-02", name: "Color Pigment (Blue)", stock: 120, unit: "kg", reorderLevel: 150, status: "Low" },
    { id: "MAT-03", name: "Packaging Film", stock: 850, unit: "rolls", reorderLevel: 200, status: "OK" },
];

let machines = [
    { id: "M-01", name: "Extruder Alpha", temp: 185, speed: 120, status: "Active" },
    { id: "M-02", name: "Molding Unit B", temp: 210, speed: 85, status: "Active" },
    { id: "M-03", name: "Mixer Pro", temp: 45, speed: 0, status: "Maintenance" }
];

let invoices = [
    { id: "INV-2023-001", client: "MegaCorp", amount: 54000, status: "Paid", date: "2023-10-24" },
    { id: "INV-2023-002", client: "Local Traders", amount: 12500, status: "Pending", date: "2023-10-25" },
];

let activities = [
    { id: 1, text: "System backup completed.", time: "2 mins ago" },
    { id: 2, text: "New worker 'Selim' added to Morning Shift.", time: "1 hour ago" },
    { id: 3, text: "Extruder Alpha maintenance scheduled.", time: "3 hours ago" }
];

// --- Routes ---

// Dashboard Stats & Activities
app.get('/api/dashboard', (req, res) => {
    res.json({ stats: systemStats, activities, machines, materials });
});

// Workers
app.get('/api/workers', (req, res) => {
    res.json(workers);
});

app.post('/api/workers', (req, res) => {
    const newWorker = {
        id: `W-${1045 + workers.length + 1}`,
        ...req.body,
        status: req.body.status || "Active",
        attendance: "Present"
    };
    workers.push(newWorker);
    systemStats.totalWorkers += 1; // Update stat

    activities.unshift({
        id: Date.now(),
        text: `New worker '${newWorker.name}' added to ${newWorker.shift}.`,
        time: "Just now"
    });

    res.status(201).json({ message: "Worker added successfully", worker: newWorker });
});

// Inventory (Materials)
app.get('/api/inventory', (req, res) => {
    res.json(materials);
});

app.post('/api/inventory', (req, res) => {
    const { name, stock, unit, reorderLevel } = req.body;
    let status = "OK";
    if (stock <= reorderLevel) status = "Critical";
    else if (stock < reorderLevel * 1.5) status = "Low";

    const newMaterial = {
        id: `MAT-${String(materials.length + 1).padStart(2, '0')}`,
        name,
        stock: Number(stock),
        unit,
        reorderLevel: Number(reorderLevel),
        status
    };
    materials.push(newMaterial);

    activities.unshift({
        id: Date.now(),
        text: `New material '${newMaterial.name}' added to inventory.`,
        time: "Just now"
    });

    res.status(201).json({ message: "Material added successfully", material: newMaterial });
});

// Production (Machines)
app.get('/api/production', (req, res) => {
    res.json(machines);
});

// Finance
app.get('/api/finance', (req, res) => {
    res.json({ invoices, payrollTotal: workers.length * 15000 }); // Mock $15k / worker / month avg
});

app.post('/api/invoices', (req, res) => {
    const { client, amount, date } = req.body;

    // Generate invoice ID
    const year = new Date().getFullYear();
    const count = invoices.filter(i => i.id.includes(year)).length + 1;
    const newInvoiceId = `INV-${year}-${String(count).padStart(3, '0')}`;

    const newInvoice = {
        id: newInvoiceId,
        client,
        amount: Number(amount),
        status: "Pending",
        date: date || new Date().toISOString().split('T')[0]
    };

    invoices.unshift(newInvoice);

    activities.unshift({
        id: Date.now(),
        text: `New invoice generated for ${client}.`,
        time: "Just now"
    });

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
});

// Sales (Clients & Orders)
let clients = [
    { id: "C-101", name: "Ahmed Plastics Co.", contact: "01711-234567", email: "info@ahmedplastics.com", status: "Active" },
    { id: "C-102", name: "Dhaka Trade House", contact: "01822-345678", email: "sales@dhakatrade.com", status: "Active" }
];

let orders = [
    { id: "ORD-25-001", client: "Ahmed Plastics Co.", product: "HDPE Pipe 4\"", amount: 5000, unit: "kg", status: "Processing", date: "2023-11-01" },
    { id: "ORD-25-002", client: "Dhaka Trade House", product: "PP Container 5L", amount: 2000, unit: "pcs", status: "Delivered", date: "2023-10-25" }
];

app.get('/api/clients', (req, res) => {
    res.json(clients);
});

app.post('/api/clients', (req, res) => {
    const newClient = { id: `C-${100 + clients.length + 1}`, status: "Active", ...req.body };
    clients.push(newClient);

    activities.unshift({
        id: Date.now(),
        text: `New client '${newClient.name}' added.`,
        time: "Just now"
    });
    res.status(201).json(newClient);
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: `ORD-25-${String(orders.length + 1).padStart(3, '0')}`,
        status: "Pending",
        date: new Date().toISOString().split('T')[0],
        ...req.body
    };
    orders.unshift(newOrder);

    activities.unshift({
        id: Date.now(),
        text: `New order '${newOrder.id}' placed by ${newOrder.client}.`,
        time: "Just now"
    });
    res.status(201).json(newOrder);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
