import React from 'react'
import {Container, Form, Col, Button, Row, Spinner} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';


async function getUser(username) {

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_user', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
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

async function verifyUser(username) {
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/verify_user', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })
    .then(response => response.json())
        .then(response => (console.log(response)));
};




class UserDetails extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: props.location.state.username,
            userData:'',
            loading: true
        }
    }

    componentDidMount() {
        getUser(this.state.username).then(data => {
            this.setState({ userData: data });

            if ((data.hasOwnProperty('error'))) {
                alert("End Token!");
                localStorage.clear();
                this.props.history.push('/')
            }

            this.setState({ loading: false });
        });

    }

    verify = () =>{
        verifyUser(this.state.username);
        
        this.props.history.push('/admin/users/')
    }


    render() {
        return <div>

            {this.state.loading === true?
            (<Spinner style={{ position: 'absolute', left: '50%' }} animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>):
            
            <Container style={{backgroundColor: 'white', position: 'relative', borderRadius: '20px', height: "45em", border: '1px solid black'}}>
                <Row>
                    <Col>
                        <h3 style={{textAlign: 'center', paddingTop: '2%'}}> User Information </h3>
                    </Col>

                    <Col style={{ textAlign: 'center', paddingTop: '1%' }}>
                            {(this.state.userData.verified === "true")?
                                (<h4 style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', width: '8em' }}>Verified User</h4>):
                                (<h4 style={{ backgroundColor: 'rgb(202, 0, 0)', color: 'white', borderRadius: '5px', width: '8em' }}>Unverified User</h4>)}
                    </Col>
                </Row>

                <Form>

                    <Form.Row style={{ marginTop: '1em' }}>
                        <Col>
                            <Form.Label>Usename</Form.Label>
                            <Form.Control value={this.state.userData.username} disabled />
                        </Col>
                    </Form.Row>

                    <Form.Row style={{ marginTop: '1em' }}>
                        <Col>
                            <Form.Label>First Name</Form.Label>
                            {this.state.userData.first_name === "null" ?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.first_name} disabled />)} 
                        </Col>
                        <Col>
                            <Form.Label>Last Name</Form.Label>
                            {this.state.userData.surname === "null" ?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.surname} disabled />)} 
                        </Col>
                    </Form.Row>

                    <Form.Row style={{ marginTop: '1em' }}>
                        <Col>
                            <Form.Label>Country</Form.Label>
                            <Form.Control value={this.state.userData.Country} disabled />
                        </Col>
                        <Col>
                            <Form.Label>Location</Form.Label>
                            {this.state.userData.Location === "null" ?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.Location} disabled />)}
                        </Col>
                    </Form.Row>

                    <Form.Row  style={{ marginTop: '1em' }}>
                        <Col xs={6}>
                            <Form.Label>AFM</Form.Label>
                            {this.state.userData.afm === "null" ?
                            (<Form.Control value={""} disabled />):(<Form.Control value={this.state.userData.afm} disabled />)}    
                        </Col>
                    </Form.Row>

                    <h5 style={{ marginTop: '1em'}}><u>Contact Information</u></h5>
                    <Form.Row>
                        <Col>
                            <Form.Label>Email</Form.Label>
                            {this.state.userData.email === "null" ?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.email} disabled />)}    
                        </Col>
                        <Col>
                            <Form.Label>Phone Number</Form.Label>
                            {this.state.userData.phone_number === "null" ?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.phone_number} disabled />)} 
                        </Col>
                    </Form.Row>

                    <h5 style={{ marginTop: '1em' }}><u>Ratings</u></h5>
                    <Form.Row>
                        <Col>
                            <Form.Label>Seller Rating</Form.Label>

                            {(this.state.userData.Seller_Rating === "null" || this.state.userData.Seller_Rating === null)?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.Seller_Rating} disabled />)} 

                        </Col>
                        <Col>
                            <Form.Label>Bidder Rating</Form.Label>

                            {(this.state.userData.Bidder_Rating === "null" || this.state.userData.Bidder_Rating === null)?
                                (<Form.Control value={""} disabled />) : (<Form.Control value={this.state.userData.Bidder_Rating} disabled /> )} 
                        </Col>
                    </Form.Row>

                    {this.state.userData.verified === "false"?
                        <Button onClick={()=>this.verify()} style={{marginTop: '3%', position: 'absolute', right: '35%', width: '20em'}}>Verify new user</Button>
                        :null}

                </Form>
            </Container>}
        </div>
    }
}


export default withRouter(UserDetails);
