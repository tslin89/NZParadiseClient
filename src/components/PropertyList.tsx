import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import FormControl from '@mui/material/FormControl';
// import InputAdornment from '@mui/material/InputAdornment';
// import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import TwitterIcon from '@mui/icons-material/X';
// import GitHubIcon from '@mui/icons-material/GitHub';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getPropertyList } from '../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Property } from '../types/types';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

/*const cardData = [
  {
    img: 'https://picsum.photos/800/450?random=1',
    tag: 'Mansion',
    title: 'Packed with Potential',
    description:
      '165 George Street, Tuakau, Franklin',
    authors: [
      { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
    price: 4500,
  },
  {
    img: 'https://picsum.photos/800/450?random=2',
    tag: 'Condominium',
    title: 'Awesome Coastal Opportunity - Koutu',
    description:
      '41 Koutu Terrace, Opononi, Far North, Northland',
    authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
    price: 3000,
  },
  {
    img: 'https://picsum.photos/800/450?random=3',
    tag: 'Apartment',
    title: 'Stylish Home & Guest Cabin close to Beach',
    description:
      '6A Taipa View Road, Taipa, Far North, Northland',
    authors: [{ name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=4',
    tag: 'Apartment',
    title: 'Private Retreat in Harbour Park!',
    description:
      '7 Cresta Drive, Katikati, Western Bay Of Plenty, Bay Of Plenty',
    authors: [{ name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' }],
    price: 900
  },
  {
    img: 'https://picsum.photos/800/450?random=5',
    tag: 'Mansion',
    title: "Character and Modern in Popular Petone",
    description:
      "20 Heretaunga Street, Petone, Lower Hutt, Wellington",
    authors: [{ name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg' }],
    price: 8700
  },
  {
    img: 'https://picsum.photos/800/450?random=6',
    tag: 'Landed House',
    title: 'A private family space, waiting to be enjoyed',
    description:
      "12a Henry Curd Terrace, Pukekohe, Franklin, Auckland",
    authors: [
      { name: 'Agnes Walker', avatar: '/static/images/avatar/4.jpg' },
      { name: 'Trevor Henderson', avatar: '/static/images/avatar/5.jpg' },
    ],
    price: 3200
  },

];*/

interface DisplayProperty extends Property {
  img: string; // extra fields for this form
}

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: ((theme as any).vars || theme).palette.background.paper,
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
          <DirectionsCarIcon /> {property.parking}
        </Typography>
      </Box>
    </Box>
  );
}

function Author({ property }: { property: Property }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption">
          <b>S$ {property.price.toLocaleString()}</b>
        </Typography>
        <Typography variant="caption">
          Listed by {property.user.firstName} {property.user.lastName}
        </Typography>
      </Box>
      <Typography variant="caption">
        {new Date(property.createdDate).toLocaleDateString()}
      </Typography>
    </Box>
  );
}

export default function PropertyList() {
  const [properties, setProperties] = React.useState<DisplayProperty[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPropertyList({
          description: '', // Fetch all properties
          // userID: 1, // Add for user-specific listings
          // bedRoom: 2,
          // bathRoom: 1,
        });
        const mappedProperties = response.data.map((item: Property) => ({
          ...item,
          img: `https://picsum.photos/800/450?random=${item.propertyID}`,
        }));
        setProperties(mappedProperties);
      } catch (err: any) {
        setError(err.message || 'Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Empty dependency array for initial fetch

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={2} columns={12}>
        {properties.map((property, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={property.propertyID}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
              sx={{ height: '100%' }}
            >
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
                <Typography gutterBottom variant="caption" component="div">
                  {property.propertyType?.description || 'Unknown'}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {property.description}
                </Typography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                  {property.location}
                </StyledTypography>
              </SyledCardContent>
              <Features property={property} />
              <Author property={property} />
            </SyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
