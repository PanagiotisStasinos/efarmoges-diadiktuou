import React from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs, Spinner, Modal} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter  } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import MyMap from './MyMap';

import laptoppic from '../img/laptop.jpg';
import noimage from '../img/noimage2.png'


/* Get the details of the Item */
async function getItem(ItemID) {

    var user = localStorage.getItem('user');
    var tok = localStorage.getItem('token');
    
    if(user === null){
        user = "null";
        tok="null";
    }

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_item', {
        method: 'POST',
        body: JSON.stringify({
            ItemID: ItemID,
            username: user,
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })


    var data = await response.json();
    return data;

};



async function sendNewBid(username, ItemID, amount) {

    var tok = localStorage.getItem("token");

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/insert_bid', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            token: tok,

            ItemID: ItemID,
            amount: amount.toString()
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });

    var data = await response.json();
    return data;

};






class Item extends React.Component {

    constructor(props){
        super(props);
        this.newBid = React.createRef();

        this.state={
            /* Logged in user */
            user: localStorage.getItem('user'),

            input: props.location.state,
            item: '',

            loading: true,
            
            /* Modal */
            show: false,
            newBidValidation: true,

            showBid: false
        }
    }

    /* Place Bid - Modal */
    handleClose = () => {
        this.setState({
            show: false,
            newBidValidation: true
        });
    }
    handleShow = () => {
        this.setState({
            show: true,
        });
    }

    /* BID */
    handleCloseBid = () => {
        this.setState({
            showBid: false,
            newBidValidation: true
        });
    }
    handleShowBid = () => {
        this.setState({
            showBid: true,
        });
    }

    componentDidMount() {

        getItem(this.state.input.Id).then(data => {
            this.setState({ item: data });

            document.title = this.state.item.Name;
            this.setState({loading:false})
        });

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });

    }

    redirectGuest = () =>{
        this.props.history.push('/login');
    }

    /* Modal */
    launchModal = () => {
        this.setState({newBidValidation:false});
    }

    closeModal = () => {
        this.setState({ newBidValidation: true });
    }


    /* Place Bid */
    placeBid = (username, ItemID, amount) => {

        sendNewBid(username, ItemID, amount).then(data => {

            /* Check if session has expired */
            if ((data.hasOwnProperty('error'))) {
                alert("Your session has expired!");
                localStorage.clear();
                this.props.history.push('/login');

            } else {
                window.location.reload();
            }
        });
    };



    render() {

        return (<div>
        <MyNavbar/>   

        {this.state.loading === true ? <Spinner animation="border" variant="dark" style={{ position: 'absolute', left: '50%' }} />:
        
        <Container style={{backgroundColor: '#F5F5F5'}}>
            <Row style={{'backgroundColor':'#F5F5F5'}}>

                <Col style={{ 'backgroundColor': '#F5F5F5' ,'paddingRight':'0%'}}>
                    <Card style={{ width: '33rem', height: '25rem' ,'padding':'0%'}} >
                        <Card.Img variant="top" src={noimage} />
                    </Card>
                </Col>

                <Col style={{ 'paddingLeft': '2%' }}>

                    <Card style={{ width: '34rem', height: '29rem','backgroundColor': 'white'}}>

                        <Card.Body style={{ 'paddingRight': '0%'}}>
                            <Card.Title>{this.state.item.Name}</Card.Title> <hr/>
                            
                            {(new Date(this.state.item.Ends) > new Date()) ?
                            <div>
                                <Card.Text>
                                    <div>
                                        <b>Auction Ends:</b>  {this.state.item.Ends}
                                    </div>
                                </Card.Text>

                                <div className='bidsClass'>
                                    <Row>
                                        <Col>
                                            <Card.Text>
                                                <b>Current Bid</b>: {this.state.item.Currently}
                                            </Card.Text>
                                        </Col>
                                        <Col>
                                            <Card.Text>
                                                {/* Bids: [<Card.Link href="#">{this.state.item.Number_of_Bids}</Card.Link>] */}
                                                Bids: {this.state.item.Number_of_Bids}
            
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </div>
                            
                                <br/><br/>
                                <Form>
                                    <Form.Row s>
                                        <Col>
                                            <Form.Control  ref={this.newBid} placeholder="New Bid" type='number'/>

                                                <Form.Text className="text-muted">
                                                    You have to bid more than {(this.state.item.Currently).substr(1)}$. {/* Testing => Next bid price? */}
                                                </Form.Text>
                                        </Col>



                                        <Col >


                                            <Button onClick={() => { 
                                                if(localStorage.getItem('user') !== null){
                                                    if ((Number(this.newBid.current.value) > Number((this.state.item.Currently).substr(1)))) {

                                                        this.handleShowBid();
                                                    } else { this.handleShow(); this.launchModal(); }  

                                                }else{
                                                    this.props.history.push('/login');

                                                }

                                                
                                                }} variant="primary" block>
                                            Place Bid </Button>

                                            {/* <Button onClick={() => { ( (Number(this.newBid.current.value) > Number((this.state.item.Currently).substr(1)))) 
                                                ? alert(Number((this.state.item.Currently).substr(1)))
                                                : alert("NO") } } variant="danger" block>
                                            Place Bid </Button> */}

                                        </Col>

                                        {(this.state.newBidValidation === false) ?
                                            <Modal show={this.state.show} onHide={this.handleClose}>                                        
                                                    <div>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title><h4 style={{ color: 'darkred' }} >You have to bid more <i className="far fa-times-circle"></i> </h4></Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Your bid has to be higher than the current bid. </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={this.handleClose}>
                                                                Close
                                                            </Button>
                                                        </Modal.Footer>
                                                    </div>
                                            </Modal>
                                        : null}
                
                                        <Modal show={this.state.showBid} onHide={this.handleCloseBid}>
                                            <div>
                                                <Modal.Header closeButton>
                                                    <Modal.Title><h4 style={{ color: 'black' }} >Are you sure you want to bid for this item? </h4></Modal.Title>
                                                </Modal.Header>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={this.handleCloseBid}>
                                                        No
                                                    </Button>
                                                    <Button variant="primary"
                                                        onClick={() => {
                                                            this.placeBid(this.state.user, this.state.item._ItemID, this.newBid.current.value);
                                                            this.handleClose();
                                                        }}>
                                                        Yes
                                                    </Button>
                                                </Modal.Footer>
                                            </div>
                                        </Modal>


                                    </Form.Row>
                                </Form>
                            </div> : 
                                <div style={{ textAlign: 'center', color: 'black' }}>
                                    <h4>This auction has ended</h4> <br/>
                                    <Card.Text>
                                        <Row>
                                            <Col>
                                                <Card.Text>
                                                    <b>Last Bid</b>: {this.state.item.Currently}
                                                </Card.Text>
                                            </Col>
                                            <Col>
                                                <Card.Text>
                                                    Bids: {this.state.item.Number_of_Bids}
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Text>
                                </div>
                            }

                        </Card.Body>
                    </Card>
                </Col>


            </Row>

            <Tabs defaultActiveKey="description" id="uncontrolled-tab-example" style={{marginTop: '2em', backgroundColor: 'black'}}>
                <Tab eventKey="description" title="Description" >
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                {this.state.item.Description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="location" title="Location" style={{ backgroundColor: 'orange'}}>
                    <Card>
                        <Card.Body>
                            <Card.Text>Country: {this.state.item.Country}</Card.Text>
                            <Card.Text>Location: {this.state.item.Location}</Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="seller" title="Seller" >
                    <Card>
                        <Card.Body>
                            <Card.Text>Seller: {this.state.item.Seller._UserID}</Card.Text>
                            <Card.Text>Seller rating: {this.state.item.Seller._Rating}</Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            <br /> <br /><br /><br /><br />

            {(this.state.item._Latitude !== "" && this.state.item._Latitude !== "")?

            (<Card style={{ backgroundColor: '#F5F5F5', height: '30em' }} >
                <Card.Header><b>Map</b></Card.Header>
                <Card.Body>
                    <Card.Text>
                        <div id="map1" style={{ height: '100%', width: '100%' }}> <MyMap lat={this.state.item._Latitude} lon={this.state.item._Longitude} item={this.state.item.Name}/> </div>
                    </Card.Text>

                </Card.Body>
            </Card>):null}

            
        </Container>}
        
        
        </div>);
    }
}

export default withRouter(Item);
