import React from 'react';
import {Container, Button, Form, Row, Col, Modal} from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import { DateTimePicker} from "@material-ui/pickers";



class AuctionsManagement extends React.Component {

    constructor(props) {
        super(props);

        this.startDay = React.createRef();
        this.startMonth = React.createRef();
        this.startYear = React.createRef();
        this.startHour = React.createRef();
        this.startMinute = React.createRef();


        this.endDay = React.createRef();
        this.endMonth = React.createRef();
        this.endYear = React.createRef();
        this.endHour = React.createRef();
        this.endMinute = React.createRef();

        this.state = {
            item: '',
            Name: '',
            Description: ''
        }

        if(props.location.state !== undefined){

            var tempFirstBid = props.location.state.item.First_Bid;
            tempFirstBid = tempFirstBid.replace(/^\D+/g, '');
            var tempCurrent = props.location.state.item.Currently;
            tempCurrent = tempCurrent.replace(/^\D+/g, '');

            var tempDay, tempMonth, tempYear, tempHour, tempMinutes;
            var tempEndDay, tempEndMonth, tempEndYear, tempEndHour, tempEndMinutes;

            tempDay = new Date(props.location.state.item.Started).getDate();
            tempMonth = new Date(props.location.state.item.Started).getMonth()+1;
            tempYear = new Date(props.location.state.item.Started).getFullYear();
            tempHour = new Date(props.location.state.item.Started).getHours();
            tempMinutes = new Date(props.location.state.item.Started).getMinutes();

            tempEndDay = new Date(props.location.state.item.Ends).getDate();
            tempEndMonth = new Date(props.location.state.item.Ends).getMonth();
            tempEndYear = new Date(props.location.state.item.Ends).getFullYear();
            tempEndHour = new Date(props.location.state.item.Ends).getHours();
            tempEndMinutes = new Date(props.location.state.item.Ends).getMinutes();


            var activeTemp;
            if(props.location.state.item.active === "true" && props.location.state.item.Number_of_Bids === "0" ){
                activeTemp = false; 
            }else{
                activeTemp = true; 
            }

            this.state = {

                start_Day: tempDay,
                start_Month: tempMonth,

                item: props.location.state.item,

                username: props.location.state.item.Seller._UserID,     /* Seller Username */

                ItemID: props.location.state.item._ItemID,
                Name: props.location.state.item.Name,
                Description: props.location.state.item.Description,

                Country: props.location.state.item.Country,
                Location: props.location.state.item.Location,

                First_Bid: tempFirstBid,
                Currently: tempCurrent,
                Number_of_Bids: props.location.state.item.Number_of_Bids,
                

                Started: props.location.state.item.Started, 
                Ends: props.location.state.item.Ends,

                selectedStartingDate: props.location.state.item.Started,
                selectedEndingDate: props.location.state.item.Ends,

                Category: props.location.state.item.Category,

                active: activeTemp,
                auctionStatus: props.location.state.item.active,

                /* Modal */
                show: false,
                show2: false
            }
        }
    }

    handleStartingDateChange(date) {
        this.setState({
            selectedStartingDate: date
        })

    }

    handleEndingDateChange(date) {
        this.setState({
            selectedEndingDate: date
        })
    }


    /* Delete Auction Modal */
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

    handleClose2 = () => {
        this.setState({
            show2: false,
        });
    }
    handleShow2 = () => {
        this.setState({
            show2: true,
        });
    }

    handleCloseAndDelete = () => {
        this.setState({
            show: false,
        });

        this.deleteAuction();
    }

    handleChange(e) {
        if(e.target.value === ''){
            console.log("%c Value: null", 'color: red');            
        }
        this.setState({ [e.target.name]: e.target.value });
    }


    async  updateAuction() {

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        var selectedStart = this.state.selectedStartingDate;
        var selectedEnd = this.state.selectedEndingDate
        
        if (new Date(selectedStart) >= new Date(selectedEnd)) {
            this.handleShow2();
            return;
        }

        /* Starting Date */
        if(this.state.selectedStartingDate !== this.state.Started){
            var st = this.state.selectedStartingDate;
            var sy = st.getFullYear();
            var sm = monthNames[st.getMonth()];
            var sd = ((st.getDate() < 10 ? '0' : '') + st.getDate());

            var sh = ((st.getHours() < 10 ? '0' : '') + st.getHours());
            var smin = ((st.getMinutes() < 10 ? '0' : '') + st.getMinutes());
            var ssec = ((st.getSeconds() < 10 ? '0' : '') + st.getSeconds());

            selectedStart = sm + "-" + sd + "-" + sy + " " + sh + ":" + smin + ":" + ssec;
        }
        
        /*Ending Date  */
        if (this.state.selectedEndingDate !== this.state.Ends) {

            var et = this.state.selectedEndingDate;
            var ey = et.getFullYear();
            var em = monthNames[et.getMonth()];
            var ed = ((et.getDate() < 10 ? '0' : '') + et.getDate());

            var eh = ((et.getHours() < 10 ? '0' : '') + et.getHours());
            var emin = ((et.getMinutes() < 10 ? '0' : '') + et.getMinutes());
            var esec = ((et.getSeconds() < 10 ? '0' : '') + et.getSeconds());

            selectedEnd = em + "-" + ed + "-" + ey + " " + eh + ":" + emin + ":" + esec;
        }


        var firstBid = this.state.First_Bid;        
        
        var userID = localStorage.getItem('user');
        var tok = localStorage.getItem('token');


        var response = await fetch('http://localhost:8080/Project_11_war_exploded/update_item', {
            method: 'POST',
            body: JSON.stringify({

                username: userID,
                ItemID: this.state.ItemID,
                token: tok,

                // Category: ["Collectibles"],
                Category: ([
                    "Collectibles",
                    "Decorative & Holiday",
                    "Decorative by Brand",
                    "Enesco",
                    "Other Enesco Items"]),

                Description: this.state.Description,
                Location: this.state.Location,
                Started: selectedStart,
                Ends: selectedEnd,
                Longitude: "5",
                Latitude: "10",

                Name: this.state.Name,
                Country: this.state.Country,

                First_Bid: firstBid,
                Buy_Price: ""
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        })
        .then(response => response.json())
            .then(response => {

                /* Check if session has expired */
                if ((response.hasOwnProperty('error'))) {
                    alert("Your session has expired!");
                    localStorage.clear();
                    this.props.history.push('/login')
                }else{
                    /* After the update redirect to the Auctions Items. */
                    let path = '/myItems';
                    this.props.history.push(path);  
                }

            });

    };

    async  deleteAuction() {

        var tok = localStorage.getItem('token');

        var response = await fetch('http://localhost:8080/Project_11_war_exploded/delete_item', {
            method: 'POST',
            body: JSON.stringify({
                token: tok,
                username: this.state.username,
                ItemID: this.state.ItemID,
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(response => response.json())
            .then(response => {

                /* Check if session has expired */
                if ((response.hasOwnProperty('error'))) {
                    alert("Your session has expired!");
                    localStorage.clear();
                    this.props.history.push('/login')
                } else {
                    let path = '/myItems';
                    this.props.history.push(path); 
                }
            });
    }


    auctionDetails(){
        const Minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        const minutesArray = [];
        for (const [i, value] of Minutes.entries()) {
            minutesArray.push(<option key={i} >{value}</option>)
        }
        for (let i = 10; i < 60; i++) {
            minutesArray.push(<option key={i}>{i}</option>)
        }

        const endMinutesArray = [];
        for (const [i, value] of Minutes.entries()) {
            if (i === 1) {
                endMinutesArray.push(<option selected key={i} >{value}</option>)
            }
            else {
                endMinutesArray.push(<option key={i} >{value}</option>)
            }
        }
        for (let i = 10; i < 60; i++) {
            endMinutesArray.push(<option key={i}>{i}</option>)
        }

        const Hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        const HoursArray = [];
        for (const [i, value] of Hours.entries()) {
            HoursArray.push(<option key={i}>{value}</option>)
        }
        for (let i = 10; i < 24; i++) {
            HoursArray.push(<option key={i}>{i}</option>)
        }

        const DaysArray = []
        for (let i = 1; i < 32; i++) {
            DaysArray.push(<option  value={i} key={i}>{i}</option>)
        }

        const Months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const MonthsArray = []
        for (const [i, value] of Months.entries()) {
            MonthsArray.push(<option key={i}>{value}</option>)
        }


        return(
            <Container style={{ backgroundColor: '#F5F5F5', border: '1px solid black', borderRadius: '50px'}}>
                <h3 style={{ textAlign: 'center', paddingTop: '2%' }}><b>Auction Details</b></h3>

                <Form style={{marginTop: '2%' }}>
                    <Form.Group as={Row} controlId="formName">
                        <Form.Label column sm={2}> <i><b>Name</b></i> </Form.Label>
                        <Col sm={10}>
                            <Form.Control disabled={this.state.active} type="text" name="Name" value={this.state.Name} onChange={e => this.handleChange(e)}/>
                        </Col>
                    </Form.Group>

                    {/* Dates */}
                    <Form.Row>
                        <Form.Group as={Col} xs={3} controlId="formGridFirstBid">
                            <Form.Label><i><b>Starting Date</b></i></Form.Label>
                            <DateTimePicker
                                autoOk
                                ampm={false}

                                label="Starting Date"
                                inputVariant="outlined"
                                value={this.state.selectedStartingDate}
                                onChange={(date) => this.handleStartingDateChange(date)}
                                
                                disabled={this.state.active}
                            />
                        </Form.Group>


                        <Form.Group as={Col} xs={3} controlId="formGridBuyPrice">
                            <Form.Label><i><b>Ending Date </b></i></Form.Label>

                            <DateTimePicker
                                autoOk
                                ampm={false}

                                label="Ending Date"
                                inputVariant="outlined"

                                value={this.state.selectedEndingDate}
                                onChange={(date) => this.handleEndingDateChange(date)}

                                disabled={this.state.active}
                            />
                        </Form.Group>
                    </Form.Row>

                    
                    <Form.Group controlId="formBids">
                        <Row>
                            <Col>
                                <Form.Label> <i><b>Current Bid($)</b></i>  </Form.Label>
                                <Form.Control disabled type="text" name="Currently" value={this.state.Currently} onChange={e => this.handleChange(e)} />
                            </Col>
                            <Col>
                                <Form.Label> <i><b>First Bid($)</b></i>  </Form.Label>
                                <Form.Control disabled={this.state.active} type="number" name="First_Bid" value={this.state.First_Bid} onChange={e => this.handleChange(e)} />
                            </Col>
                            <Col>
                                <Form.Label> <i><b>Number of Bids</b></i>  </Form.Label>
                                <Form.Control disabled type="text" name="Currently" value={this.state.Number_of_Bids} />
                            </Col>
                        </Row>
                    </Form.Group>


                    <Form.Group controlId="formLocationandCountry">
                        <Row>
                            <Col>
                                <Form.Label > <i><b>Country</b></i> </Form.Label>
                                <Form.Control disabled={this.state.active} type="text" name="Country" value={this.state.Country} onChange={e => this.handleChange(e)} />
                            </Col>
                            <Col>
                                <Form.Label > <i><b>Location</b></i> </Form.Label>
                                <Form.Control disabled={this.state.active} type="text" name="Location" value={this.state.Location} onChange={e => this.handleChange(e)} />
                            </Col>
                        </Row>
                    </Form.Group>


                    <Form.Group controlId="formDescription">
                        <Form.Label><i><b>Desciption</b></i></Form.Label>
                        <Form.Control disabled={this.state.active} name="Description" value={this.state.Description} onChange={e => this.handleChange(e)} as="textarea" rows="3" />
                    </Form.Group>

                    {(this.state.active === false)?
                        <Form.Group as={Row}>
                            <Col>
                                <Col sm={{ span: 4, offset: 0 }}>
                                    <Button disabled={this.state.active} variant="danger" onClick={this.handleShow} style={{ borderRadius: '50px' }}>Delete Auction</Button>
                                </Col>
                            </Col>
                            <Col>
                                <Col sm={{ span: 4, offset: 8 }}>
                                    <Button disabled={this.state.active} onClick={() => this.updateAuction()} style={{ borderRadius: '50px' }} >Update Auction</Button>
                                </Col>
                            </Col>
                        </Form.Group>:
                            <div>
                            {this.state.auctionStatus === "true" ? <h4 style={{ position: 'relative', left: '35%', textAlign: 'center', width: '30%', borderRadius: '20px' }}> Active auction.</h4>
                                :<h4 style={{position:'relative', left: '35%', textAlign: 'center', color: 'green', width: '30%', borderRadius: '20px'}}> Auction has ended.</h4>}
                            </div>
                        }
                </Form>

                <Modal show={this.state.show} onHide={this.handleClose}>

                        <div>
                            <Modal.Header closeButton>
                            <Modal.Title><h4 style={{ color: '#E00000' }}>Are you sure you want to delete this auction? <i class="fas fa-exclamation-triangle"></i> </h4></Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}> No </Button>
                                <Button variant="danger" onClick={this.handleCloseAndDelete}>  Yes  </Button>
                            </Modal.Footer>
                        </div> 
                </Modal>

                <Modal show={this.state.show2} onHide={this.handleClose2}>
                    <div>
                        <Modal.Header closeButton>
                            <Modal.Title><h5 style={{ color: '#E00000' }} > Dates are not valid <i class="fas fa-times"></i> </h5></Modal.Title>

                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose2}>
                                Close
                                </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
                
        </Container>

        );

    }


    

    render(){
        return (<div>

            <MyNavbar />
            {this.state.item === "" ? <h4 style={{textAlign:'center'}}>Sorry page doesn't exist</h4>: this.auctionDetails()}

        </div>);
    }
}



export default AuctionsManagement