import React, { useState, useEffect } from 'react';
import { useInterval } from '../useInterval';
import Food from './Food';
import Snake from './Snake';
import StartGame from './StartGame';

import coin from '../assets/images/coin.gif';
import snakeGif from '../assets/images/snake-gif.gif';
import logo from '../assets/images/snake-logo.png';

// constant
const FIELD_SIZE = 20;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];
const SNAKE_START = [{ x: 8, y: 8 }];
const DIRECTION = {
  RIGHT: { x: 1, y: 0 },
  LEFT: { x: -1, y: 0 },
  TOP: { x: 0, y: -1 },
  BOTTOM: { x: 0, y: 1 }
};

let randomFoodPosition = {
  x: Math.floor(Math.random() * FIELD_SIZE),
  y: Math.floor(Math.random() * FIELD_SIZE)
};

const SnakeGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [snake, setSnake] = useState(SNAKE_START);
  const [snakeDirection, setSnakeDirection] = useState();
  const [score, setScore] = useState(0);
  const [snakeSpeed, setSnakeSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // set food and snake on board
  const getItem = (x, y, snake) => {
    if (randomFoodPosition.x === x && randomFoodPosition.y === y) {
      return <Food />;
    }
    for (const segment of snake) {
      if (segment.x === x && segment.y === y) {
        return <Snake />;
      }
    }
  };

  // prevent crossing boundaries
  const crossingBoundaries = (x) => {
    if (x >= FIELD_SIZE || x < 0) {
      setSnakeSpeed(null);
      setGameOver(true);
      setIsPlaying(false);
    }
    if (x < 0) {
      return FIELD_SIZE - 1;
    }
    return x;
  };

  // food and snake at the same place
  const eatsFood = (head, randomFoodPosition) => {
    return randomFoodPosition.x === head.x && randomFoodPosition.y === head.y;
  };

  const newSnakePosition = (segments, direction) => {
    const [head] = segments;
    const newHead = {
      x: crossingBoundaries(head.x + direction.x),
      y: crossingBoundaries(head.y + direction.y)
    };
    // set new food position
    if (eatsFood(newHead, randomFoodPosition)) {
      // mish se ne smije pojavljivati na istom mjestu gdje je zmija
      randomFoodPosition = {
        x: Math.floor(Math.random() * FIELD_SIZE),
        y: Math.floor(Math.random() * FIELD_SIZE)
      };
      setScore(score + 1);
      // setSnakeSpeed(snakeSpeed - 10); ???
      return [newHead, ...segments];
    } else {
      return [newHead, ...segments.slice(0, -1)];
    }
  };

  // arrow snake control
  useEffect(() => {
    const moveSnake = (e) => {
      switch (e.keyCode) {
        case 38:
          setSnakeDirection(DIRECTION.TOP);
          break;
        case 40:
          setSnakeDirection(DIRECTION.BOTTOM);
          break;
        case 37:
          setSnakeDirection(DIRECTION.LEFT);
          break;
        case 39:
          setSnakeDirection(DIRECTION.RIGHT);
          break;
        default:
          setSnakeDirection();
          break;
      }
    };
    document.addEventListener('keydown', moveSnake);
    return () => {
      document.removeEventListener('keydown', moveSnake);
    };
  }, []);

  const playGame = () => {
    setIsPlaying(true);
    setSnake(SNAKE_START);
    setSnakeDirection(DIRECTION.RIGHT);
    setSnakeSpeed(300);
    setGameOver(false);
  };

  useInterval(() => {
    setSnake((segments) => newSnakePosition(segments, snakeDirection));
  }, snakeSpeed);

  return (
    <div className='game'>
      <div>
        <img className='logo' src={logo} alt='logo' />
      </div>
      <div>
        <img className='gif' src={snakeGif} alt='gif' />
      </div>
      {!isPlaying && (
        <StartGame playGame={playGame} gameOver={gameOver} score={score} />
      )}
      <div className='snake-board'>
        <div className='grid'>
          {FIELD_ROW.map((x) => (
            <div key={x}>
              {FIELD_ROW.map((y) => (
                <div className='box' key={y}>
                  {getItem(x, y, snake) || '∙'}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='status'>
          <img src={coin} alt='coin-gif' />
          <h2>{score}</h2>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
