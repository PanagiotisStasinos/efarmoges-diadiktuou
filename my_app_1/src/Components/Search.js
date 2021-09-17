import React from 'react';
import { CardGroup, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { Pagination, Spinner } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Item from './Item';

import laptoppic from '../img/laptop.jpg';
import noimage from '../img/noimage2.png'

import '../css/Cards.css';
import MyNavbar from './MyNavbar';


const divStyle = {
    "backgroundColor": 'white',
    "width": '20rem',
    'border': 'solid black 1px',
    "height": '27em',
    "maxHeight": '100%'
};

function ProductCard(props) {
    return (
        <div>
            <Card className="col-md" style={divStyle}>

                <Link to={{ pathname: "/cards/" +  props.categPath + "/" + props.name, state: { Name: props.name, Id: props.Id } }} >
                    <Card.Img className="productimg" variant="top" src={noimage} />
                </Link>

                <Card.Body style={{ "height": '100%' }}>
                    <Link to={{ pathname: "/cards/"+ props.categPath + "/" + props.name, state: { Name: props.name, Id: props.Id } }}  >{props.name}</Link>
                </Card.Body>

                <hr/>

                <Card.Body>
                    <Row>
                        <Col className="leftcardfooter" md={{ span: 7, offset: 0 }}>
                            <div className="info">
                                <b>Current bid</b>: {props.currentPrice}
                            </div>
                        </Col>
                        <Col className="rightcardfooter" md={{ span: 4, offset: 1 }}>
                            <div className="info">
                                <div>{props.bids} bids</div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}


async function getData(page, category, name, minPrice, maxPrice, Location, Description, nextSkippedItems) {

    /* If Min and Max have no value */
    if(minPrice === "" || minPrice === undefined){
        minPrice ="0";
    }
    if(maxPrice === "" || maxPrice === undefined){
        maxPrice = "1000000";
    }

    if (Location === undefined || Location === "") {
        Location = "";
    }
    if (Description === undefined || Description === "") {
        Description = "";
    }

    if (nextSkippedItems === undefined){
        nextSkippedItems="0";
    }

    var number_of_page = page.toString();
    var response = await fetch('http://localhost:8080/Project_11_war_exploded/search', {
        method: 'POST',
        body: JSON.stringify({
            "number_of_items": "9",

            "Name": name,
            "upper_category": "",
            "level": "0",
            "Category": category,

            "Max_Price": maxPrice,
            "Min_Price": minPrice,
            
            "Description": Description,
            "number_of_page": number_of_page,

            "next_skipped_items": nextSkippedItems,

            "Location": Location,
            "Longitude": "",
            "Latitude": "",
            "Country": ""
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })

    var data = await response.json();
    return data;

};

export class SearchItems extends React.Component{

    constructor(props){
        super(props);

        /* Variables for the advanced search */
        var MinP = "";
        var MaxP = "";
        var Loc = "";
        var Desc = "";

        if(props.location.state.minPrice !== undefined){
            MinP = props.location.state.minPrice;
        }
        if (props.location.state.maxPrice !== undefined) {
            MaxP = props.location.state.maxPrice;
        }
        if (props.location.state.Desc !== undefined) {
            Desc = props.location.state.Desc;
        }
        if (props.location.state.Locat !== undefined) {
            Loc = props.location.state.Locat;
        }
 

        this.state={
            dataset:'',
            ItemsArray:[],

            loading: true,

            /* Pagination */
            firstPage: 1,
            secondPage: 2,
            thirdPage: 3,

            firstActive: true,
            secondActive: false,
            thirdActive: false,

            /* Search Values */
            category: props.location.state.category,
            name: props.location.state.searchText,

            min_Price: MinP, 
            max_Price: MaxP,
            Location: Loc,
            Description: Desc, 

        }
    }

    Items() {

        var RowItems = [];
        var categP = this.props.match.params.category;
        var mycards = this.state.dataset.items;
        var ArrayLength = mycards.length;
        

        for (let i = 0; i < ArrayLength;) {
            for (let j = 0; j < 3; j++) {
                RowItems.push(<ProductCard key={mycards[i]['Name']} name={mycards[i]['Name']} 
                                currentPrice={mycards[i]['Currently']} 
                                bids={mycards[i]['Number_of_Bids']} 
                                time={'10 min'} 
                                Id={mycards[i]['_ItemID']} 
                                
                                categPath={categP} />);
                i++;
                if (i + 1 > ArrayLength) break;
            }
            this.setState({ ItemsArray: [...this.state.ItemsArray, <CardGroup key={i}>{RowItems}</CardGroup>]})
            RowItems = [];
        }
    }

    componentDidMount(){

        getData(1, this.state.category, this.state.name, this.state.min_Price, this.state.max_Price, this.state.Location, this.state.Description, this.state.dataset.next_skipped_items).then(data => {
            this.setState({ dataset: data})

            /* Render Items */
            this.Items();
            this.setState({ loading: false });
        });
    }


    componentDidUpdate(prevProps) {
        
        var prevcateg = prevProps.location.state.category;
        var newcateg = this.props.location.state.category;
        var prevname = prevProps.location.state.searchText;
        var newname = this.props.location.state.searchText;

        if (prevcateg !== newcateg) {
            this.setState({ category: newcateg });
        }

        if (prevname !== newname) {
            this.setState({ name: newname });
        }

        if (prevcateg !== newcateg || prevname !== newname){

            this.setState({ ItemsArray: [], loading: true}); 

            getData(1, newcateg, newname, "", "", "", "", this.state.dataset.next_skipped_items).then(data => {
                this.setState({ dataset: data })
                this.Items();
                this.setState({ loading: false });
            });
        }
    }

    getNewPage = (pageNumber) =>{
        getData(pageNumber, this.state.category, this.state.name, this.state.min_Price, this.state.max_Price, this.state.Location, this.state.Description, this.state.dataset.next_skipped_items).then(data => {
            this.setState({ dataset: data, ItemsArray:[] })            
            this.Items();
            this.setState({ loading: false });
        });
    }


    /* Pagination */
    updatePageNumbers = (button, page) =>{
        console.log("page: "+page+ "button: "+button)

        if(button === 2){
            this.setState({firstPage: this.state.secondPage});
            this.setState({ secondPage: this.state.thirdPage });
            this.setState({ thirdPage: this.state.thirdPage+1 });
        }else if(button === 3){
            this.setState({ firstPage: this.state.thirdPage });
            this.setState({ secondPage: this.state.thirdPage+1 });
            this.setState({ thirdPage: this.state.thirdPage + 2 });
        }
    }

    prevPage = () => {
        this.setState({ thirdPage: this.state.secondPage });
        this.setState({ secondPage: this.state.firstPage });
        this.setState({ firstPage: this.state.firstPage-1});
    }

    nextPage = () => {
        this.setState({ firstPage: this.state.secondPage });
        this.setState({ secondPage: this.state.thirdPage });
        this.setState({ thirdPage: this.state.thirdPage + 1 });
        
        /* Scroll to the top */
        window.scroll({ top: 0, left: 0, behavior: 'smooth' }); 
    }





render(){
    return (<div>
        
        <MyNavbar />

        {/* <div className="container-fluid pageContainer"> */}
            <Row>
                <div className="col-3 sideMenu" >
                    <div className="categoriesList">
                        <ListGroup>
                            {/* {categItems} */}
                            {/* <ListGroup.Item className="itemList" action href="#link2">{categoriesItems}</ListGroup.Item> */}
                            {/* <ListGroup.Item  className="itemList" action href="#link1">Here is a small message thas </ListGroup.Item>
                                <ListGroup.Item className="itemList" action href="#link2">Link 2</ListGroup.Item>
                                <ListGroup.Item action onClick={alertClicked}>This one is a button</ListGroup.Item> */}
                        </ListGroup>
                    </div>
                </div>

                <Col>                    
                    {this.state.ItemsArray.length === 0 && this.state.loading === false? <h3 style={{textAlign: 'center'}}>Sorry we found nothing!</h3>:this.state.ItemsArray}
                </Col>
            </Row>
        
            {this.state.ItemsArray.length !== 0 ?
            <div>
                {this.state.loading === true ? 
                <Spinner animation="border" variant="dark" style={{position: 'absolute', left:'50%'}}/> : 
                <div>
                    {this.state.dataset.n >=9 ? 
                    
                        (<Pagination className="cardsPagination" >
                                <Pagination.Prev className={this.state.firstPage === 1 ? "disabled" : ""} onClick={() => { this.prevPage(); this.getNewPage(this.state.firstPage - 1) }}/>

                                <Pagination.Item onClick={() => this.updatePageNumbers(1, this.state.firstPage)} className={this.state.firstActive === true ? "active" : ""}> {this.state.firstPage} </Pagination.Item>
                                <Pagination.Item onClick={() => {this.updatePageNumbers(2, this.state.secondPage); this.getNewPage(this.state.firstPage + 1);}} className={this.state.secondActive === true ? "active" : ""}> {this.state.secondPage} </Pagination.Item>
                                <Pagination.Item onClick={() => {this.updatePageNumbers(3, this.state.thirdPage); this.getNewPage(this.state.firstPage + 2);} } className={this.state.thirdActive === true ? "active" : ""}> {this.state.thirdPage} </Pagination.Item>
                
                                <Pagination.Next onClick={() => { this.nextPage(); this.getNewPage(this.state.firstPage+1)}}/>
                            </Pagination>        
                        ):null}
                        </div>
                }
            </div>:null}

        {/* </div> */}

        </div>);
    }
}


function Search(props) {
    return (
        <div>
            <Router>
                <Route exact path="/s/:category/:name" component={(props) => <SearchItems category={props.location.state.category} name={props.location.state.searchText} {...props} />} />                
                <Route path="/s/:category/:name/:item" component={Item} />


                <Route path="/cards/:category/:item" component={Item} />
                

            </Router>

        </div>);
}

export default Search;