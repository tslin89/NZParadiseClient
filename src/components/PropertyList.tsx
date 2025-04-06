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

const cardData = [
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
  
];

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
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

function Features({ authors }: { authors: { name: string; avatar: string }[] }) {
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
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <Typography variant="caption">
        <BedIcon /> 2
        </Typography>
        <Typography variant="caption">
          <BathtubIcon/>2
        </Typography>
        <Typography variant="caption">
            <LocalFireDepartmentIcon />1
        </Typography>
      </Box>
    </Box>
  );
}

function Author({ authors }: { authors: { name: string; avatar: string }[] }) {
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
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <Typography variant="caption">
          <b>S$ 32,000.00</b>
        </Typography>
      </Box>
      <Typography variant="caption">6th Apr, 2025</Typography>
    </Box>
  );
}

export default function PropertyList() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null,
  );

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  // const handleClick = () => {
  //   console.info('You clicked the filter chip.');
  // };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(0)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[0].img}
              sx={{
                aspectRatio: '16 / 9',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[0].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[0].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[0].description}
              </StyledTypography>
            </SyledCardContent>
            <Features authors={cardData[0].authors} />
            <Author authors={cardData[0].authors} />
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(1)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[1].img}
              aspect-ratio="16 / 9"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[1].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[1].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[1].description}
              </StyledTypography>
            </SyledCardContent>
            <Features authors={cardData[0].authors} />
            <Author authors={cardData[1].authors} />
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(2)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
            sx={{ height: '100%' }}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[2].img}
              sx={{
                height: { sm: 'auto', md: '50%' },
                aspectRatio: { sm: '16 / 9', md: '' },
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[2].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[2].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[2].description}
              </StyledTypography>
            </SyledCardContent>
            <Features authors={cardData[0].authors} />
            <Author authors={cardData[2].authors} />
          </SyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SyledCard
            variant="outlined"
            onFocus={() => handleFocus(5)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 5 ? 'Mui-focused' : ''}
            sx={{ height: '100%' }} >
            <CardMedia
              component="img"
              alt="green iguana"
              image={cardData[5].img}
              sx={{
                height: { sm: 'auto', md: '50%' },
                aspectRatio: { sm: '16 / 9', md: '' },
              }}
            />
            <SyledCardContent>
              <Typography gutterBottom variant="caption" component="div">
                {cardData[5].tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {cardData[5].title}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {cardData[5].description}
              </StyledTypography>
            </SyledCardContent>
            <Features authors={cardData[0].authors} />
            <Author authors={cardData[5].authors} />
          </SyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}
