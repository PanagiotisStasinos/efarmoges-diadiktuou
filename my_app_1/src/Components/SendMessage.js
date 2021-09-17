import React from 'react';
import MyNavbar from './MyNavbar';
import {withRouter} from 'react-router-dom';
import { Button } from 'react-bootstrap';


async function sendMessageRequest(msg, receiver) {
    if(receiver === ""){
        return;
    }

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/send_message', {
        method: 'POST',
        body: JSON.stringify({

            _UserID: userID,
            token: tok,
            
            text: msg,
            Other_UserID: receiver
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });

    var data = await response.json();
    return data;
};

class SendMessage extends React.Component {

    constructor(props) {
        super(props);

        this.userId = React.createRef();
        this.messageText = React.createRef();
        this.userReceiver = React.createRef();

        this.state = {
            username: ""
        }    
    }

    componentDidMount() {
        document.title = "Send message";
        if (this.props.location.state !== undefined) {
            this.setState({
                username: this.props.location.state.user,
            })
        }
    }

    componentWillUnmount() {
        this.setState({username: ""})
    }


    sendMyMessage(msg, receiver){

        sendMessageRequest(msg, receiver).then(data => {
            if ((data.hasOwnProperty('error'))) {
                alert("Your session has expired!");
                localStorage.clear();
                this.props.history.push('/login')
            }else{
                window.location.reload();
            }
        });
    }

    
    
    render() {
        return (<div>

            <MyNavbar />

            {localStorage.getItem('user') === null ?
            <h1 style={{textAlign: 'center'}}>404 NOT FOUND</h1> :

            <div className="container">
                <h2 className="text-center">Send message</h2>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 pb-5">

                        <form>
                            <div className="card border-primary rounded-0">
                                <div className="card-header p-0">
                                    <div className="bg-info text-white text-center py-2">
                                        <h3><i className="fa fa-envelope" /> Create message</h3>
                                    </div>
                                </div>
                                
                                <div className="card-body p-3">
                                    <div className="form-group">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                        <div className="input-group-text"><i className="fa fa-user text-info" /></div>
                                        </div>
                                        <input ref={this.userReceiver} defaultValue={this.state.username} type="text" className="form-control" id="nombre" name="nombre" placeholder="Contact user"  required />
                                    </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text" ><i className="fa fa-comment text-info" /></div>
                                            </div>
                                            <textarea ref={this.messageText} className="form-control" rows="3" placeholder="Type message..." required defaultValue={""} />
                                        </div>
                                    </div>

                                    <Button variant="primary" onClick={() => this.sendMyMessage(this.messageText.current.value, this.userReceiver.current.value)} block>
                                        Send
                                        <i className = "fas fa-paper-plane"></i>
                                    </Button>

                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>}

        </div>)
    }
}

export default withRouter(SendMessage);
