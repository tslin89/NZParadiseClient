// src/pages/PropertyDetails.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Chip, CircularProgress, Alert, Paper, Button } from '@mui/material';
import { getPropertyDetails } from '../services/api';
import LocationMapPreview from '../components/LocationMapPreview';

const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) return;
            try {
                const response = await getPropertyDetails(parseInt(id, 10));
                setProperty(response.data);
                setError(null);
            } catch (error: any) {
                setError(error.message || 'Failed to load property');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    if (error || !property) {
        return <Alert severity="error" sx={{ mt: 8 }}>{error || 'Property not found'}</Alert>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button variant="text" size="small" onClick={() => navigate(-1)}>
                ⬅️ Back
            </Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h1" gutterBottom>
                    {property.description}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {property.propertyType?.description || 'Unknown Type'} - {property.location}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 4 }}>
                    <Chip label={`Bedrooms: ${property.bedRoom}`} />
                    <Chip label={`Bathrooms: ${property.bathRoom}`} />
                    <Chip label={`Parking: ${property.parking}`} />
                    <Chip label={`Area: ${property.area} sqft`} />
                    <Chip label={`Price: S$ ${property.price.toLocaleString()}`} />
                </Box>

                {property.location && (
                    <LocationMapPreview address={property.location} />
                )}

                {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>Features</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {property.propertyFeatures.map((feature: any) => (
                                <Chip key={feature.propertyFeatureID} label={feature.description} />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default PropertyDetails;
