import SnakeBoard from './components/SnakeBoard';
import snakeGif from './assets/images/snake-gif.gif';
import logo from './assets/images/snake-logo.png';

function App() {
  return (
    <div className='App'>
      <div>
        <img className='logo' src={logo} alt='logo' />
      </div>
      <div>
        <img className='gif' src={snakeGif} alt='gif' />
      </div>
      <SnakeBoard />
    </div>
  );
}

export default App;
