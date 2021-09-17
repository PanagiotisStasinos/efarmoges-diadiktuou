import React, {useState} from 'react'
export const AuthContext = React.createContext();



class AuthProvider extends React.Component {

    constructor(props) {
        super(props);

        
        this.state = {
            username: "",
            isAuth: "false"

        };
    }


    updateUser = (name) => {
        this.setState({
            username: name,
            isAuth: "true"
        });  
    };

    doSomething = (name) => {
        alert(name)
    };
    

    updateState() {
        this.setState({ age: this.state.age + 1 });
    }

    render() {
        return (
            <AuthContext.Provider value={{
                username:this.state.username, 
                updateUser: this.updateUser,
                }}>

                {this.props.children}
            </AuthContext.Provider>

        );
    }
}



export default AuthProvider;
