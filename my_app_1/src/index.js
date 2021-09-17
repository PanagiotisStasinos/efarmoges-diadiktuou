import React from 'react';
import ReactDOM from 'react-dom';

import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FormControl from "react-bootstrap/FormControl";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import './index.css';
import MyNavbar from './Components/MyNavbar';
import FrontPage from './Components/FrontPage';
import Footer from './Components/Footer';
import FirstPage from './Components/First Page';
import LoginComponent from './Components/Login';
import Singup from './Components/Singup';
import Item from './Components/Item';
import CardsMenu from './Components/Cards'; 
import AuctionsManagement from './Components/AuctionsManagement';
import AuctionForm from './Components/Auctionform';
import UserAuctions from './Components/UserAuctions';
import AuthProvider from './Components/context/AuthContext';
import Search, { SearchItems } from './Components/Search';
import UsersTable from './Components/Users';




import Messaging from './Components/Messaging';
import SendMessage from './Components/SendMessage';
import Outbox from './Components/Outbox';
import AdvancedSearch from './Components/AdvancedSearch';
import Admin from './Components/Admin';



/* Material Ui  */

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';




class App extends React.Component{
    render(){
        return(
        <div>  
            <AuthProvider>
                {/* <MyNavbar /> */}
                <Router>

                    { localStorage.getItem('userType') === 'admin'?
                    <div> 
                        <Admin/>
                        <Route  path="/admin" component={UsersTable} />
                    </div>:

                    <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <Route exact path="/" component={FirstPage} /> 

                        <Route  path="/cards"  component={CardsMenu} />
                        
                        <Route path="/login" component={LoginComponent} />
                        <Route path="/signup" component={Singup} />

                        <Route path="/item" component={Item} />

                        <Route path="/users" component={UsersTable} />
                        
                        <Route path="/auctionform" component={AuctionForm} /> 

                        <Route path="/s/:category/:name" component={SearchItems} />  

                        <Route path="/advancedSearch" component={AdvancedSearch} />  


                        <Route path="/inbox" component={Messaging} />
                        <Route path="/outbox" component={Outbox} /> 
                        <Route path="/sendmsg" component={SendMessage} />


                        <Route exact path="/myItems" component={UserAuctions} /> 

                        <Route path="/myItems/auction/:item" component={AuctionsManagement} /> 

                    </MuiPickersUtilsProvider>

                      </div>}

                
                </Router> 

                <Footer/>
            </AuthProvider>
            
        </div>

        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
