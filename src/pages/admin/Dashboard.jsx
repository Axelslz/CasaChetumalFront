import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp, 
  Users,
  CalendarClock,
  ShoppingCart,
  Music,
} from "lucide-react";

function Dashboard() {
  // Datos simulados (se reemplazarán con datos reales desde API)
  const reservacionesPorMes = [
    { mes: "Ene", reservas: 20 },
    { mes: "Feb", reservas: 35 },
    { mes: "Mar", reservas: 25 },
    { mes: "Abr", reservas: 40 },
    { mes: "May", reservas: 30 },
    { mes: "Jun", reservas: 50 },
  ];

  const ingresosDistribucion = [
    { name: "Reservación Base", value: 8500 },
    { name: "Extras", value: 4300 },
  ];

  const ingresosCategoria = [
    { name: "Botanas", value: 4500 },
    { name: "Bebidas", value: 7800 },
    { name: "Música", value: 3200 },
  ];

  const clientesFrecuentes = [
    { name: "Ana López", total: "$5,400 MXN" },
    { name: "Luis González", total: "$4,200 MXN" },
    { name: "María Pérez", total: "$3,800 MXN" },
    { name: "Carlos Sánchez", total: "$3,500 MXN" },
    { name: "Pedro Fernández", total: "$3,000 MXN" },
  ];

  const COLORS = ["#f59e0b", "#2563eb", "#16a34a", "#9333ea"];

  const getKPIStyle = (title) => {
    switch (title) {
        case "Ingresos Totales":
        return {
            bg: "bg-gradient-to-br from-blue-50 to-blue-100",
            text: "text-blue-800",
            icon: "text-blue-600 bg-blue-200",
        };
        case "Reservaciones Activas":
        return {
            bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
            text: "text-yellow-800",
            icon: "text-yellow-600 bg-yellow-200",
        };
        case "Eventos Próximos":
        return {
            bg: "bg-gradient-to-br from-green-50 to-green-100",
            text: "text-green-800",
            icon: "text-green-600 bg-green-200",
        };
        case "Clientes Nuevos":
        return {
            bg: "bg-gradient-to-br from-purple-50 to-purple-100",
            text: "text-purple-800",
            icon: "text-purple-600 bg-purple-200",
        };
        case "Ingresos por Extras":
        return {
            bg: "bg-gradient-to-br from-amber-50 to-orange-100",
            text: "text-amber-800",
            icon: "text-amber-600 bg-amber-200",
        };
        default:
        return {
            bg: "bg-white",
            text: "text-gray-800",
            icon: "text-gray-600 bg-gray-200",
        };
    }
    };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
      {/* Título */}
      <h2 className="text-2xl lg:text-4xl font-bold text-amber-900 mb-6">
            Dashboard General
        </h2>

      {/* Sección KPI Cards */}
      <Grid container spacing={3} className="mb-6">
        {[
          {
            title: "Ingresos Totales",
            value: "$12,500 MXN",
            icon: <TrendingUp className="text-green-600" />,
          },
          {
            title: "Reservaciones Activas",
            value: "8",
            icon: <CalendarClock className="text-orange-500" />,
          },
          {
            title: "Eventos Próximos",
            value: "3",
            icon: <ShoppingCart className="text-blue-600" />,
          },
          {
            title: "Clientes Nuevos",
            value: "12",
            icon: <Users className="text-purple-600" />,
          },
          {
            title: "Ingresos por Extras",
            value: "$4,200 MXN",
            icon: <Music className="text-amber-600" />,
          },
        ].map((card, index) => {
            const styles = getKPIStyle(card.title);
          return (
            <Grid item size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
                <Card className="shadow-md rounded-2xl hover:shadow-lg transition" >
                    <CardContent className={`flex items-center space-x-4 ${styles.bg}`}>
                        <div
                        className={`p-3 rounded-full ${styles.icon} flex items-center justify-center`}
                        >
                        {card.icon}
                        </div>
                        <div>
                        <Typography
                            variant="body2"
                            className={`font-medium ${styles.text}`}
                        >
                            {card.title}
                        </Typography>
                        <Typography className="font-bold text-lg text-gray-900">
                            {card.value}
                        </Typography>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            );
        })}
      </Grid>

      {/* Sección de gráficos */}
      <Grid container spacing={4}>
        {/* Reservaciones por mes */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card className="shadow-md rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Reservaciones por mes
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reservacionesPorMes}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reservas" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribución de ingresos */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card className="shadow-md rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Distribución de Ingresos
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ingresosDistribucion}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {ingresosDistribucion.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ingresos por categoría */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card className="shadow-md rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Ingresos por Categoría
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ingresosCategoria}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Clientes frecuentes */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card className="shadow-md rounded-2xl">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Clientes Frecuentes
              </Typography>
              <ul className="space-y-2">
                {clientesFrecuentes.map((c, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <span className="text-sm text-green-700">{c.total}</span>
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
