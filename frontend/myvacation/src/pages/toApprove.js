import * as React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ReactHtmlParser from 'react-html-parser';
import api from "../utility/api";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";



const theme = createTheme();

const ToApprove = () => {
    const [advertisement, setAdvertisement] = React.useState(null);
    const [searchParams] = useSearchParams();
    const { advertisementID } = useParams();
    const type = searchParams.get("type");
    const navigate = useNavigate();

    React.useEffect(() => {
        api.get("/admin/announcement/" + type + "/" + advertisementID)
            .then(function (response) {
                setAdvertisement(response.data);
            })
            .catch(function (error) {
                alert("Ops, something went wrong :(" + "\n" + error);
            });
    }, []);


    //Metodo per eliminare l'adv
    const notApproveAdvertisement = (advertisementID) => {
        api.delete("/admin/announcement/" + type + "/" + advertisementID)
            .then(function (response) {
                alert("The advertisement has not been approved");
                navigate('/admin')
            })
            .catch(function (error) {
                alert("Ops, something went wrong :(" + "\n" + error);
            });
    }

    const approveAdvertisement = (advertisementID) => {
        api.post("/admin/announcement/" + advertisementID, {"destinationType" : type , "destinationName" : advertisement.name})
            .then(function (response) {
                alert("The advertisement has been approved");
                navigate('/admin')
            })
            .catch(function (error) {
                alert("Ops, something went wrong :(" + "\n" + error);
            });
    }
    

    return (
        (advertisement && <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Box>
                    <Box
                        sx={{
                            pt: 8,
                            pb: 6,
                        }}
                    >
                        <Container maxWidth="xl">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                {advertisement.name}
                            </Typography>
                        </Container>
                    </Box>
                </Box>
            </Container>
            {/* Immagini */}
            <Container maxWidth='lg'>
                <ImageList
                    sx={{ width: 100 + '%', height: 99 + '%' }}
                    variant="quilted"
                    gap={5}
                    cols={3}
                    rowHeight={200}
                >
                    <ImageListItem key={advertisement.mainPicture} cols={2} rows={3}>
                        <img
                            src={`data:image/jpeg;base64,${advertisement.mainPicture}`}
                            style={{ borderRadius: 10 + 'px' }}
                        />
                    </ImageListItem>
                    {
                        type === "accommodation" ?
                            (advertisement.pictures.map((item) => (
                                <ImageListItem key={item}>
                                    <img
                                    src={`data:image/jpeg;base64,${item}`}
                                    style={{ borderRadius: 10 + 'px' }}
                                    />
                                </ImageListItem>
                            ))) : <></>
                    }
                </ImageList>
            </Container>
            <Container maxWidth='lg'>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Typography
                            component="h2"
                            variant="h4"
                            align="left"
                            color="text.primary"
                            gutterBottom
                            sx={{ mt: 2 }}
                        >
                            Description
                        </Typography>
                        <Typography
                            component="h2"
                            variant="h6"
                            align="left"
                            color="text.primary"
                        >
                            {ReactHtmlParser(advertisement.description)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            component="h3"
                            variant="h4"
                            align="right"
                            color="text.primary"
                            gutterBottom
                        >
                            Price
                        </Typography>
                        <Typography
                            align='right'
                            component="h3"
                            variant="h5"
                            color="text.primary"
                            sx={{ mb: 2 }}
                        >
                            {advertisement.price}€
                        </Typography>
                        <Typography
                            component="h3"
                            variant="h4"
                            align="right"
                            color="text.primary"
                            gutterBottom
                        >
                            Other information
                        </Typography>

                        <Typography align='right' sx={{ mb: 2 }}>
                            <b>Host</b>: {advertisement.hostName}
                            <br />
                        </Typography>
                        {type === "accommodation" ?
                            (<Typography align='right' sx={{ mb: 2 }}>
                                <b>Beds</b>: {advertisement.beds}
                                <br />
                                <b>Minimum nights</b>: {advertisement.minimum_nights}
                                <br />
                                <b>Guests</b>: {advertisement.guests}
                                <br />
                                <b>Bedrooms</b>: {advertisement.bedrooms}
                            </Typography>) :
                            (<Typography align='right' sx={{ mb: 2 }}>
                                <b>Duration</b>: {advertisement.duration}
                            </Typography>)
                        }
                        <Typography align='right' sx={{ mb: 2 }}>
                            <br />
                            <b>Country</b>: {advertisement.location.country}
                            <br />
                            <b>City</b>: {advertisement.location.city}
                            <br />
                            <b>Address</b>: {advertisement.location.address}
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2 }}
                            onClick={() => approveAdvertisement(advertisementID)}
                        >
                            Approve
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color='error'
                            sx={{ mt: 2 }}
                            onClick={() => { notApproveAdvertisement(advertisementID) }}
                        >
                            Not Approve
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            <Box
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                }}
            >
            </Box>
            <Box
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                }}
            >
            </Box>
        </ThemeProvider>)
    );
};

export default ToApprove;