import React from 'react'
import '../css/msg.css'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import MyNavbar from './MyNavbar';


const readStyle = {
    backgroundColor: 'lighgrey',
    position: 'relative'
}

async function getOutBox() {

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_outbox', {
        method: 'POST',
        body: JSON.stringify({
            _UserID: userID,
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    })

    var data = await response.json();
    return data;

};

async function deleteMessage(messageID) {

    var userID = localStorage.getItem('user');
    var tok = localStorage.getItem('token');

    var response = await fetch('http://localhost:8080/Project_11_war_exploded/delete_message', {
        method: 'POST',
        body: JSON.stringify({
            _UserID: userID,
            message_id: messageID,
            token: tok
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });

    var data = await response.json();
    return data;

};


export default class Outbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: null,

            messagesArray: [],
            currentMessage: '',

            textArray: [],
            currentUser: '',

            loading: true,
        }
    }

    componentDidMount() {

        /*Protected from guests  */
        if(localStorage.getItem('user') === null){
            return;
        }

        document.title = "Outbox"

        getOutBox().then(data => {

            this.setState({ messages: data })

            /* Check if session has expired */
            if ((data.hasOwnProperty('error'))) {
                alert("Your session has expired!");
                localStorage.clear();
                this.props.history.push('/login')
            }

            /* Check if the key exists */
            if (!(data.hasOwnProperty('outbox'))) {
                this.setState({ loading: false });
                return;
            }

            //render outbox 
            this.MyoutBox();
            this.setState({ loading: false });
        });

    }

    MyoutBox = () => {

        var msgs = this.state.messages.outbox;
        var Array = []

        var sender, date, msgValue, currentTime;

        /* Check if there are no messages in the outbox */
        if (msgs === null || msgs === "null") {
            return;
        }

        for (let i = msgs.length - 1; i >= 0; i--) {

            sender = msgs[i].Other_UserID;
            msgValue = msgs[i].text;
            date = msgs[i].time;

            currentTime = (msgs[i].time).substr((msgs[i].time).indexOf(' ') + 1);

            Array.push(
                <div  style={readStyle} className="chat_list active_chat" key={i} onClick={() => 
                    this.displayMessage(msgs[i].text, (msgs[i].time).substr((msgs[i].time).indexOf(' ') + 1), (msgs[i].time).substr(0, (msgs[i].time).indexOf(' ')), msgs[i].Other_UserID)}>

                    <button className="btn deleteMessageClass" onClick={(e) => this.handleChildClick(e, msgs[i].message_id)} >
                        <i className="fas fa-times fa-sm" ></i>
                    </button>

                    <div className="chat_people">
                        <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                        <div className="chat_ib">
                            <h5>{sender}<span className="chat_date">{date.substr(0, date.indexOf(' '))}</span></h5>

                            <p style={{ display: 'block', overflow: 'hidden', height: '20px', textOverflow: 'ellipsis' }}>{msgValue}</p>
                        </div>
                    </div>
                </div>
            );
        }

        this.setState({ messagesArray: Array })

    }


    displayMessage = (text, time, date,sender) => {

        this.setState({ currentMessage: text })

        var curArray = []

        curArray.push(
            <div key={time} className="incoming_msg">
                <div className="received_msg">
                    <div className="received_withd_msg">
                        <p>{text}</p>
                    <span className="time_date"> {time} | {date.substr(0, date.indexOf('-'))} {date.substr(date.indexOf('-') + 1, date.indexOf('-') - 1)} </span></div>
                </div>
            </div>
        );

        this.setState({ textArray: curArray })
        this.setState({ currentUser: sender })
    }


    handleChildClick = (e, messageID) => {
        e.stopPropagation();

        deleteMessage(messageID).then(data => {

            /* Check if the session has expired */
            if ((data.hasOwnProperty('error'))) {
                alert("Your session has expired!");
                localStorage.clear();
                this.props.history.push('/login')
            } else {
                window.location.reload();
            }
        });
    }





    render() {
        return (<div>
            <MyNavbar />

            {localStorage.getItem('user') === null ?
            <h1 style={{textAlign: 'center'}}>404 NOT FOUND</h1> :

            <div className="container boxmsg">
                <h3 className=" text-center"><b>Outbox</b></h3>

                <div className="messaging">
                    <div className="inbox_msg" style={{ borderRadius: '20px'}}>
                        <div className="inbox_people">

                            <div className="headind_srch">
                                <div className="recent_heading">
                                    <h4>Sended messages</h4>
                                </div>
                            </div>

                            <div className="inbox_chat">
                                {this.state.messagesArray.length === 0 && this.state.loading === false ? 
                                    <h6 style={{ textAlign: 'center' }}>No sended messages yet.</h6> 
                                    : this.state.messagesArray}
                            </div>
                        </div>

                        {/* Message text */}
                        <div className="mesgs" >
                            <div className="msg_history">
                                {this.state.textArray}
                            </div>
                        </div>

                    </div>
                </div>
            </div>}

        </div>)
    }
}

