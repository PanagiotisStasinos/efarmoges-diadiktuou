import React from 'react';
import {Col, Form, Button, Container, Modal} from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import { DateTimePicker } from "@material-ui/pickers";


class AuctionForm extends React.Component{

    constructor(props) {
        super(props);

        /* Data to send in the server */
        this.auctionName = React.createRef();
        this.firstBid = React.createRef();
        this.buyPrice = React.createRef();
        this.location = React.createRef();
        this.country = React.createRef();
        this.description = React.createRef();

        /* Category */
        this.category = React.createRef();
        this.subcategorylevel1 = React.createRef();

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
        /* Data to send in the server */

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        this.state = {

            showsubcategoriesLevel1: false,

            /* Modal */
            show: false,
            modalMessage:'',

            /* testdate */
            selectedStartingDate : new Date(),
            selectedEndingDate: tomorrow,
        }

    }

    handleStartingDateChange(date){
        this.setState({
            selectedStartingDate: date
        })
    }

    handleEndingDateChange(date) {
        this.setState({
            selectedEndingDate: date
        })

    }


    /*Categeories and subCategories  */
    subcategory_dropdown = () =>{
        const subCollectibles = ["Select subcategory", "Housewares & Kitchenware", "Art, Animation & Photo Images", "Pop Culture"];
        const subSport = ["Select subcategory", "Sport1", "Sport2", "Sport3"];

        var SubCategory=[];

        if(this.category.current.value === "Collectibles"){
            SubCategory = subCollectibles;
        } else if(this.category.current.value === "Sports"){
            SubCategory = subSport;
        }


        return(

            <Form.Group>
                <Form.Label>{this.category.current.value}</Form.Label>
                <Form.Control as="select" ref={this.subcategorylevel1}>
                    {SubCategory.map(sub => <option key={sub}>{sub}</option>)}
                </Form.Control>
            </Form.Group> 
            
        );
    }

    findSubCategories = (props) => {
        this.setState({showsubcategoriesLevel1: true});
    }


    sendAuctionData(e){
        e.preventDefault();
        const auctionName = this.auctionName.current.value;
        const firstBid = this.firstBid.current.value;
        const buyPrice = this.buyPrice.current.value;
        const location = this.location.current.value;
        const country = this.country.current.value;
        const description = this.description.current.value;
        const latitude = "5";
        const longitude = "1";

        /* Category */
        var categoryArray=[];
        const category = this.category.current.value;
        categoryArray.push(category);
 
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        if(this.state.selectedStartingDate >= this.state.selectedEndingDate){
            this.setState({ modalMessage: "Starting or ending date of the auction isn't valid" });
            this.handleShow();
            return;
        }

        /* Starting Date */
        var st = this.state.selectedStartingDate;
        var sy = st.getFullYear();
        var sm = monthNames[st.getMonth()];
        var sd = ((st.getDate() < 10 ? '0' : '') + st.getDate());

        var sh = ((st.getHours() < 10 ? '0' : '') + st.getHours());
        var smin = ((st.getMinutes()<10?'0':'') + st.getMinutes());
        var ssec = ((st.getSeconds() < 10 ? '0' : '') + st.getSeconds());

        var selectedStart = sm + "-" + sd + "-" + sy + " " + sh + ":" + smin + ":" + ssec;

        /*Ending Date  */
        var et = this.state.selectedEndingDate;
        var ey = et.getFullYear();
        var em = monthNames[et.getMonth()];
        var ed = ((et.getDate() < 10 ? '0' : '') + et.getDate());

        var eh = ((et.getHours() < 10 ? '0' : '') + et.getHours());
        var emin = ((et.getMinutes() < 10 ? '0' : '') + et.getMinutes());
        var esec = ((et.getSeconds() < 10 ? '0' : '') + et.getSeconds());

        var selectedEnd = em + "-" + ed + "-" + ey + " " + eh + ":" + emin + ":" + esec;


        /* Check if all the required inputs have been given */
        if(auctionName === ""){
            this.setState({modalMessage: 'Name is required.'});
            this.handleShow();
            return;
        }else if (firstBid === "") {
            this.setState({ modalMessage: 'First Bid is required.' });
            this.handleShow();
            return;
        }else if (category === "Select Category") {
            this.setState({ modalMessage: 'Category is required.' });
            this.handleShow();
            return;
        }else if (location === "") {
            this.setState({ modalMessage: 'Location is required.' });
            this.handleShow();
            return;
        }else if (country === "") {
            this.setState({ modalMessage: 'Country is required.' });
            this.handleShow();
            return;
        } else if (description === "") {
            this.setState({ modalMessage: 'Description is required.' });
            this.handleShow();
            return;
        }


        var categorylevel1 = "";

        /* Check if sub category level 1 exists */
        if (this.subcategorylevel1.current !== null ) {
            if (this.subcategorylevel1.current.value !== 'Select subcategory'){
                console.log("%c SUB: "+ this.subcategorylevel1.current.value, 'color: red')
                categorylevel1 = this.subcategorylevel1.current.value;
                categoryArray.push(categorylevel1);
            }
        }



        var userID = localStorage.getItem('user');
        var tok = localStorage.getItem('token');

        fetch('http://localhost:8080/Project_11_war_exploded/insert_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username: userID,
                token: tok,

                Name: auctionName, 
                Category: categoryArray, 
                Buy_Price: buyPrice, 
                First_Bid: firstBid, 
                Description: description, 
                Location: location, 
                Longitude: longitude,
                Latitude: latitude, 
                Country: country, 

                Started: selectedStart,
                Ends: selectedEnd
            }),
        }).then(response => response.json())
            .then(data => {

                /* Check if session has expired */
                if ((data.hasOwnProperty('error'))) {
                    alert("Your session has expired!");
                    localStorage.clear();
                    this.props.history.push('/login')
                }else{
                    let path = '/myItems';
                    this.props.history.push({ pathname: path });
                }

            });
    }


    /* Submit - Modal*/
    handleClose = () => {
        this.setState({
            show: false,
            modalMessage: ''
        });
    }
    handleShow = () => {
        this.setState({
            show: true,
        });
    }



    render(){

        const Minutes = ['00', '01', '02', '03','04','05','06','07','08','09'];
        const minutesArray=[];
        for (const [i, value] of Minutes.entries()) {
            minutesArray.push(<option  key={i} >{value}</option>)
        }
        for(let i=10; i<60; i++) {
            minutesArray.push(<option key={i}>{i}</option>)
        }

        const endMinutesArray = [];
        for (const [i, value] of Minutes.entries()) {
            if(i===1){
                endMinutesArray.push(<option selected key={i} >{value}</option>)
            }
            else{
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

        const DaysArray=[]
        for (let i = 1; i < 32; i++) {
            DaysArray.push(<option key={i}>{i}</option>)
        }
        
        const Months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const MonthsArray = []
        for (const [i, value] of Months.entries()) {
            MonthsArray.push(<option key={i}>{value}</option>)
        }



        return(<div>

            <MyNavbar/>

            <Container style={{ "backgroundColor": '#F5F5F5', border: '1px solid black', borderRadius: '20px', height: '50em'}}>
                <h3 style={{ textAlign: 'center', paddingTop: '2%' }}><b>Sell Item</b></h3>

                <Form style={{ "backgroundColor":'#F5F5F5'}}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridName">
                        <Form.Label><i><b>Name</b></i></Form.Label>
                        <Form.Control type="text" placeholder="Enter name of the item." ref={this.auctionName}/>
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Row>
                        <Form.Group as={Col} xs={3} controlId="formGridFirstBid">
                            <Form.Label><i><b>First Bid ($)</b></i></Form.Label>
                            <Form.Control type="number" min='0' placeholder="Enter first bid" ref={this.firstBid}/>
                        </Form.Group>

                        <Form.Group as={Col} xs={3} controlId="formGridBuyPrice">
                            <Form.Label><i><b>Buy Price ($)</b></i></Form.Label>
                            <Form.Control type="number" min='0' placeholder="Enter bying price" ref={this.buyPrice}/>
                        </Form.Group>
                    </Form.Row>

                    {/* Category */}
                    <Form.Row>      
                        <Form.Group as={Col} xs={2}  controlId="formGridCategory">
                            <Form.Label><i><b>Category</b></i></Form.Label>

                            <Form.Control as="select" ref={this.category} onChange={this.findSubCategories}>
                                <option>Select Category</option>
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

                        {(this.state.showsubcategoriesLevel1 && this.category.current.value !== 'Select Category') ?
                            this.subcategory_dropdown()
                            : null}
                    </Form.Row>
                    
                    <Form.Row>
                        <Form.Group as={Col} xs={3} controlId="formGridFirstBid">
                            <Form.Label><i><b>Starting Date</b></i></Form.Label>
                            <DateTimePicker
                                autoOk
                                ampm={false}
                                disablePast

                                label="Starting Date"
                                inputVariant="outlined"
                                value={this.state.selectedStartingDate}
                                onChange={(date) => this.handleStartingDateChange(date)}

                            />
                        </Form.Group>    

                        <Form.Group as={Col} xs={3} controlId="formGridBuyPrice">
                            <Form.Label><i><b>Ending Date </b></i></Form.Label>

                            <DateTimePicker
                                autoOk
                                ampm={false}
                                disablePast

                                label="Ending Date"
                                inputVariant="outlined"

                                value={this.state.selectedEndingDate}
                                onChange={(date) => this.handleEndingDateChange(date)}

                                /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! NOT WORKING */
                                minDate={this.state.selectedStartingDate}
                            />                        
                        </Form.Group>    
                    </Form.Row>
 

                    {/* Location */}
                    <Form.Group controlId="formGridLocation">
                        <Form.Label><b><i>Location</i></b></Form.Label>
                        <Form.Control type="text" placeholder="Enter location of the item" ref={this.location}/>
                    </Form.Group>

                    {/* Country */}
                    <Form.Group controlId="formGridCountry">
                        <Form.Label><b><i>Country</i></b></Form.Label>
                        <Form.Control placeholder="Enter country of the item" type="text"  ref={this.country}/>
                    </Form.Group>

                    <Form.Group controlId="formGridDescription">
                        <Form.Label><b><i>Description</i></b></Form.Label>
                        <Form.Control placeholder="Enter description of the item..." type="text" as="textarea" rows="2" ref={this.description}/>
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" onClick={(e) => this.sendAuctionData(e)} style={{position: 'absolute', left: '30%', width: '40%', borderRadius: '50px'}}>
                        Create Auction
                    </Button>

                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <div>
                            <Modal.Header closeButton>
                                <Modal.Title><h5 style={{ color: '#E00000' }} > {this.state.modalMessage} <i class="fas fa-times"></i> </h5></Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </div>
                    </Modal>

                </Form>
            </Container>

            
        </div>);
    }
}

export default AuctionForm;