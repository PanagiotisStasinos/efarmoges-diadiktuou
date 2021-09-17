import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import {Carousel, Container} from 'react-bootstrap';



import car4 from '../img/car4.png';
import car5 from '../img/car5.jpg';
import noimage from '../img/noimage2.png';

import collectibles from '../img/collectibles.jpg';
import computers from '../img/computers.jpg';
import movies from '../img/movies.jpg';
import clothing from '../img/clothing.jpg';




import hammer from '../img/hammer.jpg'


import MyNavbar from './MyNavbar';


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';




const useStyles1 = makeStyles({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

function MediaCard(props) {
    const classes = useStyles1();

    return (
        <Card className={classes.card}>
            
            <Link to={{ pathname: '/cards/' + props.category }}>

            <CardActionArea>
                <CardMedia className={classes.media} image={props.image}/>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.name}
                    </Typography>

                </CardContent>
            </CardActionArea>
            </Link>

            <CardActions>
                <Link to={{pathname: '/cards/' + props.category}} >
                    <Button size="small" color="primary" >
                        See items
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
}



function RecommendedItem(props) {
    const classes = useStyles1();

    return (
        <Card className={classes.card}>

            <Link to={{ pathname: "/cards/" + props.category + "/" + props.name, state: { Name: props.name, Id: props.Id } }} >

                <CardActionArea>
                    <CardMedia className={classes.media} image={noimage} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.name}
                        </Typography>

                    </CardContent>
                </CardActionArea>
            </Link>

            <CardActions>
                <Link to={{ pathname: "/cards/" + props.category + "/" + props.name, state: { Name: props.name, Id: props.Id } }} >
                    <Button size="small" color="primary" >
                        Item details
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
}




async function recommendedItems() {

    var username = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/RecommendedItems', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });

    var data = await response.json();
    return data;

};


class FirstPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            Dataset: '',
            ItemsArray: []
        }
    }

    componentDidMount(){
        if(localStorage.getItem('user') !== null){
            recommendedItems().then(data => {

                /* Check if the session has expired */
                if ((data.hasOwnProperty('error'))) {
                    alert("Your session has expired!");
                    localStorage.clear();
                    this.props.history.push('/login')
                }else{
                    this.setState({ Dataset: data });
                    this.recItems();
                }
            });;
        }
    }

    recItems() {
        var Rows = [];
        var ArrayLength = 0;
        this.setState({ ItemsArray: [] });
        var Ritems = this.state.Dataset.items;

        ArrayLength = Ritems.length;

        var categ, name, itemID;

        for (let i = 0; i < ArrayLength; i++) {
            name = Ritems[i].Name;
            categ = Ritems[i].Category;
            itemID = Ritems[i]._ItemID;
            // categ = this.state.
            Rows.push(<Grid xs={4} item key={i}>
                <RecommendedItem  name={name} category={categ} Id={itemID} />
            </Grid>);

        }
        this.setState({ auctionsArrray: Rows });
        Rows=[];

    
    }

    render() {
        return (<div>
            <MyNavbar />


            {/* <Container> */}
                <Carousel style={{marginTop: '0%'}}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100" style={{width: '100%', maxHeight: '400px'}}
                            src={hammer}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>Welcome to stosfyri.com</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100" style={{ width: '100%', maxHeight: '400px' }}
                            src={car4}
                            alt="Third slide"
                        />

                        <Carousel.Caption >
                            <h3 style={{color: 'black'}}>Buy and sell staff with just a click.</h3>
                            <p style={{color: 'black'}} >Choose from over 40.000 products.</p>
                        </Carousel.Caption>
                        
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100" style={{ width: '100%', maxHeight: '400px' }}
                            src={car5}
                            alt="Third slide"
                        />

                        <Carousel.Caption style={{left: '-10%'}}>
                            <h3 style={{color: 'black'}}>Easy and secure transactions.</h3>
                            <p style={{color: 'black'}}>We take very seriously the protection of your personal data.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>

            {/* </Container> */}


            <Container style={{marginTop: '4%'}}> 
                <h4>Most popular categories</h4>

                <Grid item xs={12}>
                    <Grid container justify="center" spacing={1}>
                        <Grid xs={3} item >
                            <MediaCard name={'Movies & Television'} image={movies} category="Movies & Television" />
                        </Grid>
                        <Grid xs={3} item>
                            <MediaCard name={'Collectibles'} image={collectibles} category="Collectibles"/>
                        </Grid>
                        <Grid xs={3} item>
                            <MediaCard name={'Computers'} image={computers} category="Computers"/>
                        </Grid>
                        <Grid xs={3} item>
                            <MediaCard name={'Clothing'} image={clothing} category="Clothing & Accessories" />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>




            {/*Recommended items  */}
            
            {localStorage.getItem('user') !== null ?

                <Container style={{ marginTop: '4%' }}>
                    <h4>Recommended items for you </h4>

                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={4} >
                            {this.state.auctionsArrray}
                        </Grid>
                    </Grid>
                    
                </Container>
                :null}



            {/* <Router>
                <div className="FirstPage??" style={{position: 'absolute', left: '50%'}}>
                    <a href={'/Cards'} style={{color: 'white'}}> Hello Friend</a>
                    
                    <Route path='/' exact={true} />
                    <Route path='/Cards' exact={true}  render={
                        () => {
                            return (<h1>This should be the Card Component</h1>);
                        }
                    } />
                </div>
            </Router>  */}

        </div>);
    }
}
export default FirstPage