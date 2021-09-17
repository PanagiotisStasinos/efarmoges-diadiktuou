import React from 'react';
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../css/login.css';
import '../js/login.js';
import {Button, Modal} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import UsersTable from './Users';
import Admin from './Admin';


class LoginComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            response: "null",
            redirect: false,

            /* Modal */
            show:false,
            modalMessage: 'Username or password is invalid',
            modalColor: '#E00000',
            modalInvalid: true
        }
    }

    updateResponse = (name) => {
        localStorage.setItem('response', name);
        this.setState({
            response: name
        });
        
    };
    

    componentDidMount() {
        document.title = "Login"

        /* TESTING */
        const rememberMe = localStorage.getItem('response') !== 'null';
        const user = rememberMe ?  localStorage.getItem('response'): 'null';
        this.setState({ response: user });
        
        /* TESTING */

    }

    clearData(){
        localStorage.clear();
    }


    sendRequest(event) {
        event.preventDefault();

        var username = document.getElementById('inputUser').value;
        var password = document.getElementById('inputPassword').value;

        (async () => {
            // const rawResponse = await fetch('http://localhost:8080/Project_11_war_exploded/login', {
            const rawResponse = await fetch('https://localhost:8443/Project_11_war_exploded/login', {

                method: 'POST',
                body: JSON.stringify({ username: username, password: password }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8;",
                },

            }).then(response => response.json())
                .then(json => {

                    /* Check if the username and password are valid */
                    if(json.token === "null" && json.type === "null"){
                        this.setState({ modalMessage: 'Username or password is invalid.', modalColor: '#E00000', modalInvalid: true})
                        this.handleShow();
                    } else if (json.token === "null" && json.type === "unverified"){
                        this.setState({ modalMessage: 'Your information is being reviewed by our administrator and then you are good to go.Thank you for your patience.', modalColor: 'black', modalInvalid: false })
                        this.handleShow();
                    }else{
                        localStorage.setItem('user',username);              
                        localStorage.setItem('token', json.token);            
                        localStorage.setItem('userType', json.type);

                        localStorage.setItem('unread', '0');
                        
                        /* Redirect to the Home Page */
                        this.setState({redirect:true});
                    }
                });

        })();
    }

    updateRedir = (value) => {
        alert("Login.js:   Updating...." + value);


        this.setState({
            redirect: value
        });
    };



    /* Submit */
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

    render(){

        if(this.state.redirect === true && localStorage.getItem('userType') === 'admin'){

            /* Testing TEsting Testing - Not sure about this Router */
            return (<Router> 
                <Admin/>
                <Route path="/admin" component={UsersTable} />
                <Redirect to='/admin' /> 
            
            </Router>);

        } else if (this.state.redirect === true && localStorage.getItem('userType') === 'verified'){
            return <Redirect to='/' />;
        }


        return (
            <div>
                <MyNavbar />

                {localStorage.getItem('user') !== null ?(
                <div>
                    <Redirect to='/' /> 
                </div>) :
                <div>
                    
                    <h1> { this.state.redirect }</h1>

                    <div id="logreg-forms">

                        <form className="form-signin">
                            <h1 className="h3 mb-3 font-weight-normal" style={{ textAlign: 'center' }}> Sign in </h1>
                            <div className="input-group">
                                <input type="text" id="inputUser" className="form-control"  placeholder="Email address" required autoFocus />
                            </div>
                            <div className="input-group">
                                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                            </div>

                            <div className="input-group">
                                <button onClick={(e) => this.sendRequest(e)} className="btn btn-md btn-rounded btn-block form-control submit" /* href={"/signup"} */ type="submit"><i className="fas fa-sign-in-alt" /> Sign in</button>
                            </div>

                            <hr />

                            <div className="singupform" >
                                <a href={"/signup"} style={{color: 'black', textAlign: 'center'}}>
                                        <i className="fas fa-user-plus"></i> 
                                        Create Account
                                </a>
                            </div>

                        </form>

                        <form action="#" className="form-reset">
                            <input type="email" id="resetEmail" className="form-control" placeholder="Email address" required autoFocus />
                            <button className="btn  btn-primary btn-block" type="submit" style={{color: 'black'}}>Reset Password</button>
                            <a href="#" id="cancel_reset"><i className="fa fa-arrow-left" /> Back</a>
                        </form>
                    </div>

              

                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <div>
                            <Modal.Header closeButton>
                                <Modal.Title style={{minWidth: '70%'}}> 
                                    <h5 style={{ color: this.state.modalColor }} > {this.state.modalMessage} 
                                        {this.state.modalInvalid === true?
                                        <i className="fas fa-times" style={{marginLeft: '3%'}}></i>:null}
                                    </h5>
                                </Modal.Title>

                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </div>
                    </Modal>
                

                    {/* <div className="d-flex flex-column">
                        <div id="page-content" style={{ backgroundColor: 'black' }}>
                            <div className="container text-center">
                                <div className="row justify-content-center">
                                    <div className="col-md-7">
                                        <h1 className="font-weight-light mt-4 text-white">Sticky Footer using Flexbox</h1>
                                        <p className="lead text-white-50">Use just two Bootstrap 4 utility classes and three custom CSS rules
                        and you will have a flexbox enabled sticky footer for your website!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer id="sticky-footer" className="py-4 bg-dark text-white-50">
                            <div className="container text-center">
                                <small>Copyright © Your Website</small>
                            </div>
                        </footer>
                    </div> */}
            
                </div>}

            
        </div>);
    }
}

export default LoginComponent;