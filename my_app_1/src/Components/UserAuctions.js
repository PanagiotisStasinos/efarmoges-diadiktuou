import React from 'react';
import { Card, Container, CardGroup, Row, Col, Spinner, ButtonGroup, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MyNavbar from './MyNavbar';

const activeStyle={
    width: '18em', maxWidth: '35%', margin: '1px', backgroundColor: 'lightblue' 
}

const nonactiveStyle={
    width: '18em', maxWidth: '35%', margin: '1px', backgroundColor: 'lightgrey' 
}

async function getActiveAuctions(activeflag) {

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/user_auctions', {
        method: 'POST',
        body: JSON.stringify({
            username: userID,
            active: activeflag,
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })

    var data = await response.json();
    return data;
};


class UserAuctions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username:'',

            dataAuctions: '',
            auctionsArrray: [],
            active: 'true',
            active1: 'primary',
            active2: 'secondary',
            active3: 'secondary',

            loading: true,
        }
    }


    componentDidMount() {

        getActiveAuctions(this.state.active).then(data => {

            console.log(data);

            /* Check if the session has expired */
            if ((data.hasOwnProperty('error'))) {
                alert("Your session has expired!");
                localStorage.clear();
                this.props.history.push('/login')
            } else {
                this.setState({ dataAuctions: data });
                this.activeAuctions();
                this.setState({ loading: false });
            }

        });

    }

    getAuctions(active) {

        getActiveAuctions(active).then(data => {
            
            if ((data.hasOwnProperty('error'))) {
                alert("Your session has expired!");
                localStorage.clear();
                this.props.history.push('/login')
            } else{
            
                this.setState({ dataAuctions: data });
                this.activeAuctions();
                this.setState({ loading: false });
            }
        });
    }

    activeAuctions(){
        var Rows = [];
        var ArrayLength = 0;
        this.setState({auctionsArrray: []})

        var auctions = this.state.dataAuctions.SoldItems;
        ArrayLength = auctions.length;


        for (let i = 0; i < ArrayLength;) {
            for (let j = 0; j < 3; j++){
                Rows.push(

                    <Card key={auctions[i].Name} className="AuctionCard" text="white"  style={auctions[i].active === 'true'? activeStyle : nonactiveStyle}>

                            <Link to={{ pathname: "/myItems/auction/" + auctions[i].Name, state: { item: auctions[i] } }} style={{ color: 'black' }}>
                                <Card.Header >{auctions[i].Name}</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <Col>
                                            <Row> Auction started: {auctions[i].Started}</Row>
                                        </Col>
                                        <Col>
                                            <Row> Auction ends: {auctions[i].Ends}</Row>
                                        </Col>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer >
                                    Number of Bids: {auctions[i].Number_of_Bids}
                                </Card.Footer>
                            </Link>
                        </Card>
                );
                
                i++;
                if (i + 1 > ArrayLength) break;
            }
            this.setState({ auctionsArrray: [...this.state.auctionsArrray, <CardGroup key={i}>{Rows}</CardGroup>] });
            Rows = [];

        }
    }




    render() {
        return (<div>

            <MyNavbar />

            {localStorage.getItem('user') === null?
                <h1 style={{ textAlign: 'center'}}>404 Page Not found</h1>:

            <Container style={{marginTop: '2%'}}>
                {this.state.loading === true ? 
                    (<Spinner style={{position: 'absolute', left: '50%'}} animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>):
                    <div>
                        <h4 style={{textAlign: 'center'}}>My Actions</h4>

                        <ButtonGroup aria-label="Basic example" style={{ display: 'flex', marginBottom: '2%'}}>
                            <Button variant={this.state.active1} onClick={() => {
                                this.getAuctions('true');
                                this.setState({ active1: 'primary', active2: 'secondary', active3: 'secondary' })
                            }}
                            >Active Auctions</Button>
                            <Button variant={this.state.active2} onClick={() => {
                                this.getAuctions('false');
                                this.setState({ active1: 'secondary', active2: 'primary', active3: 'secondary' })
                            }}
                            >Inactive Auctions</Button>
                            <Button variant={this.state.active3} onClick={() => {
                                this.getAuctions('All');
                                this.setState({ active1: 'secondary', active2: 'secondary', active3: 'primary' })
                            }}
                            >All Auctions</Button>
                        </ButtonGroup>
                        {this.state.auctionsArrray}
                    </div>}

            </Container>}
    </div>)
    }
}


export default UserAuctions;