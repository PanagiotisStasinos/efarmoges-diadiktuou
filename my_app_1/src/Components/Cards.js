

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Image from 'react-bootstrap/Image';
import { Container, Card, CardGroup, CardColumns, ListGroup, Breadcrumb, Col, Row, Pagination, Spinner } from 'react-bootstrap';

import MyPagination from './Pagination';
import SearchItems from './Search'
import noimage from '../img/noimage2.png'


import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';

import Timer from './Timer';
import ProductDetails from './ProductDetails';
import Item from './Item';
import MyNavbar from './MyNavbar';

import laptoppic from '../img/laptop.jpg';

import '../css/Cards.css';
import styles from '../css/Cards.css';
import { Button } from 'react-bootstrap';


import LoginComponent from './Login';

const divStyle = {
    "backgroundColor": 'white',
    "width": '20rem',
    "height": '27em',
    "maxHeight": '100%',
    'border': 'solid black 1px'
};

function ProductCard(props) {
    return (
        <div>
            <Card className="col-md" style={divStyle} >

                <Link to={{ pathname: "/cards/" + props.categPath + "/" + props.name, state: { Name: props.name, Id: props.Id } }} >
                    <Card.Img className="productimg" variant="top" src={noimage} />
                </Link>

                <Card.Body style={{ "height": '100%' }}>
                    <Link to={{ pathname: "/cards/" + props.categPath + "/" + props.name, state: { Name: props.name, Id: props.Id } }}  >{props.name}</Link>
                </Card.Body>

                <hr />

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
    // }  
}





/* Warning Testing class -------- to ------->  function*/
// class Cards extends React.Component {
function Cards() {
    // render(){
    const [cards, setCards] = useState([
        {
            title: 'Samsung Galaxy Note 9 -Unlocked-6GB RAM -Excellent Condition - Ocean Blue',
            currentPrice: '10$',
            bids: '10',
            time: '10m 10s',
            id: 1
        },
        {
            title: 'Samsung Galaxy S9',
            currentPrice: '20$',
            bids: '23',
            time: '20m 15s',
            id: 2
        },
        {
            title: 'Samsung Galaxy S10',
            currentPrice: '110$',
            bids: '30',
            time: '5m 10s',
            id: 3
        },
        {
            title: 'Samsung Galaxy S11',
            currentPrice: '50$',
            bids: '550',
            time: '40m 20s',
            id: 4
        }
    ]);

    const categoriesmenu = ["This is Samsung bitch!!! Do you have any problem?", "Apple", "Nokia", "Xiaomi", "Sony", "Other"];
    const categItems = [];
    for (let i = 0; i < categoriesmenu.length; i++) {
        categItems.push(<ListGroup.Item className="itemList" action href={categoriesmenu[i]}>{categoriesmenu[i]}</ListGroup.Item>);
    }


    const Items = [];
    var groupItems = [];
    var numItems = 4;


    for (let i = 0; i < numItems;) {
        for (let j = 0; j < 3; j++) {
            groupItems.push(<ProductCard name={cards[i].title} currentPrice={cards[i].currentPrice} bids={cards[i].bids} time={cards[i].time} />);
            i++;
            if (i + 1 > numItems) break;
        }
        Items.push(<CardGroup>{groupItems}</CardGroup>);
        groupItems = [];
    }


    return (<div>



        <div className="container-fluid pageContainer">

            <Row>
                <div className="col-3 sideMenu" >
                    <div className="categoriesList">
                        {/* <ListGroup  defaultActiveKey="#link1"> */}
                        <ListGroup>
                            {categItems}
                        </ListGroup>
                    </div>
                </div>

                <Col>
                    {Items}
                </Col>

            </Row>




            <MyPagination />
        </div>

    </div>
    );
    // }
}



async function getData(page, categPath) {

    var number_of_page = page.toString();

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/CategoryItems', {
        method: 'POST',
        body: JSON.stringify({
            upper_category: "",
            category: categPath,
            level: '0',
            number_of_items: '9',
            number_of_page: number_of_page,
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });


    var data = await response.json();
    return data;
};









class Category extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            dataset: '',
            ItemsArray: [],

            loading: true,

            /* Pagination */
            firstPage: 1,
            secondPage: 2,
            thirdPage: 3,

            firstActive: true,
            secondActive: false,
            thirdActive: false
        }
    }
    // const dataset;

    Items() {

        var RowItems = [];
        var ArrayLength = 0;


        var mycards = this.state.dataset.items;
        ArrayLength = mycards.length;

        var path = this.props.match.params.category;

        for (let i = 0; i < ArrayLength;) {
            for (let j = 0; j < 3; j++) {
                RowItems.push(<ProductCard key={mycards[i]['Name']} name={mycards[i]['Name']}
                    currentPrice={mycards[i]['Currently']}
                    bids={mycards[i]['Number_of_Bids']}
                    time={mycards[i]['Ends']}

                    categPath={path}

                    Id={mycards[i]['_ItemID']} />);
                i++;
                if (i + 1 > ArrayLength) break;
            }
            this.setState({ ItemsArray: [...this.state.ItemsArray, <CardGroup key={i}>{RowItems}</CardGroup>]})
            // this.state.ItemsArray.push(<CardGroup>{RowItems}</CardGroup>);
            RowItems = [];
        }
    }

    componentDidMount() {

        /*React Router 3 here...  */
        var categPath = this.props.match.params.category;

        getData(1, categPath).then(data => {
            this.setState({ dataset: data })
            // dataset = data
            //maybe call function
            this.Items();
            this.setState({ loading: false });
        });

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }

    getNewPage = (pageNumber) => {

        var categPath = this.props.match.params.category;

        getData(pageNumber, categPath).then(data => {
            this.setState({ dataset: data, ItemsArray: [] })

            this.Items();
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
                <MyNavbar />


                {/* <div className="container-fluid pageContainer"> */}
                {/* <Container> */}

                    <Row>
                        <div className="col-3 sideMenu" >
                            <div className="categoriesList">
                                {/* <ListGroup  defaultActiveKey="#link1"> */}
                                <ListGroup>
                                    {/* {categItems} */}
                                    {/* <ListGroup.Item className="itemList" action href="#link2">{categoriesItems}</ListGroup.Item> */}
                                    {/* <ListGroup.Item  className="itemList" action href="#link1">Here is a small message thas </ListGroup.Item>
                                <ListGroup.Item className="itemList" action href="#link2">Link 2</ListGroup.Item>
                                <ListGroup.Item action onClick={alertClicked}>This one is a button</ListGroup.Item> */}
                                </ListGroup>
                            </div>
                        </div>

                        <Col  style={{backgroundColor: 'white', }}>
                            {this.state.ItemsArray}


                        </Col>
                    </Row>

                    {this.state.loading === true ? <Spinner animation="border" variant="dark" style={{ position: 'absolute', left: '50%' }} /> : (
                        <Pagination className="cardsPagination">

                            <Pagination.Prev className={this.state.firstPage === 1 ? "disabled" : ""} onClick={() => { this.prevPage(); this.getNewPage(this.state.firstPage - 1) }} />

                            <Pagination.Item onClick={() => this.updatePageNumbers(1, this.state.firstPage)} className={this.state.firstActive === true ? "active" : ""}> {this.state.firstPage} </Pagination.Item>
                            <Pagination.Item onClick={() => { this.updatePageNumbers(2, this.state.secondPage); this.getNewPage(this.state.firstPage + 1); }} className={this.state.secondActive === true ? "active" : ""}> {this.state.secondPage} </Pagination.Item>
                            <Pagination.Item onClick={() => { this.updatePageNumbers(3, this.state.thirdPage); this.getNewPage(this.state.firstPage + 2) }} className={this.state.thirdActive === true ? "active" : ""}> {this.state.thirdPage} </Pagination.Item>

                            <Pagination.Next onClick={() => { this.nextPage(); this.getNewPage(this.state.firstPage + 1) }} />
                        </Pagination>
                    )}
                {/* </Container> */}
                {/* </div> */}

            </div>);
    }
}

function CardsMenu() {
    return (
        <div>
            <Router>

                <Route exact path='/cards' component={Cards} />
                <Route exact path="/cards/:category" component={Category} />

                <Route path="/cards/:category/:item" component={Item} />

                <Route path="/login" component={LoginComponent} />

                <Route path="/s/:category/:name" component={SearchItems} />


            </Router>
        </div>);
}

export default CardsMenu;


