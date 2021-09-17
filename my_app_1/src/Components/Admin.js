import React from 'react';
import {Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';


class Admin extends React.Component {

    componentDidMount(){
        document.title = "Admin";
    }

    adminout = () => {
        localStorage.clear();
    }

    async downloadJson() {

        var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_items', {
            method: 'POST',
            body: JSON.stringify({
                type: 'json'
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Content-Length": 10000000000

            },
        }).then(response => response.json())
            .then(response => {

                var newJSON = JSON.stringify(response);
                var escapedJSON = newJSON.replace(/#/g, "" );

                var dataStr = "data:text/json;charset=utf-8," + escapedJSON;

                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "item.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();                
            });
    }

    async downloadXml() {

        var response = await fetch('http://localhost:8080/Project_11_war_exploded/get_items', {
            method: 'POST',
            body: JSON.stringify({
                type: 'xml'
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8", "Accept": '*/*',
                "Content-Length": 10000000000
            },
        }).then(response => response.text())
        .then(data => {

            var element = document.createElement('a');
            var newXML = JSON.stringify(data);
            var escapedXML = newXML.replace(/#/g, "");

            element.setAttribute('href', 'data:text/plain; charset=utf-8,' + escapedXML);

            element.setAttribute('download', "items.xml");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    }

    render() {
        return (<div>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand >Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">

                    <Nav className="mr-auto" >
                        
                        <Nav.Link href="/admin/users" style={{ color: 'white'}}> Users </Nav.Link> 
                                             
                        <NavDropdown title="Download Files" id="basic-nav-dropdown">
                            <Nav.Link onClick={() => this.downloadJson()} style={{ color: 'black' }}> download JSON </Nav.Link>
                            <Nav.Link onClick={() => this.downloadXml()} style={{ color: 'black' }}> download XML </Nav.Link>
                        </NavDropdown>


                    </Nav>

                    <Nav>
                        <Nav.Link eventKey={2} onClick={this.adminout} href={'/'} style={{ color: 'white'}}>
                            Log out
                        </Nav.Link>
                    </Nav>

                </Navbar.Collapse>

            </Navbar>


            <Container style={{marginTop: '2em'}}>
               {/* {UsersTable} */}
               {/* <Users/> */}
            </Container>
        
        </div>)
    }
}


export default Admin
