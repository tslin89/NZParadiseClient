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
    ListItemIcon
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
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

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
            <Button variant="text" size="small" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
            </Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" gutterBottom>
                    {property.location}
                </Typography>


                {/* Image Section */}
                <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
                    {/* First image (full-width) */}
                    {property.attachments.length > 0 && (
                        <ImageList variant="standard" cols={1}>
                            <ImageListItem key={property.attachments[0].attachmentID}>
                                <img alt=""
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
                                width: '100%', // Full parent width
                                maxWidth: '100%', // Prevent exceeding parent
                                display: 'flex',
                                flexWrap: 'wrap', // Wrap thumbnails to next line
                                gap: 1, // Space between thumbnails
                                py: 1,
                                overflowX: 'hidden', // Prevent horizontal overflow
                                // Responsive thumbnail sizes
                                '& > *': {
                                    width: { xs: 70, sm: 80, md: 100 }, // Smaller on xs (<600px), medium on sm (600-960px), default on md (960px+)
                                    height: { xs: 70, sm: 80, md: 100 }, // Square thumbnails
                                    minWidth: { xs: 70, sm: 80, md: 100 }, // Ensure minimum size
                                },
                            }}
                        >
                            {property.attachments.slice(1, 8).map((img: any, idx: number) => {
                                const isLastVisible = idx === 6 && property.attachments.length > 7; // Last visible thumbnail if more than 4
                                const remainingCount = property.attachments.length - 7; // Count of hidden images

                                return (
                                    <Box
                                        key={img.attachmentID}
                                        sx={{
                                            position: 'relative', // For overlay positioning
                                            flex: '0 0 auto', // Prevent shrinking/growing
                                            borderRadius: 1, // Rounded corners
                                            overflow: 'hidden', // Ensure image doesn't overflow
                                        }}
                                    >
                                        <img alt=""
                                            srcSet={`${img.filePath}?w=100&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${img.filePath}?w=100&fit=crop&auto=format`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover', // Scale image properly
                                                borderRadius: 1, // Match parent
                                                cursor: 'pointer',
                                                ...(isLastVisible && {
                                                    filter: 'brightness(0.6)', // Dim for overlay
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
                                                    borderRadius: 1, // Match thumbnail
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => setLightboxIndex(4)} // Start lightbox from 4th thumbnail
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
                    {property.propertyTypeName || "Property"} Details
                </Typography>
                <Grid container>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <List sx={{ p: 0, m: 0 }}>
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
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <SquareFootIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Area:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">{property.area} sqft</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <List sx={{ p: 0, m: 0 }}>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <AttachMoneyIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Price:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">
                                                NZ$ {property.price.toLocaleString()}
                                                <Typography component="span" variant="body1" color="text.secondary">
                                                    /week
                                                </Typography>
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ mr: 2 }}>
                                    <CalendarMonthIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.secondary">Listing date:&nbsp;</Typography>
                                            <Typography component="span" variant="body1" fontWeight="bold">{format(property.createdDate, "dd MMM yyyy")}</Typography>
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
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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


            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>

                <Typography variant="h6" gutterBottom>
                    Property Manager \ Owner Details
                </Typography>
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem disableGutters>
                        <ListItemIcon sx={{ mr: 2 }}>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <>
                                    <Typography component="span" variant="body2" color="text.secondary">Name:&nbsp;</Typography>
                                    <Typography component="span" variant="body1" fontWeight="bold">{property.user.firstName}</Typography>
                                </>
                            }
                        />
                    </ListItem>

                    {property.user.agencyName && (<ListItem disableGutters>
                        <ListItemIcon sx={{ mr: 2 }}>
                            <BusinessIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <>
                                    <Typography component="span" variant="body2" color="text.secondary">Agency:&nbsp;</Typography>
                                    <Typography component="span" variant="body1" fontWeight="bold">{property.user.agencyName}</Typography>
                                </>
                            }
                        />
                    </ListItem>)}


                    <ListItem disableGutters>
                        <ListItemIcon sx={{ mr: 2 }}>
                            <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <>
                                    <Typography component="span" variant="body2" color="text.secondary">Phone:&nbsp;</Typography>
                                    <Typography component="span" variant="body1" fontWeight="bold">{property.user.phoneNo}</Typography>
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemIcon sx={{ mr: 2 }}>
                            <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <>
                                    <Typography component="span" variant="body2" color="text.secondary">Email:&nbsp;</Typography>
                                    <Typography component="span" variant="body1" fontWeight="bold">{property.user.email}</Typography>
                                </>
                            }
                        />
                    </ListItem>
                </List>

                {user && user.userID !== property.user.userID && (
                    <>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            sx={{ width: '100%' }}
                            multiline
                            rows={3}
                            value={message}
                            slotProps={{
                                htmlInput: { maxLength: 300 },
                            }}
                            placeholder='Send enquiry message to property manager \ owner'
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="contained" color="secondary" sx={{ mt: 2, pl: 3, pr: 3 }} onClick={handleSendMessage}>
                            Send
                        </Button>
                    </>
                )}
            </Paper>

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