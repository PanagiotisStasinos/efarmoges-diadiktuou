import React from 'react';
import Timer from './Timer';

import {useContext} from 'react';
import Secret from './Secret';

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';


import {AuthContext} from './context/AuthContext';

// class ProductDetails extends React.Component{

function test(){
    alert("This is a test alert!")
}



function ProductDetails() {
    
    const Auth = useContext(AuthContext);
    
        var user = "";
        // if(user == "Bobby")

        return(
        <div>
                <AuthContext.Consumer>
                
                    {(context) =>(
                        <React.Fragment>
                            <h3> Good Morning! </h3>
                            <p>Hello I am inside the Product Details Component: {context.username}  </p>
                            user = {context.username}
                            <h4>---> {user} </h4>
                            {/* {context.updateUser} */}
                            {/* {test()} */}
                            <button onClick={() => context.updateUser("Bobby!") }>Press It.</button>
                            {/* <div className={context.updateUser("Me")}></div> */}

                            {/* if(context.username == "Bobby"){
                                <h3>Hi Bobby</h3>
                            } */}

                            <button href={"/product/secret"}>Secret Root!</button>


                            <p>Hello I am inside the Product Details Component: {context.username}  </p>


                        </React.Fragment>
                    )}

                </AuthContext.Consumer>
                <h1> Good Afternoon </h1>
        </div> 

        );
    }

export default ProductDetails