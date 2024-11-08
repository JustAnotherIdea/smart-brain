import React from "react";

const Navigation = ({onRouteChange, isSignedIn}) => {
    if(isSignedIn) {
        return (
            <nav style={{
                display: 'flex', 
                justifyContent: 'flex-end',
                padding: '1rem'
            }}>
                <button 
                    onClick={() => onRouteChange('signout')}
                    className="link dim white b--transparent bg-transparent pointer"
                    style={{fontSize: '1rem'}}
                >
                    Sign Out
                </button>
            </nav>
        );
    } else {
        return (
            <nav style={{
                display: 'flex', 
                justifyContent: 'flex-end',
                gap: '1rem',
                padding: '1rem'
            }}>
                <button 
                    onClick={() => onRouteChange('signin')}
                    className="link dim white b--transparent bg-transparent pointer"
                    style={{fontSize: '1rem'}}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => onRouteChange('register')}
                    className="link dim white b--transparent bg-transparent pointer"
                    style={{fontSize: '1rem'}}
                >
                    Register
                </button>
            </nav>
        );
    }
}

export default Navigation;