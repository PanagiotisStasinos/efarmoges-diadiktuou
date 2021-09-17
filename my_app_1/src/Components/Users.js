import React from 'react';
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../css/users.css';
import {jstest} from '../js/users';
import {addRow} from '../js/users';
import {pagination} from '../js/users';
import {request} from '../js/users';
import Table from 'react-bootstrap/Table';
import { Container, Pagination, Card, Button, Spinner, ButtonGroup} from 'react-bootstrap';
import UserDetails from './UserDetails';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';



async function getVerifiedUsers(page) {

    var page_number = page.toString()

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_users', {
        method: 'POST',
        body: JSON.stringify({
            page_number: page_number,
            number_of_users_per_page: "10",
            Verified: "Yes",
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })
    // .then(response => response.json())
    //     .then(response => (console.log(response)));


    var data = await response.json();
    return data;
};

async function getUnverifiedUsers(page) {

    var page_number = page.toString();

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_users', {
        method: 'POST',
        body: JSON.stringify({
            page_number: page_number,
            number_of_users_per_page: "10",
            Verified: "No",
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })
    // .then(response => response.json())
    //     .then(response => (console.log(response)));


    var data = await response.json();
    return data;

};


export class Users extends React.Component{

    constructor(props){
        super(props);

        this.state={
            users: '',
            total: null,
            per_page:5,
            current_page:1,

            usersDataset: '',
            UsersArray: [],

            buttons: [
                {name: "first", isActive: true},
                {name: "second", isActive: false},
                {name: "third", isActive: false}

            ],


            /* Pagination */
            firstPage:1,
            secondPage:2,
            thirdPage:3,

            firstActive: true,
            secondActive: false,
            thirdActive: false, 


            /* Loading Page... */
            loading: true,

            /* Users categories buttons */
            active1: 'primary',
            active2: 'secondary'
        }
    }



    componentDidMount() {
        getVerifiedUsers(1).then(data => {
            this.setState({ usersDataset: data })

            this.Users();
            this.setState({ loading: false });
        });
    }

    Unverified_Users = () =>{
        getUnverifiedUsers(1).then(data => {
            this.setState({ usersDataset: data })

            /* render Users */
            this.Users();
            this.setState({ loading: false });
        });
    }

    Users() {

        var Rows = [];
        var ArrayLength = 0;
        var users = this.state.usersDataset.items;
        ArrayLength = users.length;
        var verifiedValue;

        for (let i = 0; i < ArrayLength; i++) {   

            if(this.state.usersDataset.items[i].verified === "false"){
                verifiedValue = <Link to={{ pathname: "/admin/users/" + this.state.usersDataset.items[i].username, state: { username: this.state.usersDataset.items[i].username } }} >
                                    <Button variant='warning'> Verify </Button>
                                </Link>
            }else{
                verifiedValue = <Button variant='success' disabled> Verified </Button>
            }

            Rows.push(
                <tr key={this.state.usersDataset.items[i].username}>
                    <td>{this.state.usersDataset.items[i].username}</td>
                    <td>{(this.state.usersDataset.items[i].first_name) !== "null" ? (this.state.usersDataset.items[i].first_name) : "No value"}</td>
                    <td>{(this.state.usersDataset.items[i].Country) !== "null" ? (this.state.usersDataset.items[i].Country) : "No value" }</td>
                    <td>{(this.state.usersDataset.items[i].Location) !== "null" ? (this.state.usersDataset.items[i].Location) : "No value"}</td>
                    <td>{verifiedValue}</td>
                    <td>{this.mybuttons(this.state.usersDataset.items[i].username)}</td>
                </tr>
            );
        }
        this.setState({UsersArray: Rows})
    }

    
    /* Pagination */
    currentPage = (page) =>{
        this.setState({buttons: [
            {name: "first", isActive: false}]})
    }

    updateUsers = (pagenumber) => {
        var tempusers = "users" + pagenumber;
        var array = eval(tempusers);

        this.setState({
            users: array,
        });
    }

    updateFoo = (page) =>{
        if(page === 1){
            this.setState({firstActive: true}); this.setState({ secondActive: false }); this.setState({ thirdActive: false });

        }else if(page === 2){
            this.setState({ firstActive: false }); this.setState({ secondActive: true }); this.setState({ thirdActive: false });
            this.setState({ firstPage: this.state.secondPage })
            this.setState({ secondPage: this.state.thirdPage})
            this.setState({ thirdPage: this.state.thirdPage + 1 })

        }else if (page ===3){
            this.setState({ firstActive: false }); this.setState({ secondActive: false }); this.setState({ thirdActive: true });

        }

        this.updateUsers(page);
    }

    mybuttons = (username) => {
        return (<div>

            <Link to={{ pathname: "/admin/users/" + username, state: { username: username } }} >

            <button  className='btn' id='info-user-button'>
                <i  className='fas fa-info-circle' id='details-user-icon'>
                    <span className='detailsusertext'>User Details</span>
                </i>
            </button>
            </Link>

            {/* <button className='btn' id='edit-user-button'>
                <i className='fas fa-user-edit' id='edit-user-icon'>
                    <span className='editusertext'>Edit User</span>
                </i>
            </button>
            <button className='btn' id='delete-user-button'>
                <i className='fas fa-trash-alt' id='delete-user-icon'>
                    <span className='deleteusertext'>Delete User</span>
                </i>
            </button> */}
        </div>);
    }



    getNewPage = (pageNumber) => {
        getVerifiedUsers(pageNumber).then(data => {
            this.setState({ usersDataset: data, UsersArray: [] });
            this.Users();
            this.setState({ loading: false });
            
            /* Scroll to the top */
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        });
    }

    /* Pagination */
    updatePageNumbers = (button, page) => {

        if (button === 2) {
            this.setState({ firstPage: this.state.secondPage });
            this.setState({ secondPage: this.state.thirdPage });
            this.setState({ thirdPage: this.state.thirdPage + 1 });
        } else if (button === 3) {
            this.setState({ firstPage: this.state.thirdPage });
            this.setState({ secondPage: this.state.thirdPage + 1 });
            this.setState({ thirdPage: this.state.thirdPage + 2 });
        }
    }

    prevPage = () => {
        this.setState({ thirdPage: this.state.secondPage });
        this.setState({ secondPage: this.state.firstPage });
        this.setState({ firstPage: this.state.firstPage - 1 });
    }

    nextPage = () => {
        this.setState({ firstPage: this.state.secondPage });
        this.setState({ secondPage: this.state.thirdPage });
        this.setState({ thirdPage: this.state.thirdPage + 1 });
    }
 




    render() {
        return (
            <div>
                <ButtonGroup aria-label="Basic example" style={{position: 'relative', left: '40%', marginBottom: '2em'}}>
                    <Button variant={this.state.active1} onClick={() => {this.getNewPage(1); this.setState({active1: 'primary', active2: 'secondary'}) }}> Verified Users</Button>
                    <Button variant={this.state.active2} onClick={() => { this.Unverified_Users(); this.setState({ active1: 'secondary', active2: 'primary' })}} >Unverified Users</Button>
                </ButtonGroup>



                <Container style={{ 'backgroundColor': 'white', position: 'relative', border: '1px solid #191970', borderRadius: '20px'}} >
                <h4 style={{paddingTop: '0%', textAlign: 'center'}}> Users </h4>
                
                <Table className="users-table" striped bordered hover variant="light" >

                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Country</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.UsersArray}
                    </tbody>

                </Table>



                {this.state.loading === true ? <Spinner animation="border" variant="dark" style={{ position: 'absolute', left: '50%' }} /> : (
                    
                    <div>
                    {(this.state.usersDataset.items.length >= 10)?
                    (<Card.Footer style={{ height: '3.5em', marginTop: '0em' }}>

                        <Pagination className="usersPagination">
                            <Pagination.Prev className={this.state.firstPage === 1 ? "disabled" : ""} onClick={() => { this.prevPage(); this.getNewPage(this.state.firstPage - 1) }} />

                            <Pagination.Item onClick={() => this.updatePageNumbers(1, this.state.firstPage)} className={this.state.firstActive === true ? "active" : ""}> {this.state.firstPage} </Pagination.Item>
                            <Pagination.Item onClick={() => {this.updatePageNumbers(2, this.state.secondPage); this.getNewPage(this.state.firstPage + 1);} } className={this.state.secondActive === true ? "active" : ""}> {this.state.secondPage} </Pagination.Item>
                            <Pagination.Item onClick={() => {this.updatePageNumbers(3, this.state.thirdPage); this.getNewPage(this.state.firstPage + 2);} } className={this.state.thirdActive === true ? "active" : ""}> {this.state.thirdPage} </Pagination.Item>

                            <Pagination.Next onClick={() => { this.nextPage(); this.getNewPage(this.state.firstPage + 1) }} />
                        </Pagination>
                    </Card.Footer>):
                        <div>
                            {(this.state.usersDataset.items.length === 0) ? <h5 style={{textAlign: 'center'}}>No unverified users.</h5>:null}
                        </div>
                    }
                    </div>
                
                )}

            </Container>
        </div>);
    }
}


function UsersTable() {
    return (<div>

            <Router>
                <Route exact path='/users' component={Users} />
                <Route path="/users/:user" component={UserDetails} />
                <Route exact path="/admin" component={Users} />
                <Route exact path="/admin/users/" component={Users} />
                <Route path="/admin/users/:user" component={UserDetails} />
            </Router>
            
    </div>);
}

export default UsersTable;