import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from "../assets/logo-main.png";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://www.aut.ac.nz/study/study-options/engineering-computer-and-mathematical-sciences/courses/master-of-computer-and-information-sciences">
        AUT Cloud Computing - Team 15
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

function Authors() {
  return <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
    Authors: Thant Sin Lin, Khine Zar Thwe, Khin Kin Maw, Myo Soe Kyi
  </Typography>
}

export default function Footer() {
  return (
    <React.Fragment>

      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 4, sm: 8 },
          // py: { xs: 8, sm: 10 },
          textAlign: { sm: 'center', md: 'left' },
        }}
      >

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            //pt: { xs: 4, sm: 8 },
            width: '100%',
          }}
        >
          <img src={logo} alt="Logo" className="logo" style={{ height: 100, marginRight: 20 }} />

          <div style={{ flex: 1, alignContent: 'center' }}>
            {/* <Link color="text.secondary" variant="body2" href="#">
              Privacy Policy
            </Link>
            <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
              &nbsp;•&nbsp;
            </Typography>
            <Link color="text.secondary" variant="body2" href="#">
              Terms of Service
            </Link> */}
            <Copyright />
            <Authors />
          </div>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ justifyContent: 'left', color: 'text.secondary' }}
          >
            <IconButton
              color="inherit"
              size="small"
              target='blank'
              href="https://github.com/tslin89/NZParadiseClient"
              aria-label="GitHub"
              sx={{ alignSelf: 'center' }}
            >
              <GitHubIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
}
