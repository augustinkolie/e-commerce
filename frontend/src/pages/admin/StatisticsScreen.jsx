import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    Star,
    TrendingUp,
    Loader2,
    BarChart3,
    PieChart as PieChartIcon,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';
import api from '../../utils/api';

const COLORS = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#9B59B6', '#34495E', '#1ABC9C', '#E67E22'];

const StatisticsScreen = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/dashboard/stats');
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError(err.response?.data?.message || err.response?.data?.detail || err.message || 'Erreur inconnue');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Impossible de charger les statistiques (v4)</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                    {error || 'Aucune donnée disponible pour le moment.'}
                </p>
                <button
                    onClick={fetchStats}
                    className="mt-6 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // Generate granular jagged data for high-fidelity financial look
    const generateJaggedData = () => {
        const data = [];
        let baseValue = 654;
        const totalPoints = 160;
        const currentPointIdx = 110; // Where the green line stops and gray starts

        for (let i = 0; i < totalPoints; i++) {
            // Add some "jaggedness" with random fluctuations
            let fluctuation = (Math.random() - 0.5) * 3;
            if (Math.random() > 0.95) fluctuation *= 3; // Occasional "aigu" peaks
            baseValue += fluctuation;

            // Constrain within a realistic range
            if (baseValue > 666) baseValue = 665;
            if (baseValue < 652) baseValue = 653;

            const minute = ((i % 18) * 3).toString().padStart(2, '0');
            const hour = Math.floor(9 + i / 18);
            const time = `${hour}:${minute}`;

            data.push({
                time,
                value: i <= currentPointIdx ? baseValue : null,
                predictedValue: i >= currentPointIdx ? baseValue : null,
                volume: `${Math.floor(Math.random() * 20 + 10)}k`,
                isCurrent: i === currentPointIdx
            });
        }
        return data;
    };

    const salesData = generateJaggedData();
    const currentPrice = salesData.find(d => d.isCurrent)?.value || 659.66;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Utilisateurs"
                    value={stats.users.total}
                    subValue={`+${stats.users.recent.length} récents`}
                    icon={Users}
                    color="purple"
                />
                <MetricCard
                    title="Produits"
                    value={stats.products.total}
                    subValue={`${stats.products.byCategory.length} catégories`}
                    icon={ShoppingBag}
                    color="orange"
                />
                <MetricCard
                    title="Avis Clients"
                    value={stats.reviews.total}
                    subValue={`${stats.reviews.averageRating.toFixed(1)} ⭐ moyenne`}
                    icon={Star}
                    color="yellow"
                />
                <MetricCard
                    title="Engagement"
                    value={`${stats.reviews.total > 0 ? ((stats.reviews.total / stats.products.total) * 100).toFixed(0) : 0}%`}
                    subValue="Taux de retour"
                    icon={TrendingUp}
                    color="green"
                />
            </div>

            {/* Professional Financial Sales Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {['1 j', '5 j', '1 m', '6 m', 'YTD', '1 a', '5 a', 'MAX'].map((period, idx) => (
                                <button
                                    key={period}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${idx === 0 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 rounded-none' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    interval={10}
                                />
                                <YAxis
                                    domain={[652, 666]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    orientation="right"
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            const val = data.value || data.predictedValue;
                                            return (
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 pointer-events-none min-w-[140px]">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {val.toLocaleString('fr-FR')} {stats.currency}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        6 janv., {data.time} UTC-5
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        Volume : {data.volume}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <ReferenceLine
                                    y={658.79}
                                    stroke="#9ca3af"
                                    strokeDasharray="2 2"
                                    label={{
                                        position: 'right',
                                        value: `Clôt préc ${658.79} ${stats.currency}`,
                                        fill: '#1f2937',
                                        fontSize: 10,
                                        fontWeight: '600',
                                        offset: 10
                                    }}
                                />
                                {/* Current Green Area */}
                                <Area
                                    type="linear"
                                    dataKey="value"
                                    stroke="#10b981"
                                    strokeWidth={1.5}
                                    fillOpacity={0.12}
                                    fill="url(#colorSales)"
                                    connectNulls={false}
                                    activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }}
                                />
                                {/* Predicted/Previous Gray Area */}
                                <Area
                                    type="linear"
                                    dataKey="predictedValue"
                                    stroke="#cbd5e1"
                                    strokeWidth={1.5}
                                    fill="none"
                                    connectNulls={false}
                                    activeDot={false}
                                />
                                {/* Current Price Dot */}
                                {salesData.filter(d => d.isCurrent).map((d, i) => (
                                    <ReferenceLine
                                        key={i}
                                        x={d.time}
                                        stroke="#1f2937"
                                        strokeDasharray="3 3"
                                        strokeWidth={1}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-gray-400 mt-2 px-12">
                        <span>12:00</span>
                        <span>15:00</span>
                        <span>18:00</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Trends Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="text-primary" size={20} />
                            Croissance des Utilisateurs
                        </h2>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.users.trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">{label}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-2xl font-black text-primary">{payload[0].value}</p>
                                                        <p className="text-sm text-gray-500">nouveaux inscrits</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="users"
                                    fill="url(#colorUsers)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={35}
                                />
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <PieChartIcon className="text-blue-500" size={20} />
                            Répartition par Catégorie
                        </h2>
                    </div>
                    <div className="h-[350px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.products.byCategory}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    dataKey="count"
                                    nameKey="_id"
                                    stroke="#fff"
                                    strokeWidth={2}
                                >
                                    {stats.products.byCategory.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{payload[0].name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
                                                        <p className="text-xl font-black text-primary">{payload[0].value}</p>
                                                        <p className="text-xs text-gray-400">produits</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={40}
                                    iconType="circle"
                                    iconSize={10}
                                    formatter={(value) => (
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-default">
                                            {value}
                                        </span>
                                    )}
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Ranking Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Performance des Catégories</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-center w-20">#</th>
                                <th className="px-6 py-4 font-semibold">Catégorie</th>
                                <th className="px-6 py-4 font-semibold text-center">Produits</th>
                                <th className="px-6 py-4 font-semibold">Progression</th>
                                <th className="px-6 py-4 font-semibold text-right">Part de Marché</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {stats.products.byCategory.map((cat, index) => (
                                <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index < 3 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{cat._id}</td>
                                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{cat.count} items</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-green-500 font-medium text-sm">
                                            <ArrowUpRight size={16} />
                                            <span>{(Math.random() * 15 + 2).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {((cat.count / stats.products.total) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, subValue, icon: Icon, color }) => {
    const colorClasses = {
        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
        orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
        yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
        green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{subValue}</p>
        </div>
    );
};

export default StatisticsScreen;
