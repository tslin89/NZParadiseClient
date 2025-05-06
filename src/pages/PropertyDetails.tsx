import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Chip, CircularProgress, Alert, Paper, Button, Stack, List, ListItem, ListItemText, ImageList, ImageListItem, Divider, TextField } from '@mui/material';
import { getPropertyDetails, getPropertyMetadata } from '../services/api';
import LocationMapPreview from '../components/LocationMapPreview';
import { PropertyFeature } from '../types/formData';
import { useSnackbar } from '../components/SnackbarContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { WidthFull } from '@mui/icons-material';
import { useAuth } from '../components/AuthContext';

const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<any>(null);
    const [propertyFeatures, setPropertyFeatures] = useState<PropertyFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    //const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const { user } = useAuth();

    const { showMessage } = useSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Invalid property ID');
                setLoading(false);
                return;
            }
            try {
                // Fetch property details
                const propertyResponse = await getPropertyDetails(parseInt(id, 10));
                setProperty(propertyResponse.data);

                // Fetch metadata for property features
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
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    if (error || !property) {
        return <Alert severity="error" sx={{ mt: 8 }}>{error || 'Property not found'}</Alert>;
    }

    // Map propertyFeatureIDs to descriptions
    const featureDescriptions = property.propertyFeatureIDs
        ?.split(',')
        .map((id: string) => {
            const feature = propertyFeatures.find(
                (f) => f.propertyFeatureID.toString() === id.trim()
            );
            return feature?.description;
        })
        .filter(Boolean) || [];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button variant="text" size="small" onClick={() => navigate(-1)}>
                ⬅️ Back
            </Button>
            <Paper elevation={3} sx={{ p: 4 }}>

                <Typography variant="h2" gutterBottom>
                    {property.propertyType?.description || 'Unknown Type'}
                </Typography>

                <Typography variant="h3" gutterBottom>
                    {property.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={4} mt={2}>
                    {/* LEFT COLUMN */}
                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography variant="h3" gutterBottom>
                            {property.location}
                        </Typography>

                        <List dense disablePadding>
                            <ListItem disableGutters>
                                <ListItemText primary={`Bedrooms: ${property.bedroom}`} />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={`Bathrooms: ${property.bathroom}`} />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={`Parking: ${property.parking}`} />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={`Area: ${property.area} sqft`} />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemText primary={`Price: S$ ${property.price.toLocaleString()}`} />
                            </ListItem>
                        </List>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>Features</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {featureDescriptions.length > 0 ? (
                                    featureDescriptions.map((desciption: number, indx: number) => (
                                        <Chip key={indx} label={desciption} />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No features available
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                            <ImageList variant="standard" cols={3} gap={8}>
                                {property.attachments.map((img: any, idx: number) => (
                                    <ImageListItem
                                        key={img.attachmentID}
                                        cols={idx === 0 ? 3 : 1}
                                    >
                                        <img
                                            srcSet={`${img.filePath}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${img.filePath}?w=248&fit=crop&auto=format`}
                                            style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }}
                                            loading="lazy"
                                            onClick={() => setLightboxIndex(idx)}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {property.location && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Location</Typography>
                        <LocationMapPreview address={property.location} />
                    </Box>
                )}
            </Paper>

            {/* {user && user.userID > -1 && (
                <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Contact Property Manager\Owner
                    </Typography>
                    <TextField id="outlined-basic" variant="outlined" sx={{ width: '100%' }} multiline rows={3} />
                    <Button variant="outlined" sx={{ mt: 2 }}>Send</Button>
                </Paper>
            )} */}

            {lightboxIndex !== null && (
                <Lightbox
                    open={lightboxIndex !== null}
                    index={lightboxIndex}
                    close={() => setLightboxIndex(null)}
                    slides={property.attachments.map((img: any) => ({ src: img.filePath }))}
                />
            )}

            {/* {selectedImage && (
                <Box
                    onClick={() => setSelectedImage(null)}
                    sx={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2000,
                        cursor: 'zoom-out'
                    }}
                >
                    <img
                        src={selectedImage || ''}
                        alt="enlarged"
                        style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: 8 }}
                    />
                </Box>
            )} */}
        </Container>
    );
};

export default PropertyDetails;