import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { registerProperty } from '../services/api';
import { RegisterPropertyFormData } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';

interface RegisterPropertyFormProps {
    onSubmitSuccess: () => void;
}

const RegisterPropertyForm: React.FC<RegisterPropertyFormProps> = ({ onSubmitSuccess }) => {
    const navigate = useNavigate();
    const { showMessage } = useSnackbar();
    const { user } = useAuth();

    console.log('>>', user)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterPropertyFormData>({
        defaultValues: {
            userID: user?.userID // temporarily set user
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: RegisterPropertyFormData) => {
        setIsSubmitting(true);
        try {

            const resultObj = await registerProperty(data);

            if (resultObj.status === -1) {
                showMessage(resultObj.message || 'An error occurred', 'error');
            } else {
                showMessage('New Property Registered', 'success');
                navigate('/mylistings');
                onSubmitSuccess();
            }
        } catch (error) {
            // setError('description', {
            //     type: 'manual',
            //     message: 'Error Msg' + error,
            // });
            showMessage((error instanceof Error) ? error.message : 'Unexpected error occurred', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Description"
                        required
                        {...register('description', {
                            required: 'Property Description is required'
                        })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Price"
                        type="number"
                        required
                        {...register('price', { required: 'Price is required' })}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Location"
                        required
                        {...register('location', { required: 'location is required' })}
                        error={!!errors.location}
                        helperText={errors.location?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Bed Room"
                        type="number"
                        required
                        {...register('bedRoom', { required: 'bedRoom is required' })}
                        error={!!errors.bedRoom}
                        helperText={errors.bedRoom?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Bath Room"
                        type="number"
                        required
                        {...register('bathRoom', { required: 'bathRoom is required' })}
                        error={!!errors.bathRoom}
                        helperText={errors.bathRoom?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Parking"
                        type="number"
                        required
                        {...register('parking', { required: 'parking is required' })}
                        error={!!errors.parking}
                        helperText={errors.parking?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Area"
                        type="number"
                        required
                        {...register('area', { required: 'area is required' })}
                        error={!!errors.area}
                        helperText={errors.area?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Features"
                        required
                        {...register('PropertyFeatureIDs', { required: 'PropertyFeatureIDs is required' })}
                        error={!!errors.PropertyFeatureIDs}
                        helperText={errors.PropertyFeatureIDs?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Available Date"
                        {...register('availableDate')}
                        error={!!errors.availableDate}
                        helperText={errors.availableDate?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Parking"
                        type="number"
                        required
                        {...register('parking', { required: 'parking is required' })}
                        error={!!errors.parking}
                        helperText={errors.parking?.message}
                    />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="propertyTypeID"
                        type="number"
                        required
                        {...register('propertyTypeID', { required: 'propertyTypeID is required' })}
                        error={!!errors.propertyTypeID}
                        helperText={errors.propertyTypeID?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterPropertyForm;