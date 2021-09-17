import React, { Fragment, useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";


import {Container} from 'react-bootstrap';
import MyNavbar from './MyNavbar';

function Test(props) {
    const [selectedDate, handleDateChange] = useState(new Date());


    return (<div>
        
        <MyNavbar/>

        <Container>
            <div style={{backgroundColor: 'white'}}>    
                
                <Fragment>
                    <KeyboardDatePicker
                        clearable
                        value={selectedDate}
                        placeholder="10/10/2018"
                        onChange={date => handleDateChange(date)}
                        minDate={new Date()}
                        format="MM/dd/yyyy"
                    />

                    <KeyboardDatePicker
                        placeholder="2018/10/10"
                        value={selectedDate}
                        onChange={date => handleDateChange(date)}
                        format="yyyy/MM/dd"
                    />
                </Fragment>
                
            </div>    

        </Container>

        
        </div>);
}

export default Test;
