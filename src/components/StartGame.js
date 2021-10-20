import React from "react";
import snakeGif from '../assets/images/snake-gif.gif';

const StartGame = (props) => {
 return (
   <div className='start'>
     <div className='button-div'>
       {props.gameOver && <div className='score'>Your total score is: {props.score}</div>}
       <button onClick={props.playGame}>
         {props.gameOver ? 'Play Again' : 'Play Game'}
       </button>
     </div>
   </div>
 );
}

export default StartGame;