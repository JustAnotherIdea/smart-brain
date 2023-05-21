import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const particlesOptions = {
  background: {
    color: {
        value: "#0d47a1",
      },
  },
  fpsLimit: 120,
  interactivity: {
      events: {
          onClick: {
              enable: true,
              mode: "push",
          },
          onHover: {
              enable: true,
              mode: "repulse",
          },
          resize: true,
      },
      modes: {
          push: {
              quantity: 4,
          },
          repulse: {
              distance: 90,
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
          opacity: 0.5,
          width: 1,
      },
      collisions: {
          enable: true,
      },
      move: {
          directions: "none",
          enable: true,
          outModes: {
              default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
      },
      number: {
          density: {
              enable: true,
              area: 800,
          },
          value: 150,
      },
      opacity: {
          value: 0.5,
      },
      shape: {
          type: "circle",
      },
      size: {
          value: { min: 1, max: 5 },
      },
  },
  detectRetina: true,
}

function App() {
  const particlesInit = useCallback(async engine => {
      console.log(engine);
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
      await console.log(container);
  }, []);
  
  return (
    <div className="App">
      <Particles
            className='particles'
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesOptions}
        />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*<FaceRecognition />*/}
    </div>
  );
}

export default App;
