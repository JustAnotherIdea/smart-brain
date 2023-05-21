import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="tilt">
                <div className="tilt">
                    <img alt='logo'src={brain} width="80px" height="80px" style={{paddingTop: "10px"}}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;