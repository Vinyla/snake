import React, { useState } from 'react';
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

let snakeDirection = DIRECTION.RIGHT;

let randomFoodPosition = {
  x: Math.floor(Math.random() * FIELD_SIZE),
  y: Math.floor(Math.random() * FIELD_SIZE)
};

const SnakeGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [snake, setSnake] = useState(SNAKE_START);
  const [score, setScore] = useState(0);
  const [snakeSpeed, setSnakeSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // set food and snake on board
  const getItem = (x, y, snake, randomFoodPosition) => {
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

  // food and snake at the same place return true
  const eatsFood = (head, randomFoodPosition) => {
    return randomFoodPosition.x === head.x && randomFoodPosition.y === head.y;
  };

  // snake position
  const newSnakePosition = (segments, direction) => {
    const [head] = segments;
    // check if the head position crossing body position
    let biteItself = false;
    if (segments.length >= 2) {
      biteItself = segments.some((tail, index) => {
        if (index !== 0) {
          return tail.x === segments[0].x && tail.y === segments[0].y;
        } else {
          return false;
        }
      });
    }
    if (biteItself) {
      setSnakeSpeed(null);
      setIsPlaying(false);
      setGameOver(true);
    }
    const newHead = {
      x: crossingBoundaries(head.x + direction.x),
      y: crossingBoundaries(head.y + direction.y)
    };
    if (eatsFood(newHead, randomFoodPosition)) {
      randomFoodPosition = {
        x: Math.floor(Math.random() * FIELD_SIZE),
        y: Math.floor(Math.random() * FIELD_SIZE)
      };
      setScore(score + 1);
      setSnakeSpeed(snakeSpeed - 10);
      return [newHead, ...segments];
    } else {
      return [newHead, ...segments.slice(0, -1)];
    }
  };

  const setSnakeDirection = (direction) => {
    snakeDirection = direction;
  };

  // arrow snake control
  const moveSnake = (e) => {
    switch (e.keyCode) {
      case 38:
        if (snakeDirection !== DIRECTION.BOTTOM) {
          setSnakeDirection(DIRECTION.TOP);
        }
        break;
      case 40:
        if (snakeDirection !== DIRECTION.TOP) {
          setSnakeDirection(DIRECTION.BOTTOM);
        }
        break;
      case 37:
        if (snakeDirection !== DIRECTION.RIGHT) {
          setSnakeDirection(DIRECTION.LEFT);
        }
        break;
      case 39:
        if (snakeDirection !== DIRECTION.LEFT) {
          setSnakeDirection(DIRECTION.RIGHT);
        }
        break;
      default:
        break;
    }
  };

  // start game
  const playGame = () => {
    setIsPlaying(true);
    setSnake(SNAKE_START);
    setSnakeSpeed(300);
    setGameOver(false);
    setScore(0);
  };

  useInterval(() => {
    setSnake((segments) => newSnakePosition(segments, snakeDirection));
  }, snakeSpeed);

  document.addEventListener('keyup', moveSnake);

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
                  {getItem(x, y, snake, randomFoodPosition) || '∙'}
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
