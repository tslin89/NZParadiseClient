// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    List,
    ListItem,
    IconButton,
    Avatar,
    useTheme,
    Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { fetchDashboardSummary } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { format } from 'date-fns';
import { Favorite } from '@mui/icons-material';



const Dashboard = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    //const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ab47bc', '#ff7043', '#26c6da'];
    const COLORS = isDarkMode
        ? ['#90caf9', '#4db6ac', '#ffcc80', '#ce93d8', '#a1887f', '#80cbc4', '#ef9a9a']
        : ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ab47bc', '#ff7043', '#26c6da'];


    type ChartData = { type: string; count: number };
    type Message = { id: number; sender: string; preview: string, createdDate: string };
    type TrendData = { month: string; count: number };

    const [listedData, setListedData] = useState<ChartData[]>([]);
    const [wishlistedData, setWishlistedData] = useState<ChartData[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [wishlistTrend, setWishlistTrend] = useState<TrendData[]>([]);
    const [totalProperties, setTotalProperties] = useState<number>(0);
    const [totalWishlsit, setTotalWishlist] = useState<number>(0);
    const navigate = useNavigate();
    const userName = user?.firstName
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardSummary(Number(user?.userID)).then((data) => {
            if (!data) {
                setError("We're' unable to load your dashboard at the moment. Please try again later.");
                return;
            }
            setListedData(data.listedPropertiesByType);
            setWishlistedData(data.wishlistedPropertiesByType);
            setMessages(data.recentMessages);
            setWishlistTrend(data.wishlistTrend);
            setTotalProperties(data.totalProperties);
            setTotalWishlist(data.totalWishlist);
        });
    }, [user?.userID]);

    return (
        <Box p={2}>
            {error && (
                // <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                //     {error}
                // </Alert>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Grid container gap={2} spacing={2}>
                {/* Welcome Message */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ minHeight: 120 }}>
                        <CardContent>
                            <Box sx={{ mb: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <IconButton onClick={() => navigate('/edit-profile')} size='medium'>
                                        <PersonIcon fontSize="medium" />
                                    </IconButton>

                                    <Box>
                                        <Typography variant="h5">Hello {userName},</Typography>
                                        <Typography variant="body2">
                                            Welcome to NZParadise – your trusted online platform to{' '}
                                            <Link to="/register-property" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                list your property
                                            </Link>
                                            {' or '}
                                            <Link to="/search" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                discover
                                            </Link>{' '}
                                            your next rental home across New Zealand.
                                        </Typography>
                                    </Box>
                                </Stack>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Stats */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ minHeight: 120 }} >
                        <CardContent>
                            <Stack direction="row" spacing={4} justifyContent="center">
                                <Stack alignItems="center">
                                    <HomeIcon color="secondary" fontSize="large" />
                                    <Typography variant="h5">{totalProperties}</Typography>
                                    <Typography variant="body2">Total Listings</Typography>
                                </Stack>
                                <Stack alignItems="center">
                                    <Favorite color="primary" fontSize='large' />
                                    <Typography variant="h5">{totalWishlsit}</Typography>
                                    <Typography variant="body2">Total Wishlsits</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Listed Properties Pie Chart */}

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ minHeight: 320 }} >
                        <CardContent >
                            <Typography variant="h6" sx={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('/mylistings')}>My Listed Properties</Typography>
                            {listedData && listedData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={listedData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="count"
                                            nameKey="type"
                                            label
                                        >
                                            {listedData.map((entry, index) => (
                                                <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box
                                    sx={{
                                        height: 250,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    No data available
                                </Box>)}
                        </CardContent>
                    </Card>
                </Grid>


                {/* Wishlisted Properties Pie Chart */}

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ minHeight: 320 }} >
                        <CardContent>
                            <Typography variant="h6" onClick={() => navigate('/wishlist')} sx={{ cursor: 'pointer', textAlign: 'center' }}>My Favourite Properties</Typography>
                            {wishlistedData && wishlistedData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={wishlistedData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="count"
                                            nameKey="type"
                                            label
                                        >
                                            {wishlistedData.map((entry, index) => (
                                                <Cell key={entry.type} fill={COLORS[(index + 2) % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box
                                    sx={{
                                        height: 250,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    No data available
                                </Box>)}
                        </CardContent>
                    </Card>
                </Grid>


                {/* Wishlist Trend Bar Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ minHeight: 320 }} >
                        <CardContent>
                            <Typography variant="h6" sx={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('/wishlist')} >My Properties in Wishlists</Typography>
                            {wishlistTrend && wishlistTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={wishlistTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box
                                    sx={{
                                        height: 250,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    No data available
                                </Box>)}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Messages */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ minHeight: 320 }} >
                        <CardContent>
                            <Typography variant="h6" sx={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => navigate('/messages')}>Recent Messages</Typography>
                            {messages && messages.length > 0 ? (
                                <>
                                    <List>
                                        {messages.map((msg) => (
                                            <ListItem key={msg.id} divider alignItems="flex-start">
                                                <Avatar sx={{ width: 28, height: 28, fontSize: 14, mr: 2 }}>
                                                    {msg.sender[0]}
                                                </Avatar>

                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {msg.sender}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {msg.preview}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {format(msg.createdDate, "dd MMM yyyy - hh:mm a")}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Typography variant="body2" sx={{ cursor: 'pointer' }} textAlign="right" color="primary" onClick={() => navigate('/messages')}>
                                        View all messages →
                                    </Typography></>
                            ) : (
                                <Box
                                    sx={{
                                        height: 250,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    No data available
                                </Box>)}
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* Rest of the dashboard can follow here (charts, messages, etc.) */}
        </Box>
    );
};

export default Dashboard;
