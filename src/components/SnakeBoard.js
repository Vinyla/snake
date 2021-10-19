import React, { useState, useEffect } from 'react';
import { useInterval } from '../useInterval';
import Food from './Food';
import Snake from './Snake';
import coin from '../assets/images/coin.gif';

const FIELD_SIZE = 20;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

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

const SnakeBoard = () => {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [snakeDirection, setSnakeDirection] = useState(DIRECTION.RIGHT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // place snake and food
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

  const limitByField = (x) => {
    if (x >= FIELD_SIZE) {
      setGameOver(true);
      // delete 0
      return 0;
    }
    if (x < 0) {
      return FIELD_SIZE - 1;
    }
    return x;
  };

  const eatsFood = (head, randomFoodPosition) => {
    return randomFoodPosition.x === head.x && randomFoodPosition.y === head.y;
  };

  const newSnakePosition = (segments, direction) => {
    const [head] = segments;
    const newHead = {
      x: limitByField(head.x + direction.x),
      y: limitByField(head.y + direction.y)
    };
    if (eatsFood(newHead, randomFoodPosition)) {
      randomFoodPosition = {
        x: Math.floor(Math.random() * FIELD_SIZE),
        y: Math.floor(Math.random() * FIELD_SIZE)
      };
      setScore(score + 1);
      return [newHead, ...segments];
    } else {
      return [newHead, ...segments.slice(0, -1)];
    }
  };

  useInterval(() => {
    setSnake((segments) => newSnakePosition(segments, snakeDirection));
  }, 300);

  return (
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
        <img src={coin} alt='coin-gif'/>
        <h2>{score}</h2>
      </div>
    </div>
  );
};

export default SnakeBoard;
