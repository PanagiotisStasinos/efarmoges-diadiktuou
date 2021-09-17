import React from 'react';
import {Form, Button, Container, Col, Modal } from 'react-bootstrap';
import MyNavbar from './MyNavbar';



class AdvancedSearch extends React.Component {

    constructor(props){
        super(props);

        this.Name = React.createRef();
        this.Description = React.createRef();
        this.MaxPrice = React.createRef();
        this.MinPrice = React.createRef();
        this.Categ = React.createRef();
        this.Location = React.createRef();


        this.state={
            /* Modal */
            show: false,
            modalMessage: ''
        }
    }

    handleSearch = () =>{

        var Name = this.Name.current.value;
        var MaxP = this.MaxPrice.current.value;
        var MinP = this.MinPrice.current.value;
        var Desc = this.Description.current.value;
        var Location = this.Location.current.value;

        var Categ = this.Categ.current.value;



        /* Check if max and min price have negative value - Advanced Search */
        if (MinP < 0) {
            this.setState({ modalMessage: 'Minimum price is invalid.' })
            this.handleShow();
            return;
        }
        if (MaxP < 0) {
            this.setState({modalMessage: 'Maximum price is invalid.'})
            this.handleShow();
            return;
        }

        var Namepath;   
        
        if(Name === ""){
            Namepath = "empty"
        }else{
            Namepath = Name;
        }

        let path = '/s/' + Categ + "/" + Namepath;
        this.props.history.push({ pathname: path, state: { category: Categ, searchText: Name, Desc: Desc, minPrice: MinP, maxPrice: MaxP, Locat: Location} });  /* TESTING TESTING TESTING */
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




    render() {
        return (<div>
                
            <MyNavbar />
            
            <Container  style={{backgroundColor: '#F5F5F5', height: '37em', borderRadius: '20px', border: '1px solid black'}}>
                <h3 style={{textAlign: 'center', paddingTop: '2%'}}> <b>Advanced Search </b></h3>
                <Form>

                    <Form.Group controlId="formName">
                        <Form.Label><i><b>Name </b></i></Form.Label>
                        <Form.Control ref={this.Name} type="text" placeholder="Enter search text" />
                    </Form.Group>

                    <Form.Row style={{ marginTop: '1em' }}>
                        <Col xs={3}>
                            <Form.Label><i><b>Category </b></i></Form.Label>
                            <Form.Control ref={this.Categ} as="select">

                                <option>Collectibles</option>
                                <option>Movies & Television</option>
                                <option>Clothing & Accessories</option>
                                <option>Computers</option>
                                <option>Pottery & Glass</option>
                                <option>Stamps</option>
                                <option>Consumer Electronics</option>
                                <option> Music </option>     

                            </Form.Control>
                        </Col>
                    </Form.Row>


                    <Form.Row style={{marginTop: '1em'}}>
                        <Col xs={2}>
                            <Form.Label><i><b>Min Price </b></i></Form.Label>
                            <Form.Control type="number" min="0" ref={this.MinPrice} />
                        </Col>
                        <Col xs={2}>
                            <Form.Label><i><b>Max Price </b></i></Form.Label>
                            <Form.Control type="number" min="0" ref={this.MaxPrice} />
                        </Col>
                    </Form.Row>


                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Label><i><b>Location </b></i></Form.Label>
                                <Form.Control ref={this.Location} placeholder="Search for location" />
                            </Col>
                        </Form.Row>
                    </Form>


                    <Form.Group controlId="formDescription" style={{marginTop: '1em'}}>
                        <Form.Label><i><b>Description </b></i></Form.Label>
                        <Form.Control ref={this.Description} placeholder="Enter description text" as="textarea" rows="3" />
                    </Form.Group>

                    <Button variant="primary" onClick={this.handleSearch} style={{ position: 'absolute', left: '35%', width: '30%', borderRadius: '50px' }}>
                        Search
                    </Button>
                 
                </Form>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <div>
                        <Modal.Header closeButton>
                            <Modal.Title><h5 style={{ color: '#E00000' }} > {this.state.modalMessage} <i className="fas fa-times"></i> </h5></Modal.Title>

                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>

            </Container>
            
        </div>);
    }
}


export default AdvancedSearch;