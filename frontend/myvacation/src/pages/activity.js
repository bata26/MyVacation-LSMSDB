import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useParams , useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Config from '../utility/config';
import ReactHtmlParser from 'react-html-parser';
import { borderRadius } from '@mui/system';
import ReactRoundedImage from "react-rounded-image";
import Separator from "../components/separator";
import ActivityStaticDatePicker from "../components/staticDatePicker";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const Activity = () => {
  const [activity , setActivity] = React.useState(null);
  const [searchParams] = useSearchParams();
  const {activityID} = useParams();
  const date = searchParams.get("date");

  React.useEffect( () =>{
    const url = Config.BASE_URL+"/activities/"+activityID;
    axios.get(url)
      .then(function (response){
        setActivity(response.data);
      })
      .catch(function(err){
        console.log(err);
      })
  } , []);

  if(!activity) return null;
  
  return (
    <Grid container spacing={2}>
      <Grid xs={1}/>
      <Grid xs={10} >
        <img
              src={`data:image/jpeg;base64,${activity.picture}`}
              style={{borderRadius:10 + 'px', height: 100+'%' , width: 99+'%', marginTop: 3+'px'}}
            />
      </Grid>
      <Grid xs={1}/>
      {/** ROW 1 */}
      <Grid xs={2}/>
      <Grid xs={4}>
        <h1>{activity.category}</h1>
      </Grid>
      <Grid xs={1}/>
      <Grid xs={3}>
        <h2>Host: <i>{activity.host_name}</i></h2>
      </Grid>
      <Grid xs={2}/>

      {/** ROW 2 */}
      <Grid xs={2}/>
      <Grid xs={4}>
        <span><strong>{activity.property_type}</strong></span>
        <br></br>
        <br></br>
        <span>{ReactHtmlParser(activity.description)}</span>
      </Grid>
      
      <Grid xs={4}  style={{ borderRadius:10+'px', boxShadow:'1px 2px 9px #8a8987'}}>
        <ActivityStaticDatePicker    
            disabled
            pickedValue={date}
            style = {{gridRow:"span 2"}}
        />
        {/*<ReactRoundedImage
          image={`data:image/jpeg;base64,${activity.host_picture}`}
          roundedColor="#fff"
          imageWidth="150"
          imageHeight="150"
          roundedSize="8"
          borderRadius="50"
          hoverColor="#DD1144"
          style={{Cursor:'pointer'}}
          />
        <DateRangePicker startDate={startDate} endDate={endDate}/>
        */}
      </Grid>
      <Grid xs={1}/>

      {/** ROW 3 */}
      <Grid xs={2}/>
      <Grid xs={4}>
        <Separator />
      </Grid>
      <Grid xs={4}>
        <Separator />
      </Grid>
      <Grid xs={2}/>

      {/** ROW 4 */}
      <Grid xs={2}/>
      <Grid xs={4}>
            <h3>Informazioni</h3>
      </Grid>
      <Grid xs={6}/>

      {/** ROW 5 */}
      <Grid xs={2}/>
      <Grid xs={2}>
        <span>{activity.duration} <strong>ore di puro divertimento</strong></span>
      </Grid>
      <Grid xs={2}>
        <span>{activity.pricePerPerson} <strong>€ a persona</strong></span>
      </Grid>
      <Grid xs={6}/>

      {/** ROW 8 */}
      <Grid xs={2}/>
      <Grid xs={4}>
        <Separator />
      </Grid>
      <Grid xs={6}/>


      {/** ROW 4 */}
      <Grid xs={2}/>
      <Grid xs={4}>
            <h3>Posizione</h3>
      </Grid>
      <Grid xs={6}/>

      {/** ROW 5 */}
      <Grid xs={2}/>
      <Grid xs={4}>
            <span><strong>Indirizzo:</strong></span>
            <span>{activity.location.address}</span>
      </Grid>
      <Grid xs={6}/>

      {/** ROW 6 */}
      <Grid xs={2}/>
      <Grid xs={4}>
            <span><strong>Città: </strong></span>
            <span>{activity.location.city}</span>
      </Grid>
      <Grid xs={6}/>

      {/** ROW 7 */}
      <Grid xs={2}/>
      <Grid xs={4}>
            <span><strong>Nazione:</strong></span>
            <span>{activity.location.country}</span>
      </Grid>
      <Grid xs={6}/>

      {/** ROW 8 */}
      <Grid xs={2}/>
      <Grid xs={4}>
        <Separator />
      </Grid>
      <Grid xs={6}/>
          
    </Grid>
  );
};

export default Activity;