import React from 'react';
import circlelogo from '../img/circlelogo1.png'
import { Button, Nav, Navbar, InputGroup, Form, Container, Dropdown, Modal} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

import '../css/MyNavbar.css';

const badgeStyle = {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    padding: '5px 10px',
    borderRadius: '50%',
    backgroundColor: '#E80000',
    color: 'white'
};

const inBadgeStyle = {
    position: 'absolute',
    top: '8px',
    right: '5px',
    borderRadius: '50%',
    backgroundColor: '#E80000',
    color: 'white'
};

function UserMenu(props){
    
    return(<div>
        <Dropdown>

            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{position: 'relative'}}>

                {/* My account */}
                {props.username}
                
                {localStorage.getItem('unread') !== null && localStorage.getItem('unread') !== '0'?
                    <span className="badge" style={badgeStyle} > {localStorage.getItem('unread')} </span>:null}
             
             </Dropdown.Toggle>

            <Dropdown.Menu  className="dropdown-menu dropdown-menu-right" style={{ right: '0em'  }}>

                <Dropdown.Item href={'/inbox'} style={{  position: 'relative' }} > Inbox
                    {localStorage.getItem('unread') !== null && localStorage.getItem('unread') !== '0' ?
                        <span className="badge" style={inBadgeStyle} > {localStorage.getItem('unread')} </span> : null}
                    
                </Dropdown.Item>       
                <Dropdown.Item href={'/outbox'}>Outbox</Dropdown.Item>
                <Dropdown.Item href={'/sendmsg'}>Send message</Dropdown.Item>
                <Dropdown.Divider />

                <Dropdown.Item href={'/myItems'}>My auctions</Dropdown.Item>
                <Dropdown.Item href={'/auctionform'}>Sell item</Dropdown.Item>
                <Dropdown.Divider />

                <Dropdown.Item onClick={logout} href="/">Log out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>);
}


function GuestMenu() {
    return(<div>
        <ul className="nav navbar-nav navbar-right" style={{ "marginRight": '1em' }}>
            <li style={{ "marginRight": '15px' }}><a style={{ color: 'black' }} href={"/signup"}><span className="fas fa-sign-in-alt"></span> Sign up</a>
            </li>
            <li><a style={{ color: 'black' }} href={"/login"}><span className="fa fa-user"></span> Login</a></li>
        </ul>
    </div>);
};

function logout(){
    localStorage.clear();
};

function UserLoggedIn(props){
    var isLoggedIn = localStorage.getItem('user');
    
    if(isLoggedIn !== null){
        return (<UserMenu username={isLoggedIn} messages={props.unread} /> );
    }else{
        return (<GuestMenu />);
    }

};


async function getData() {

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/search', {
        method: 'POST',
        body: JSON.stringify({
            "Name": "",
            "upper_category": "",
            "level": "0",
            "Category": "Collectibles",
            "Max_Price": "100",
            "Min_Price": "0",
            "Description": "",
            "number_of_page": "1",
            "number_of_items": "10",
            "Location": "",
            "Longitude": "",
            "Latitude": "",
            "Country": ""
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    }).then(response => response.json())
        .then(response => (console.log(response)));


};

async function getUnreadMessages() {

    var username = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/GetNumberOfUnreadMessages', {
        method: 'POST',
        body: JSON.stringify({
            "_UserID": username,
            token:tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });
    
    var data = await response.json();
    return data;
};



class MyNavbar extends React.Component {

    constructor(props){
        super(props);

        /* Search  */
        this.searchCategory = React.createRef();
        this.searchText = React.createRef();

        this.state={
            searchRequest: false, 
            userLoggedIn: false,
            unreadMessages: '-1',

            /* Modal */
            show: false
        }
    }

    searchFun = (categ, searchText) => {

        let path = '/s/'+ categ.value +"/"+searchText.value;
        this.props.history.push({ pathname: path, state: { category: categ.value, searchText: searchText.value } });  /* TESTING TESTING TESTING */
    }

    search = () =>{

        var category = this.searchCategory.current;
        var searchTxt = this.searchText.current;
        
        /* Check if text is empty */
        if(searchTxt.value === ""){
            this.handleShow();
            return;
        }

        if(category === null){
            console.log("category is null");
        }else{
            this.searchFun(category, searchTxt);
        }

    }
    

    componentDidMount(){
        var unread = this.state.unreadMessages;
        UserLoggedIn(unread);
        this.inboxStatus();
    }

    /* We want to know the inbox status at all times */
    componentDidUpdate(){
        var unread = this.state.unreadMessages;
        UserLoggedIn(unread);
        this.inboxStatus();
    }

    inboxStatus(){

        var username = localStorage.getItem('unread');

        /* Check if there is a user logged in */
        if(username !== null){            
            getUnreadMessages().then(data => {
                if ((data.n).toString() !== localStorage.getItem('unread') ) {
                    var n = (data.n).toString();
                    localStorage.setItem('unread', n);
                    this.setState({unreadMessages: n});
                }
            });
        }
    }

    /* Submit - Modal*/
    handleClose = () => {
        this.setState({
            show: false,
        });
    }
    handleShow = () => {
        this.setState({
            show: true,
        });
    }



    render() {
        return(
            <div className="MyNav">

                <Nav className="navbar navbar-light bg-light">
                    <Navbar.Brand href={"/"}>
                        <img className="d-inline-block align-top ebaypic" src={circlelogo} width="30" height="30" alt="" />
                    </Navbar.Brand>

                    {/* Search */}
                    <InputGroup  className="input-group mb-1 border rounded-pill p-1 bg-white" 
                        style={{  height: '3em', width: '60em', position: 'relative' }}>

                        <Form.Control  ref={this.searchText} style={{ 'marginRight':'0.2em'}} className="form-control bg-none border-0" type="search" placeholder="What're you looking for?" aria-describedby="button-addon3" />

                        <Form.Group controlId="Form.ControlSelect" style={{ 'marginRight': '1em' , width:'12em'}}>
                            <Form.Control ref={this.searchCategory} as="select" style={{ 'padding': '0em' }}>

                                <option>Collectibles</option>
                                <option>Movies & Television</option>
                                <option>Clothing & Accessories</option>
                                <option>Computers</option>
                                <option>Pottery & Glass</option>
                                <option>Stamps</option>
                                <option>Consumer Electronics</option>
                                <option> Music </option>

                            </Form.Control>
                        </Form.Group>

                        <InputGroup.Append className="input-group-append border-0" style={{height:'100%'}}>
                            <Button  onClick={this.search} id="button-addon3" style={{ "backgroundColor": 'white', "borderRadius": '20px', "border": '0px solid black',  }} className="btn btn-link text-success" type="button"><i className="fas fa-search"
                                style={{ color: 'black' }}></i></Button>
                        </InputGroup.Append>

                    </InputGroup>

                    <a href='/advancedsearch'>
                        <p style={{ color: 'white', possition:'relative' , marginLeft: '0px' ,right: '2%', bottom: '-40px', width: '5%', marginTop: 0, fontSize: '13px' }}>
                            Advanced Search
                        </p>
                    </a>

                    {/*Check if user is logged in*/}                    
                    <UserLoggedIn unread={this.state.unreadMessages} />

                </Nav>

                <Navbar expand="lg" className="Menu">
                    <Container className="navbarMenu">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navmenu-collapse" style={{ position: 'relative', left: '43%' , border: '3px solid', color:'midnightblue', backgroundColor: 'white'}}>Menu</Navbar.Toggle>

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto" >

                                <Nav.Link href={"/cards/Collectibles"}><b>Collectibles</b></Nav.Link>
                                
                                <Nav.Link href={"/cards/Movies & Television"}><b>Movies & Television</b></Nav.Link>
                                
                                <Nav.Link href={"/cards/Clothing & Accessories"}><b>Clothing & Accessories</b></Nav.Link>
                                
                                <Nav.Link href={"/cards/Computers"}><b>Computers</b></Nav.Link>

                                <Nav.Link href={"/cards/Pottery & Glass"}><b>Pottery & Glass</b></Nav.Link>
                                
                                <Nav.Link href={"/cards/Stamps"}><b>Stamps</b></Nav.Link>

                                <Nav.Link href={"/cards/Consumer Electronics"}><b>Consumer Electronics</b></Nav.Link>

                                <Nav.Link href={"/cards/Music"}><b>Music</b></Nav.Link>


                            </Nav>

                        </Navbar.Collapse>

                        <Modal size="sm" show={this.state.show} onHide={this.handleClose}>
                            <div>
                                <Modal.Header closeButton>
                                    <Modal.Title><h5 style={{ color: 'black' }} > Please type a search term first. <i className="fas fa-exclamation"></i> </h5></Modal.Title>
                                </Modal.Header>
                            </div>
                        </Modal>

                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(MyNavbar);