import React from 'react';
import '../vendor/bootstrap/css/bootstrap.min.css';
import '../css/signup.css';
import {Form, Button, Modal} from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import { Redirect } from 'react-router-dom';

async function nameExists(name) {

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/name_exists', {
        method: 'POST',
        body: JSON.stringify({
            temp_name: name,
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });

    var data = await response.json();
    return data;
};

function register(obj){

        // fetch('http://localhost:8080/Project_11_war_exploded/register', {
            fetch('https://localhost:8443/Project_11_war_exploded/register', {
            method: 'POST',
            body: JSON.stringify({
                username: obj.username,
                password: obj.password,
                conpassword: obj.confirmpassword,
                first_name: obj.firstName,
                surname: obj.surname,
                email: obj.email,
                afm: obj.afm,
                phone_number: obj.phoneNumber,
                Location: obj.areaAddress,

                Country: "",
                Longitude: "",
                Latitude:  "" 

            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        })
}


class Singup extends React.Component{

    constructor(props){
        super(props);
        this.username = React.createRef();
        this.password = React.createRef();
        this.confirmpassword = React.createRef();
    
        this.firstName = React.createRef();
        this.surname = React.createRef();
        this.email = React.createRef();
        this.phoneNumber = React.createRef();
        this.areaAddress = React.createRef();
        this.afm = React.createRef();

        this.state={
            usernameValid: false,
            passwordConfirm: true,
            message: 'null',
            
            first_name: false,
            last_name: false,
            email: false,
            phone_number: false,
            area_address: false,
            afm: false,

            
            typing: false,
            
            typingFirstName: false,
            typingLastName: false,
            typingEmail: false,
            typingPhoneNumber: false,
            typingAreaAddress: false,
            typingAFM: false,


            show: false,
        }

    }
    


    componentDidMount() {
        document.title = "Sign up"
    }

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
    
    handleClose2 = () => {
        this.setState({
            show: false,
        });

        let path = '/';
        this.props.history.push(path);
    }

    handleButton = () =>{
        this.handleShow();
        if ((this.state.usernameValid === true && this.username.current.value !== '') &&
            (this.state.passwordConfirm === true && this.confirmpassword.current.value !== "") &&
            (this.firstName.current.value !== '') &&
            (this.surname.current.value !== '') &&
            (this.email.current.value !== '') &&
            (this.afm.current.value !== '') &&
            (this.areaAddress.current.value !== '') &&
            (this.phoneNumber.current.value !== '')) {
        
                var userObject = {
                    username: this.username.current.value,
                    password: this.password.current.value, 
                    confirmpassword: this.confirmpassword.current.value,
                    firstName: this.firstName.current.value,
                    surname: this.surname.current.value,
                    email: this.email.current.value,
                    phoneNumber: this.phoneNumber.current.value,
                    areaAddress: this.areaAddress.current.value,
                    afm: this.afm.current.value
                }
                register(userObject);
            }
    }
 

    
    
    userNameValidation = () =>{
        var user = this.username.current.value;

        if(user !== null){

            nameExists(user).then(data => {
                this.setState({ message: data })
                if(this.state.message.message === "name doesn't exist"){
                    this.setState({ usernameValid: true, typing: false });
                } else if (this.state.message.message === "name already exists"){
                    this.setState({ usernameValid: false });
                }else{
                    // console.log("Warning: An error may happened!!!")
                }
            });
        }
    }

    userTyping=()=>{
        this.setState({ 
            usernameValid: true,
            typing: true
        });
    }

    checkFirstPassword = () =>{
        const pass = this.password.current.value;
        const confirmpass = this.confirmpassword.current.value;
        
        if (pass === confirmpass) {
            this.setState({ passwordConfirm: true });
        } else {
            this.setState({ passwordConfirm: false });
        }
        
    }
    
    checkPassword = () => {
        const pass = this.password.current.value;
        const confirmpass = this.confirmpassword.current.value;
        
        if(pass === confirmpass && confirmpass !== ''){
            this.setState({passwordConfirm: true});
        }else{
            this.setState({ passwordConfirm: false });
        }
    }

    confirmPasswordTyping = () => {
        this.setState({ passwordConfirm: true });
    }


    TypingNow = (value) => {
        if (value.current === null) {
            alert(value.name)
        } else {
            if (value.current.name === 'first_name') {
                this.setState({
                    typingFirstName: true
                });
            }else if(value.current.name ==='last_name'){
                this.setState({typingLastName: true});
            }else if (value.current.name === 'email') {
                this.setState({ typingEmail: true });
            }else if (value.current.name === 'phone_number') {
                this.setState({ typingPhoneNumber: true });
            } else if (value.current.name === 'area_address') {
                this.setState({ typingAreaAddress: true });
            } else if (value.current.name === 'afm') {
                this.setState({ typingAFM: true });
            }


        }


    }

    checkValue = (value) => {
        if(value.current === null){
            alert(value.name)
        }else{
            if(value.current.name === 'first_name'){
                this.setState({first_name: true, typingFirstName: false})
            }else if (value.current.name === 'last_name'){
                this.setState({ last_name: true, typingLastName: false })
            }else if (value.current.name === 'email') {
                this.setState({ email: true, typingEmail: false })
            }else if (value.current.name === 'phone_number') {
                this.setState({ phone_number: true, typingPhoneNumber: false })
            }else if (value.current.name === 'area_address') {
                this.setState({ area_address: true, typingAreaAddress: false })
            }else if (value.current.name === 'afm') {
                this.setState({ afm: true, typingAFM: false })
            }
            
        }
    }

    /* Modal */
    launchModal = () => {
        return(<div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>);
    }

    render(){

        let CheckUsername, CheckFirst=null, CheckLast=null, CheckEmail=null, CheckPhoneNumber=null, CheckAreaAddress=null, CheckAFM=null;
        let nameStyle, firstStyle, lastStyle, emailStyle, phonernumberStyle, areaaddressStyle, afmStyle;



        if((this.state.usernameValid === false) && (this.username.current !== null) && (this.username.current.value !== '')){
            CheckUsername = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_">Username already exists.  <i className="fas fa-times"></i> </Form.Text></div>;
            nameStyle = { 'border': '1px solid #E00000' };

        } else if ((this.state.usernameValid === true) && this.username.current !== null && (this.username.current.value !== '') && this.state.typing === false){
            CheckUsername = <div style={{ position: "absolute", top: '2em', right:'0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            nameStyle = { 'border': '1px solid #008800' };
            
        } else if ((this.state.usernameValid === true) && this.username.current !== null && (this.username.current.value === '') && this.state.typing === false){
            CheckUsername = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> Username required <i className="fas fa-times"></i> </Form.Text></div>;
            nameStyle = { 'border': '1px solid #E00000' };
            
        }
        else{
            CheckUsername = null;
            nameStyle = null;
        }
        
        if ((this.state.first_name === true && this.firstName.current !== null && this.firstName.current.value === '' )){
            CheckFirst = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> First name required.  <i className="fas fa-times"></i> </Form.Text></div>;
            firstStyle = { 'border': '1px solid #E00000' }
        } else if (this.state.first_name === true && this.firstName.current !== null && this.firstName.current.value !== '' && this.state.typingFirstName === false){
            CheckFirst = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            firstStyle = { 'border': '1px solid #008800' };
        }

        if ((this.state.last_name === true && this.surname.current !== null && this.surname.current.value === '')) {
            CheckLast = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> Last Name required.  <i className="fas fa-times"></i> </Form.Text></div>;
            lastStyle = { 'border': '1px solid #E00000' }
        } else if (this.state.last_name === true && this.surname.current !== null && this.surname.current.value !== '' && this.state.typingLastName === false) {
            CheckLast = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            lastStyle = { 'border': '1px solid #008800' };
        }

        if ((this.state.email === true && this.email.current !== null && this.email.current.value === '')) {
            CheckEmail = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> Email required.  <i className="fas fa-times"></i> </Form.Text></div>;
            emailStyle = { 'border': '1px solid #E00000' }
        }else if (this.state.email === true && this.email.current !== null && this.email.current.value !== '' && this.state.typingEmail === false) {
            CheckEmail = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            emailStyle = { 'border': '1px solid #008800' };
        }

        if ((this.state.phone_number === true && this.phoneNumber.current !== null && this.phoneNumber.current.value === '')) {
            CheckPhoneNumber = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> Phone number required.  <i className="fas fa-times"></i> </Form.Text></div>;
            phonernumberStyle = { 'border': '1px solid #E00000' }
        }else if (this.state.phone_number === true && this.phoneNumber.current !== null && this.phoneNumber.current.value !== '' && this.state.typingPhoneNumber === false) {
            CheckPhoneNumber = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            phonernumberStyle = { 'border': '1px solid #008800' };
        }

        if ((this.state.area_address === true && this.areaAddress.current !== null && this.areaAddress.current.value === '')) {
            CheckAreaAddress = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> Area address required.  <i className="fas fa-times"></i> </Form.Text></div>;
            areaaddressStyle = { 'border': '1px solid #E00000' }
        }else if (this.state.area_address === true && this.areaAddress.current !== null && this.areaAddress.current.value !== '' && this.state.typingAreaAddress === false) {
            CheckAreaAddress = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            areaaddressStyle = { 'border': '1px solid #008800' };
        }

        if ((this.state.afm === true && this.afm.current !== null && this.afm.current.value === '')) {
            CheckAFM = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_"> AFM required.  <i className="fas fa-times"></i> </Form.Text></div>;
            afmStyle = { 'border': '1px solid #E00000' }
        }else if (this.state.afm === true && this.afm.current !== null && this.afm.current.value !== '' && this.state.typingAFM === false) {
            CheckAFM = <div style={{ position: "absolute", top: '2em', right: '0' }}><Form.Text style={{ color: '#008800' }} className="text-muted_"> <i className="fas fa-check"></i> </Form.Text></div>;
            afmStyle = { 'border': '1px solid #008800' };
        }


        return (
            <div>
                <MyNavbar />

                {localStorage.getItem('user') !== null ? (
                    <Redirect to='/' />
                ):
                <div className="container" id="containerForm" >
                    <br/>

                    <div className="card bg-light" id="formClass" >
                        <article className="card-body mx-auto" style={{ maxWidth: '400px' }}>
                            <h4 className="card-title mt-3 text-center">Create Account</h4>
                            <br />
 
                            <form className="singupForm">
                            
                                <div className="formLeft">
                                    
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend" >
                                            <span className="input-group-text"> <i className = "fas fa-at"></i>  </span>
                                        </div>
                                        <input style={nameStyle} className="form-control" placeholder="Username" type="text" onBlur={this.userNameValidation} onChange={this.userTyping} ref={this.username} /> 

                                        {CheckUsername}

                                    </div>


                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-user" /> </span>
                                        </div>

                                        <input style={firstStyle} name="first_name" ref={this.firstName} onBlur={() => this.checkValue(this.firstName)} onChange={()=>this.TypingNow(this.firstName)} className="form-control" placeholder="First Name" type="text" />
                                        
                                        {CheckFirst}
                                       
                                    </div>
                                    
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-user" /> </span>
                                        </div>
                                        <input style={lastStyle} ref={this.surname} onBlur={() => this.checkValue(this.surname)} onChange={() => this.TypingNow(this.surname)} className="form-control" name="last_name" placeholder="Surname" type="text" />
                                        
                                        {CheckLast}
                                    </div>

                                    
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-envelope" /> </span>
                                        </div>
                                        <input style={emailStyle} ref={this.email} name="email" onBlur={() => this.checkValue(this.email)} onChange={() => this.TypingNow(this.email)} className="form-control" placeholder="Email address" type="email" />
                                        
                                        {CheckEmail}

                                    </div>

                                    {/* Phone Number */}
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-phone" /> </span>
                                        </div>
                                        <input style={phonernumberStyle} ref={this.phoneNumber} name="phone_number" onBlur={() => this.checkValue(this.phoneNumber)} onChange={() => this.TypingNow(this.phoneNumber)} className="form-control" placeholder="Phone number" type="text" />
                                    
                                        {CheckPhoneNumber}
                                    </div>


                                    {/* Address */}
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-map-marker" /> </span>
                                        </div>
                                    
                                        <input style={areaaddressStyle} ref={this.areaAddress} name="area_address" onBlur={() => this.checkValue(this.areaAddress)} onChange={() => this.TypingNow(this.areaAddress)} className="form-control" placeholder="Area Address" type="address" />
                                            
                                        {CheckAreaAddress}

                                    </div>


                                    {/* AFM */}
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-address-card" /> </span>
                                        </div>
                                        <input ref={this.afm} style={afmStyle} name="afm" onBlur={() => this.checkValue(this.afm)} onChange={() => this.TypingNow(this.afm)} className="form-control" placeholder="AFM" type="afm" />
                                    
                                        {CheckAFM}

                                    </div>


                                    {/*Left form-group end.// */}
                                </div>
                                <div className="formRight">

                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-lock" /> </span>
                                        </div>
                                        <input onBlur={this.checkFirstPassword} className="form-control" placeholder="Password" type="password" ref={this.password}/>
                                    </div> {/* Password */}
                                    
                                    <div className="form-group input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text"> <i className="fa fa-lock" /> </span>
                                        </div>
                                        <input onBlur={this.checkPassword} onChange={this.confirmPasswordTyping} ref={this.confirmpassword} className="form-control" placeholder="Repeat password" type="password" />

                                        {((this.state.passwordConfirm === false) && (this.confirmpassword.current !== null) ) ?
                                            (<div style={{ position: "absolute", top: '2em',right: '0' }}><Form.Text style={{ color: '#E00000' }} className="text-muted_">Passwords don't match!<i className="fas fa-times"></i> </Form.Text></div>)
                                            : null}
                                    
                                    </div> {/* Confirm Password*/}
                                    <br /><br />

                                    <Button variant="primary" onClick={this.handleButton} block>
                                        Sign up
                                    </Button>
                                    
                                    <Modal show={this.state.show} onHide={this.handleClose}> 
                                       
                                        {((this.state.usernameValid === true && this.username.current.value !== '') && 
                                            (this.state.passwordConfirm === true && this.confirmpassword.current.value!=="") && 
                                            (this.firstName.current.value !== '') &&
                                            (this.surname.current.value !== '') &&
                                            (this.email.current.value !== '') &&
                                            (this.afm.current.value !== '') &&
                                            (this.areaAddress.current.value !== '') &&
                                            (this.phoneNumber.current.value !== '')                                            
                                            )?
                                        <div>
                                            <div>
                                                <Modal.Header>
                                                        <Modal.Title><h4 style={{ color: '#008800' }} >Thank you for filling out your information. <i className = "fas fa-check-circle"> </i></h4></Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Your form will be reviewed by our administrator and then you are good to go.</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="primary" onClick={this.handleClose2}>
                                                        OK
                                                    </Button>
                                                </Modal.Footer> 
                                            </div>
                                            
                                            {this.state.show === false ? <Redirect to='/' />: null} 
                                            
                                        </div>
                                        
                                        :<div>
                                            <Modal.Header closeButton>
                                                    <Modal.Title> <h4 style={{ color: '#E00000' }}>Your registration wasn't succesful. <i className="fas fa-times-circle"></i></h4> </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Please make sure you have filled the form correctly.</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                                            </Modal.Footer>
                                        </div>}

                                    </Modal>


                                </div>
                            </form>
                        </article>
                        <p style={{position: 'absolute', bottom: '0', right: '17%'}}>*All fields are required.</p>

                    </div>
                </div>}

      </div>
    );
  }
}

export default Singup;
