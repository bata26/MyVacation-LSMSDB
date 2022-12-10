import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { alignProperty } from '@mui/material/styles/cssUtils';
import api from "../api/api";

//export default function HalfRating() {
//  return (
//    <Stack spacing={1}>
//      <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
//      <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
//    </Stack>
//  );
//}



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const ReviewForm = ({destinationID}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = async () => {
    console.log("aspett");
    await api.get("/review/check/"+destinationID)
    .then(function(response){
      if(response.data.result === true){
        setOpen(true);
      }else{
        alert("E' possibile recensire solo un annuncio che si è prenotato");
      }
    })
    .catch(function(error){
        console.log("Errore: ",  error);
        return false;
    });
  }
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("ci sonoooo");
    const data = new FormData(event.currentTarget);
    console.log(data);
    const review = {
      "destinationID" : destinationID,
      "userID" : "637ce1a04ed62608566c5fae",
      "score" : data.get("rating"),
      "description" : data.get("description")
    }

    api.put("/reviews" , review)
    .then(function(response){
      if(response.status === 200) alert("Recensione inserita con successo");
      setOpen(false);
    })  
    .catch(function(error){
      alert("impossibile inserire la recensione, riprova più tardi");
    })
  }

  return (
    <div>
      <Button variant="outlined" style={{width:100+'%'}} onClick={handleOpen}>Lascia una recensione</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <form onSubmit={handleSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Lascia una recensione
          </Typography>
          <Rating name="rating" defaultValue={2.5} precision={0.5} />
          <TextField
                margin="normal"
                fullWidth
                name="description"
                label="descrizione"
                type="description"
                id="description"
                autoFocus
                />
            <Button variant="outlined" type = "submit" style={{width:100+'%'}} >conferma</Button>
            </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ReviewForm;