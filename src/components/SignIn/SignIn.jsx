import React from "react";
import GoogleSignIn from '../GoogleSignIn/GoogleSignIn';

class SignIn extends React.Component {
    constructor(props) {
        super();
        this.state = {
            signInEmail: '',
            signInPassword: '',
            error: ''
        };
    }

    handleKeypress = (e) => {
        if (e.which === 13){
            this.onSubmitSignIn();
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    onSubmitSignIn = () => {
        fetch('https://master.smart-brain-api.c66.me/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
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
            this.setState({ error: 'Error signing in' });
        });
    }

    render(){
        const { onRouteChange } = this.props;
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
                    <legend className="f2 fw6 ph0 mh0 center">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input onChange={this.onEmailChange} className="pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input onChange={this.onPasswordChange} className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
                    </div>
                    </fieldset>
                    <div className="mv3">
                        <div className="b">OR</div>
                        <GoogleSignIn />
                    </div>
                    <div className="">
                    <input 
                    onClick={this.onSubmitSignIn}
                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                    type="submit" 
                    value="Sign in"/>
                    </div>
                    <div className="lh-copy mt3">
                    <p onClick={() => onRouteChange('register')} className="f5 link dim black db pointer">Register</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;