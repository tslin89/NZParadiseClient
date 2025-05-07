import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    ImageList,
    ImageListItem,
    Divider,
    TextField,
    ListItemIcon,
} from '@mui/material';
import { getPropertyDetails, getPropertyMetadata, submitMessage } from '../services/api';
import LocationMapPreview from '../components/LocationMapPreview';
import { PropertyFeature } from '../types/formData';
import { useSnackbar } from '../components/SnackbarContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useAuth } from '../components/AuthContext';
import { format } from 'date-fns';

import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


// Add this CSS to your stylesheet or a <style> tag in the component
const thumbnailStyles = `
  .thumbnail-container::-webkit-scrollbar {
    height: 8px;
  }
  .thumbnail-container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  .thumbnail-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .thumbnail-container {
    -ms-overflow-style: auto; /* IE and Edge */
    scrollbar-width: thin; /* Firefox */
  }
`;

const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<any>(null);
    const [propertyFeatures, setPropertyFeatures] = useState<PropertyFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const { showMessage } = useSnackbar();

    const handleSendMessage = async () => {
        if (!user || !property) return;

        if (!message.trim()) {
            showMessage('Please enter a message.', 'warning');
            return;
        }

        try {
            const success = await submitMessage(user.userID, property.propertyID, message);
            if (success) {
                showMessage('Message sent successfully. Apartment owner will contact you via email.', 'success');
                setMessage('');
            }
        } catch (error) {
            showMessage('Failed to send message at this time. Please try again later.', 'error');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Invalid property ID');
                setLoading(false);
                return;
            }
            try {
                const propertyResponse = await getPropertyDetails(parseInt(id, 10));
                setProperty(propertyResponse.data);
                const metadataResponse = await getPropertyMetadata();
                setPropertyFeatures(metadataResponse.data.propertyFeatures || []);
                setError(null);
            } catch (error: any) {
                setError(error.message || 'Failed to load property or metadata');
                showMessage(error.message || 'Failed to load property or metadata', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, showMessage]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !property) {
        return (
            <Alert severity="error" sx={{ mt: 8 }}>
                {error || 'Property not found'}
            </Alert>
        );
    }

    const featureDescriptions =
        property.propertyFeatureIDs
            ?.split(',')
            .map((id: string) => {
                const feature = propertyFeatures.find((f) => f.propertyFeatureID.toString() === id.trim());
                return feature?.description;
            })
            .filter(Boolean) || [];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <style>{thumbnailStyles}</style>
            <Button variant="text" size="small" onClick={() => navigate(-1)}>
                ⬅️ Back
            </Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" gutterBottom>
                    {property.location}
                </Typography>


                {/* Image Section */}
                <Box sx={{ width: '100%' }}>
                    {/* First image (full-width) */}
                    {property.attachments.length > 0 && (
                        <ImageList variant="standard" cols={1}>
                            <ImageListItem key={property.attachments[0].attachmentID}>
                                <img
                                    srcSet={`${property.attachments[0].filePath}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${property.attachments[0].filePath}?w=248&fit=crop&auto=format`}
                                    style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }}
                                    loading="lazy"
                                    onClick={() => setLightboxIndex(0)}
                                />
                            </ImageListItem>
                        </ImageList>
                    )}

                    {/* Thumbnails (limited to 4 with overlay for remaining) */}
                    {property.attachments.length > 1 && (
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'nowrap',
                                gap: 1,
                                py: 1,
                            }}
                        >
                            {property.attachments.slice(1, 5).map((img: any, idx: number) => {
                                const isLastVisible = idx === 3 && property.attachments.length > 5; // Last visible thumbnail if more than 4
                                const remainingCount = property.attachments.length - 5; // Count of hidden images

                                return (
                                    <Box
                                        key={img.attachmentID}
                                        sx={{
                                            position: 'relative', // For overlay positioning
                                            flex: '0 0 auto',
                                            width: 180,
                                            height: 100,
                                            minWidth: 100,
                                        }}
                                    >
                                        <img
                                            srcSet={`${img.filePath}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${img.filePath}?w=100&fit=crop&auto=format`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                ...(isLastVisible && {
                                                    filter: 'brightness(0.6)', // Dim the last thumbnail to highlight the overlay
                                                }),
                                            }}
                                            loading="lazy"
                                            onClick={() => setLightboxIndex(idx + 1)}
                                        />
                                        {isLastVisible && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
                                                    borderRadius: 0,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => setLightboxIndex(4)} // Start lightbox from the 4th thumbnail (index 3 + 1)
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    +{remainingCount} more
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Typography variant="h6" gutterBottom>Description</Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {property.description}
                    </Typography>
                </Box>

                <Typography variant="h6" gutterBottom mt={4}>
                    {property.propertyType?.description || "Property"} Details
                </Typography>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <List>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <BedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Bedroom:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">{property.bedroom}</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <BathtubIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Bathrooms:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">{property.bathroom}</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <LocalParkingIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Parking:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">{property.parking}</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <List dense disablePadding>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <AttachMoneyIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Price:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">NZ$ {property.price.toLocaleString()}</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <SquareFootIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Area:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">${property.area} sqft</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            {property.availableFromDate && (
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ mr: 2 }}>
                                        <CalendarMonthIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.secondary">Available from:&nbsp;</Typography>
                                                <Typography component="span" variant="body1" fontWeight="bold">{format(property.availableFromDate, "dd MMM yyyy")}</Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>Features</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {featureDescriptions.length > 0 ? (
                            featureDescriptions.map((description: number, idx: number) => (
                                <Chip key={idx} label={description} />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No features available
                            </Typography>
                        )}
                    </Box>
                </Box>


                <Divider sx={{ my: 2 }} />

                {property.location && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>Location</Typography>
                        <LocationMapPreview address={property.location} interactive={true} />
                    </Box>
                )}
            </Paper>

            {
                user && user.userID !== property.user.userID && (
                    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Property Manager\Owner
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            sx={{ width: '100%' }}
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleSendMessage}>
                            Send
                        </Button>
                    </Paper>
                )
            }

            {
                lightboxIndex !== null && (
                    <Lightbox
                        open={lightboxIndex !== null}
                        index={lightboxIndex}
                        close={() => setLightboxIndex(null)}
                        slides={property.attachments.map((img: any) => ({ src: img.filePath }))}
                    />
                )
            }
        </Container >
    );
};

export default PropertyDetails;