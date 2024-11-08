import React from "react";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './ParticlesBackground.css';

const ParticlesBackground = () => {
    const particlesOptions = {
        background: {
          color: {
              value: "#1a1a1a",
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: {
                    enable: false,
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 0.8,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 1000,
                },
                value: 80,
            },
            opacity: {
                value: 0.2,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
      }

    const particlesInit = useCallback(async engine => {
        // console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);
  
    // const particlesLoaded = useCallback(async container => {
    //     await console.log(container);
    // }, []);

    return (
        <div>
            <Particles
            className='particles'
            id="tsparticles"
            init={particlesInit}
            // loaded={particlesLoaded}
            options={particlesOptions}
        />
        </div>
    );
}

export default ParticlesBackground;