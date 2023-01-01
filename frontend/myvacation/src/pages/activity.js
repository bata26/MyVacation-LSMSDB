import * as React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import api from "../utility/api";
import ReviewForm from '../components/reviewForm';
import Button from '@mui/material/Button';
import {CardActions, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import DateRangePicker from "../components/datePicker";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';



const theme = createTheme();

const Activity = () => {
  const [activity, setActivity] = React.useState(null);
  const [reviews, setReviews] = React.useState(null);
  const [enableButton, setEnableButton] = React.useState(null);
  const [likedAdv, setLikedAdv] = React.useState(null);
  const [searchParams] = useSearchParams();
  const { activityID } = useParams();
  const [startDate, setStartDate] = React.useState(searchParams.get("startDate") === "" ? null : searchParams.get("startDate"))
  const [guests, setGuests] = React.useState(searchParams.get("guests") === "" ? null : searchParams.get("guests"))

  const navigate = useNavigate();

  React.useEffect(() => {
    api.get("/activities/" + activityID)
      .then(function (response) {
        setActivity(response.data);
        setReviews(response.data.reviews)
        console.log(response.data)
        console.log(response.data.reviews.length)
        console.log(parseInt(process.env.REACT_APP_REVIEWS_SIZE))
        if (response.data.reviews.length >= parseInt(process.env.REACT_APP_REVIEWS_SIZE))
          setEnableButton(true)
        else
          setEnableButton(false)
      })
      .catch(function (err) {
        console.log(err);
      })

    api.get("/users/liking/activity")
        .then(function (response) {
            if(response.data.includes(activityID))
                setLikedAdv(true)
            else
                setLikedAdv(false)
        })
        .catch(function (error) {
            console.log(error);
        });
  }, []);


  //Metodo per eliminare review
  const deleteReview = async (reviewID) => {
    await api.delete("/reviews/activity/" + activityID+ "/" + reviewID)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    window.location.reload(false);
  }

  //Metodo per eliminare activity
  const deleteActivity = (activityID) => {
    api.delete("/activities/" + activityID)
      .then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    navigate('/search')
  }

  const likeAdv = async (likedAdvID, likedAdvName) => {
      await api.post("/users/liking", {
          "likedAdvID" : likedAdvID,
          "likedAdvName" : likedAdvName,
          "destinationType" : "activity"
      }).then(function (response) {
          console.log(response.data);
          setLikedAdv(true)
      }).catch(function (error) {
          console.log(error);
      });
  }

  const unlikeAdv = async (unlikedAdvID, unlikedAdvName) => {
      await api.post("/users/unliking", {
          "unlikedAdvID" : unlikedAdvID,
          "unlikedAdvName" : unlikedAdvName,
          "destinationType" : "activity"
      }).then(function (response) {
          console.log(response.data);
          setLikedAdv(false)
      }).catch(function (error) {
              console.log(error);
      });
  }

  function goToCheckout() {
    navigate("/checkout?startDate=" + startDate + "&type=activities" + "&id=" + activity._id + "&guests=" + guests)
  }

  const getAllReviews = async () => {
    await api.get("/reviewsByDestination/" + activityID)
      .then(function (response) {
        setReviews(response.data)
        setEnableButton(false)
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (!activity) return null;

  return (
    ((activity && activity.approved) || (activity && !activity.approved && localStorage.getItem("userID") === activity.host_id) || localStorage.getItem("role") === "admin") ?
      (<ThemeProvider theme={theme}>
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
                  {activity.name}
                </Typography>
              </Container>
            </Box>
          </Box>
        </Container>

        {/* Immagine */}
        <Container maxWidth='lg'>
          <img
            src={`data:image/jpeg;base64,${activity.mainPicture}`}
            style={{ borderRadius: 10 + 'px', height: 100 + '%', width: 99 + '%', marginTop: 3 + 'px' }}
          />
        </Container>
        <Container maxWidth='lg'>
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
            {ReactHtmlParser(activity.description)}
          </Typography>


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
            {activity.price}€
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
            <b>Host</b>: {activity.host_name}
            <br />
            <b>Duration</b>: {activity.duration}H
            <br />
            <b>Address</b>: {activity.location.address}
            <br />
            <b>Country</b>: {activity.location.country}
            <br />
            <b>City</b>: {activity.location.city}
          </Typography>
          <Box sx={{ ml: 35, mb: 2 }}>
            <DateRangePicker startDate={startDate} />
          </Box>
          {startDate != null && localStorage.getItem("userID") != null && guests != null && activity.approved ?
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mb: 2 }}
              onClick={() => goToCheckout()}>
              Book activity
            </Button> : <></>}
          {(localStorage.getItem("userID") === activity.host_id || localStorage.getItem("role") === "admin") && activity.approved ?
            (<>
              <Button
                fullWidth
                variant="contained"
                color='error'
                sx={{ mt: 2 }}
                onClick={() => { deleteActivity(activity._id) }}
              >
                Delete Activity
              </Button>
              <Button
                fullWidth
                variant="contained"
                color='info'
                sx={{ mt: 2 }}
                onClick={() => { navigate("/edit/activity/" + activityID) }}
              >
                Update Activity
              </Button>
                {localStorage.getItem("userID") != null ?
                    (!likedAdv?
                            <ThumbUpAltIcon
                                variant="filled"
                                onClick={() => { likeAdv(activity._id, activity.name)}}
                            />
                            :
                            <ThumbUpOffAltIcon
                                variant="filled"
                                onClick={() => { unlikeAdv(activity._id, activity.name)}}
                            />
                    ) : <></>
                }
            </>) : <></>
          }
        </Container>
        <Box
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
          }}
        >
        </Box>
        {activity.approved ?
          (<>
            <ReviewForm destinationID={activity._id} destinationType={"activity"} />
            <Container maxWidth='lg'>
              <Typography
                component="h2"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
                sx={{ mt: 2 }}
              >
                Reviews
              </Typography>
              <Grid
                sx={{ overflowY: "scroll", maxHeight: "1160px" }}
              >
                {reviews && reviews.map((item) => (
                  <Card key={item._id} sx={{ maxHeight: 100, marginTop: 2 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.reviewer} - {item.score}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                        {localStorage.getItem("userID") && (localStorage.getItem("userID") === item.userID || localStorage.getItem("role") === "admin") ?
                            <Button color='error' onClick={() => {
                                deleteReview(item._id)
                            }}>Delete</Button> : <></>
                        }
                    </CardActions>
                  </Card>
                ))}
              </Grid>
              {enableButton ?
                <Container maxWidth='sm'>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => { getAllReviews() }}
                  >
                    More reviews
                  </Button>
                </Container> : <></>}
            </Container>
          </>) : <></>}
        <Box
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
          }}
        >
        </Box>
      </ThemeProvider>) : <></>
  );
};

export default Activity;