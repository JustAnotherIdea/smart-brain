import React from "react";
import GoogleSignIn from '../GoogleSignIn/GoogleSignIn';

class Register extends React.Component {
    constructor(props) {
        super();
        this.state = {
            email: '',
            password: '',
            name: '',
            error: ''
        };
    }

    handleKeypress = (e) => {
        if (e.which === 13){
            this.onSubmitNewUser();
        }
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    onSubmitNewUser = () => {
        fetch('https://master.smart-brain-api.c66.me/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                this.props.loadUser(data);
                this.props.onRouteChange('home');
            } else {
                this.setState({ error: data });
            }
        })
        .catch(err => {
            this.setState({ error: 'Error registering user' });
        });
    }

    render() {
        const { error } = this.state;
        return (
            <div className="br3 ba mv4 w-100 w-50-m w-25-l mw6 shadow-5 center" onKeyDown={this.handleKeypress}>
                <div className="measure">
                    {error && (
                        <div className="dark-red b mb3 tc">
                            {error}
                        </div>
                    )}
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f2 fw6 ph0 mh0 center">Register</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                        type="text" 
                        name="name"  
                        id="name"
                        onChange={this.onNameChange}/>
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" 
                        type="email" 
                        name="email-address"  
                        id="email-address"
                        onChange={this.onEmailChange}/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
                        type="password" 
                        name="password"  
                        id="password"
                        onChange={this.onPasswordChange}/>
                    </div>
                    </fieldset>
                    <div className="mb3">
                    <input 
                    onClick={this.onSubmitNewUser}
                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                    type="submit" 
                    value="Register"/>
                    </div>
                    <div className="mv3">
                        <div className="b">OR</div>
                        <GoogleSignIn />
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;