import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import api from "../../utility/api";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Moment from "moment";
import { Container } from '@mui/system';



export default function UsersList() {
    const [last_id, setLast_id] = React.useState(null);
    const [first_id, setFirst_id] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const navigate = useNavigate();
    const [userList, setUserList] = React.useState(null);
    const [name, setName] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [id, setId] = React.useState("");
    const [lastPage, setLastPage] = React.useState(null);


    React.useEffect(() => {
        console.log("env: ", process.env.REACT_APP_ADMIN_PAGE_SIZE);
        api.get("/users?index=")
            .then(function (response) {
                console.log(response.data);
                setUserList(response.data);
                setLast_id(response.data[response.data.length - 1]._id);
                setFirst_id(response.data[0]._id);
                console.log(response);
                if (response.data.length === parseInt(process.env.REACT_APP_ADMIN_PAGE_SIZE))
                    setLastPage(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        const data = new FormData(event.currentTarget);
        console.log({
            userId: data.get('userId'),
            name: data.get('name'),
            surname: data.get('surname')
        });
        const name = data.get('name');
        const surname = data.get('surname');
        const id = data.get('userId');

        const url = "?id=" + id + "&name=" + name + "&surname=" + surname + "&index=";

        console.log(url);
        api.get("/users" + url)
            .then(function (response) {
                if (response && response.data.length > 0) {
                    setUserList(response.data);
                    setLast_id(response.data[response.data.length - 1]._id);
                    setFirst_id(response.data[0]._id);
                    console.log(response.data);
                    setLastPage(false)
                }
                else{
                    setLastPage(true)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handlePreviousPage = () => {
        setPage(page - 1)
        const url = "?id=" + id + "&name=" + name + "&surname=" + surname + "&index=" + first_id + "&direction=previous";
        console.log(url);
        api.get("/users" + url)
            .then(function (response) {
                setUserList(response.data);
                setLastPage(false)
                if (response && response.data.length > 0) {
                    setLast_id(response.data[0]._id);
                    setFirst_id(response.data[response.data.length - 1]._id);
                }
                console.log(response.data);
                console.log(first_id)
                console.log(last_id)
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleNextPage = () => {
        const url = "?id=" + id + "&name=" + name + "&surname=" + surname + "&index=" + last_id + "&direction=next";
        console.log(url);
        api.get("/users" + url)
            .then(function (response) {
                if (response && response.data.length > 0) {
                    setLast_id(response.data[response.data.length - 1]._id);
                    setFirst_id(response.data[0]._id);
                    setUserList(response.data);
                    setPage(page + 1);
                }
                else {
                    setLastPage(true)
                }
                console.log(response.data);
                console.log(first_id)
                console.log(last_id)
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    const handleFirstPage = () => {
        setPage(1);
        const url = "?id=" + id + "&name=" + name + "&surname=" + surname + "&index=";

        console.log(url);
        api.get("/users" + url)
            .then(function (response) {
                setUserList(response.data);
                setLast_id(response.data[response.data.length - 1]._id);
                setFirst_id(0);
                console.log(response.data);
                setLastPage(false)
            })
            .catch(function (error) {
                console.log(error);
                console.log(first_id)
                console.log(last_id)
            });

    };

    const emptyRows =
        page > 1 ? Math.max(0, 2 - userList ? userList.length : 0) : 0;

    return (

        <TableContainer component={Paper}>
            <Container>
                <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 3 }}>
                    <Grid container columnSpacing={1.4}>
                        <Grid item sm={4}>
                            <TextField
                                fullWidth
                                id="userId"
                                name="userId"
                                label="ID"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Name"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                fullWidth
                                id="surname"
                                name="surname"
                                label="Surname"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Search
                    </Button>
                </Box>
            </Container>
            <Table sx={{ minWidth: 500 }} size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align="left" style={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Surname</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Date Of Birth</TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userList && userList.map((item) => (
                        <TableRow key={item._id} onClick={() => { navigate("/profile?userId=" + item._id) }} style={{ cursor: "pointer" }}>
                            <TableCell align='left'>{item._id}</TableCell>
                            <TableCell align='center'>{item.name}</TableCell>
                            <TableCell align='center'>{item.surname}</TableCell>
                            <TableCell align='center'>{Moment(item.dateOfBirth).utc().format('MMM DD YYYY')}</TableCell>
                            <TableCell align='right'>{Moment(item.registrationDate).utc().format('MMM DD YYYY')}</TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Bottoni pagine */}
            <Container>
                <Grid container columnSpacing={1.4}>
                    <Grid item xs={4} sm={4}>
                        {page !== 1 ?
                            <Button
                                type="submit"
                                fullWidth
                                variant='outlined'
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => { handlePreviousPage() }}>Previous Page</Button> : <></>}
                    </Grid>

                    <Grid item xs={4} sm={4}>
                        {lastPage != null && !lastPage ?
                            <Button
                                type="submit"
                                fullWidth
                                variant='outlined'
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => { handleNextPage() }}>Next Page</Button> : <></>}
                    </Grid>

                    <Grid item xs={4} sm={4}>
                        {page !== 1 ?
                            <Button
                                type="submit"
                                fullWidth
                                variant='outlined'
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => { handleFirstPage() }}>First Page</Button> : <></>}
                    </Grid>
                </Grid>

            </Container>

        </TableContainer>
    );
}