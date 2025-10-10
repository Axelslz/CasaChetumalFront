import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, CalendarClock, Package, DollarSign } from "lucide-react"; 
import { getFullDashboardStatsRequest } from "../../services/dashboard.js"; 

const KpiCard = ({ title, value, icon }) => {
    const styles = getKPIStyle(title);
    return (
        <Grid item xs={12} sm={6} md={2.4}>
            <Card className="shadow-md rounded-2xl hover:shadow-lg transition">
                <CardContent className={`flex items-center space-x-4 ${styles.bg}`}>
                    <div className={`p-3 rounded-full ${styles.icon} flex items-center justify-center`}>{icon}</div>
                    <div>
                        <Typography variant="body2" className={`font-medium ${styles.text}`}>{title}</Typography>
                        <Typography className="font-bold text-lg text-gray-900">{value}</Typography>
                    </div>
                </CardContent>
            </Card>
        </Grid>
    );
};

const getKPIStyle = (title) => {
    switch (title) {
        case "Ingresos Totales": return { bg: "bg-gradient-to-br from-blue-50 to-blue-100", text: "text-blue-800", icon: "text-blue-600 bg-blue-200" };
        case "Reservaciones Activas": return { bg: "bg-gradient-to-br from-yellow-50 to-yellow-100", text: "text-yellow-800", icon: "text-yellow-600 bg-yellow-200" };
        case "Eventos Próximos": return { bg: "bg-gradient-to-br from-green-50 to-green-100", text: "text-green-800", icon: "text-green-600 bg-green-200" };
        case "Clientes Nuevos (Mes)": return { bg: "bg-gradient-to-br from-purple-50 to-purple-100", text: "text-purple-800", icon: "text-purple-600 bg-purple-200" };
        case "Ingresos por Extras": return { bg: "bg-gradient-to-br from-amber-50 to-orange-100", text: "text-amber-800", icon: "text-amber-600 bg-amber-200" };
        default: return { bg: "bg-white", text: "text-gray-800", icon: "text-gray-600 bg-gray-200" };
    }
};

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getFullDashboardStatsRequest();
                setStats(response.data);
            } catch (error) {
                console.error("Error al cargar las estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

    if (loading) {
        return <div className="p-6 font-semibold text-amber-800">Cargando estadísticas...</div>;
    }

    const COLORS = ["#f59e0b", "#10b981"];

    return (
        <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
            <h2 className="text-2xl lg:text-4xl font-bold text-amber-900 mb-6">Dashboard General</h2>
            
            <Grid container spacing={3} className="mb-6">
                <KpiCard title="Ingresos Totales" value={formatCurrency(stats?.kpi?.totalIncome ?? 0)} icon={<TrendingUp />} />
                <KpiCard title="Reservaciones Activas" value={stats?.kpi?.activeReservations ?? 0} icon={<CalendarClock />} />
                <KpiCard title="Eventos Próximos" value={stats?.kpi?.upcomingEvents ?? 0} icon={<Package />} />
                <KpiCard title="Clientes Nuevos (Mes)" value={stats?.kpi?.newClientsThisMonth ?? 0} icon={<Users />} />
                <KpiCard title="Ingresos por Extras" value={formatCurrency(stats?.kpi?.incomeFromExtras ?? 0)} icon={<DollarSign />} />
            </Grid>
            
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Card className="shadow-md rounded-2xl h-full">
                        <CardContent>
                            <Typography variant="h6" className="mb-4 font-semibold">Reservaciones por mes (Últimos 6 meses)</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats?.charts?.reservationsByMonth}>
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value} reservas`} />
                                    <Bar dataKey="reservas" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={5}>
                    <Card className="shadow-md rounded-2xl h-full">
                        <CardContent>
                            <Typography variant="h6" className="mb-4 font-semibold">Distribución de Ingresos</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={stats?.charts?.incomeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {stats?.charts?.incomeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card className="shadow-md rounded-2xl">
                        <CardContent>
                            <Typography variant="h6" className="mb-4 font-semibold">Top 5 - Clientes con Mayor Gasto</Typography>
                            <ul className="space-y-2">
                                {stats?.lists?.frequentClients.map((c, i) => (
                                    <li key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                                        <span className="font-medium text-gray-700">{c.clientName}</span>
                                        <span className="text-sm font-bold text-green-700">{formatCurrency(c.totalSpent)}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Dashboard;
