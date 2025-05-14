// src/components/PropertyList.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Property } from '../types/types';
import { getPropertyList, toggleWishlist } from '../services/api';
import { PropertyFilterData } from '../types/formData';
import { PropertyContext } from '../components/PropertyContext';
import { useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from './AuthContext';
import { PropertyListModeEnum } from '../types/enums';
import emptyImage from '../assets/empty-image.png';
import { format } from 'date-fns';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { Divider } from '@mui/material';

interface DisplayProperty extends Property {
  img: string;
}

interface PropertyListProps {
  userID?: number | null;
  useContextFilter?: boolean;
  mode: PropertyListModeEnum
}

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: ((theme as any).vars || theme).palette.background.paper,
  position: 'relative',
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function Features({ property }: { property: Property }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '16px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption">
          <BedIcon /> {property.bedroom}
        </Typography>
        <Typography variant="caption">
          <BathtubIcon /> {property.bathroom}
        </Typography>
        <Typography variant="caption">
          <LocalParkingIcon /> {property.parking}
        </Typography>
        <Typography variant="caption">
          <SquareFootIcon /> {property.area} sqft
        </Typography>
      </Box>
    </Box>
  );
}

function FooterSection({ property }: { property: Property }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        mb: 2
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
        {/* <Typography variant="caption">
          <b>S$ {property.price.toLocaleString()}</b>
        </Typography> */}
        <Typography variant="caption">
          Listed by {property.user.firstName} {property.user.lastName}
        </Typography>
      </Box>
      <Typography variant="caption">
        {format(property.createdDate, "dd MMM yyyy")}
      </Typography>
    </Box>
  );
}

export default function PropertyList({ mode, useContextFilter = true }: PropertyListProps) {
  const { properties: contextProperties, setProperties: setContextProperties } = React.useContext(PropertyContext);
  const [localProperties, setLocalProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(null);
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const userID = user?.userID || null;

  React.useEffect(() => {
    if (!useContextFilter) {
      const fetchProperties = async () => {
        try {
          setLoading(true);
          setError(null);
          const filterData: PropertyFilterData = {
            description: '',
            propertyTypeID: 0,
            location: '',
            bedRoom: 0,
            bathRoom: 0,
            parking: 0,
            userID: userID,
            area: 0,
            mode: mode,
            minPrice: null,
            maxPrice: null
          };
          const response = await getPropertyList(filterData);
          console.log('new data', response)
          setLocalProperties(response.data || []);
        } catch (error: any) {
          console.error('Error fetching properties:', error);
          setError(error.message || 'Failed to load properties');
        } finally {
          setLoading(false);
        }
      };
      fetchProperties();
    } else {
      setLoading(false);
      setError(null);
    }
  }, [userID, useContextFilter, mode]);

  const properties = useContextFilter ? contextProperties : localProperties;

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    const newState = !property.isInWishlist;

    try {
      await toggleWishlist(property.propertyID, user?.userID || -1, newState);

      let updatedList: Property[];
      if (mode === PropertyListModeEnum.Wishlist && !newState) {
        // In Wishlist view, remove the property from the list if it was removed from the wishlist
        updatedList = properties.filter((p) => p.propertyID !== property.propertyID);
      } else {
        // Otherwise, update the isInWishlist status
        updatedList = properties.map((p) =>
          p.propertyID === property.propertyID
            ? { ...p, isInWishlist: newState }
            : p
        );
      }

      if (useContextFilter) {
        // Update the context properties
        setContextProperties(updatedList);
      } else {
        // Update local properties
        setLocalProperties(updatedList);
      }

      showMessage(
        newState ? 'Added to wishlist' : 'Removed from wishlist',
        'success'
      );
    } catch (err) {
      showMessage('Failed to update wishlist', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (properties.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>No properties found.</Typography>
      </Box>
    );
  }

  const displayProperties: DisplayProperty[] = properties.map((item: Property) => ({
    ...item,
    //img: `https://picsum.photos/800/450?random=${item.propertyID}`,
    img: item.attachments && item.attachments.length > 0 ? item.attachments[0].filePath : emptyImage//'https://www.lexus.co.nz/content/dam/lexus-v3-new-zealand/discover-lexus/future-concept-cars/lf-zc-concept.jpg'
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={2} columns={12}>
        {displayProperties.map((property, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={property.propertyID}>
            <SyledCard
              variant="outlined"
              onClick={() => navigate(`/property/${property.propertyID}`)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
              sx={{ height: '100%' }}
            >

              <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {userID && (mode === PropertyListModeEnum.Search || mode === PropertyListModeEnum.Wishlist) && userID !== property.user?.userID && (
                  <IconButton
                    aria-label="isInWishlist"
                    size="small"
                    onClick={(e) => handleToggleWishlist(e, property)}
                  >
                    {property.isInWishlist === true ? <Favorite color="primary" /> : <FavoriteBorder />}
                  </IconButton>
                )}

                {userID && userID === property?.user.userID && (
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-property/${property.propertyID}`);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <CardMedia
                component="img"
                alt={property.description}
                image={property.img}
                sx={{
                  aspectRatio: '16 / 9',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <SyledCardContent>
                <Box sx={{ display: 'flex' }}>
                  <Typography gutterBottom variant="h4" color="text.secondary" component="div" sx={{ flex: 1 }}>
                    {property.propertyTypeName || 'Unknown'}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    <b>NZ$ {property.price.toLocaleString()}</b>
                  </Typography>
                  <Typography sx={{mt:0.5}} color="text.secondary">
                    /week
                  </Typography>
                </Box>
                <Typography gutterBottom variant="h6" component="div">
                  {property.description}
                </Typography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                  {property.location}
                </StyledTypography>
              </SyledCardContent>
              <Features property={property} />
              <Divider sx={{ my: 2, m: 0 }} />
              <FooterSection property={property} />
            </SyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
