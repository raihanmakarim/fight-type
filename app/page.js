"use client";
import React, {
  useState, useEffect, useRef 
} from "react";
import HealthBar from "./component/HealthBar";

import idle from "../public/idle.png";
import prepare_jab from "../public/prepare_jab.png";

import jab from "../public/jab.png";

import Image from 'next/image';
import Opponent_iddle from "../public/Opponent_iddle.png";
import Opponent_jab from "../public/Opponent_jab.png";
import Opponent_prepare_jab from "../public/Opponent_prepare_jab.png";

const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random?minLength=200&maxLength=240";



const Word = React.memo(function Word(props) {
  const {
    word, activeWord, correct 
  } = props;



  let className = "word";
  if (activeWord) {
    className += " text-blue-500";
  }
  if (correct) {
    className += " text-green-500";
  }
  if (!correct) {
    className += " text-black";
  }

  return <div className={`quote-display ${className}`}>{word} </div>;
});


// const Timer = React.memo(function Timer() {
//   const [ seconds, setSeconds ] = useState(0);
//   const [speed , setSpeed] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
//   const [wordCount, setWordCount] = useState(0);
//   const [correctWordCount, setCorrectWordCount] = useState(0);
//   const [accuracy, setAccuracy] = useState(0);
//   const [wpm, setWpm] = useState(0);

  
//   return <div className="timer">{seconds}</div>;
// });



const Boxer = ({
  isTransitioning, images, stopIndex = 2 , right,left,bottom, zIndex,width =600,height =600,className
}) => {
  const [ currentImageIndex, setCurrentImageIndex ] = useState(0);
  const imagePaths = images;

  useEffect(() => {
    let interval = null;

    if (isTransitioning) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          if (prevIndex === imagePaths.length - 1) {
            return 0; 
          }
          else {
            return prevIndex + 1; 
          }
        });
      }, 150); 
    }

    if (currentImageIndex === stopIndex) {
      setCurrentImageIndex(0); 
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval); 
    };
  }, [ isTransitioning ]);

  return (
    <Image
      src={imagePaths[currentImageIndex]}
      width={width}
      height={height}
      alt="Picture of the author"
      style={{
        position: "absolute", right: right, left: left, bottom: bottom, zIndex: zIndex ,userSelect: "none"
      }}
      className={className ? className : ""}
    />
  );
};


const TypeFastGame = () => {
  const [ quoteInput, setQuoteInput ] = useState("");
  
  const quoteInputElement = useRef(null);
  const [ activeWordIndex, setActiveWordIndex ] = useState(0);
  const quoteContentRef = useRef("");
  const correctWordsRef = useRef([]);
  const enemyHp = useRef(100);
  const [ isTransitioningEnemy, setIsTransitioningEnemy ] = useState(false);
  const [ isTransitioning, setIsTransitioning ] = useState(false);
  const myBoxer = [ idle, prepare_jab, jab ];
  const enemyBoxer = [ Opponent_iddle,Opponent_prepare_jab, Opponent_jab ];
  const [ myHp, setMyHp ] = useState(100);
  const [ gameOver, setGameOver ] = useState(false);
  const [ startGame, setStartGame ] = useState(false);
  const [ timeoutValue, setTimeoutValue ] = useState(3);
  const [ lastWordLength, setLastWordLength ] = useState(0);
  const [ isShaking, setIsShaking ] = useState(false);

  
  useEffect(() => {
    if (enemyHp.current <= 0 || myHp <= 0) {
      setGameOver(true);
    }
  }, [ enemyHp.current, myHp ]);

  useEffect(() => {
    if (gameOver) {
      resetGame();
    }
  }, [ gameOver ]);


  useEffect(() => {
    let timeout;
    let interval;

    if (startGame) {
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          setMyHp((prevCount) => {
            if (prevCount <= 0) {
              clearInterval(interval);
              return prevCount;
            }

            const deduction = Math.floor(Math.random() * 6) + 5;
            const newCount = prevCount - deduction;
            return newCount;
          });

          setIsTransitioningEnemy(true);
          setTimeout(() => {
            setIsTransitioningEnemy(false);
          }
          , 450);

          setIsShaking(true)
   

        }, 1000);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [ startGame ]);

  useEffect(() => {
    if (startGame && timeoutValue > 0) {
      const timer = setInterval(() => {
        setTimeoutValue((prevValue) => prevValue - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }

    if(!startGame){
      getRandomQuote()
    }
  }, [ startGame, timeoutValue ]);

  useEffect(() => {
    if (isShaking) {
      document.querySelector('.wrapper').classList.add('shake-animation');

      setTimeout(() => {
        setIsShaking(false);
        document.querySelector('.wrapper').classList.remove('shake-animation');
      }, 1000);
    }
  }, [ isShaking ]);


  
  const resetGame = () => {
    setActiveWordIndex(0);
    correctWordsRef.current = [];
    setQuoteInput("");
    setMyHp(100);
    enemyHp.current = 100;
    setGameOver(false);
    setStartGame(false);
    setTimeoutValue(3);
    setLastWordLength(0);

  };

  console.log("lastWordLength", quoteContentRef.current);

  const displayText = () => {
    const text = quoteContentRef.current?.split(" ");
    console.log("text", text)
    if (!text) {
      return null;
    }

    const firstLength = text[0].length;
  
    return (
      <div className="quote-wrapper">
        <div className="quote-container" style={{ left: `calc(50% - ${(lastWordLength * 15) + (activeWordIndex* 10) }px  - ${(firstLength * 6)}px)` }}>
          {text.map((word, index) => { 
            if ( word === ""){
              return null
            }
            return(
              <Word
                key={index}
                word={word}
                activeWord={index === activeWordIndex}
                correct={correctWordsRef.current[index]}
              />
            )
          })}
        </div>
      </div>
    );
  };

  const getRandomQuote = async () => {
    try {
      const response = await fetch(RANDOM_QUOTE_API_URL);
      const data = await response.json();
      const content = data.content.toLowerCase().replace(/[^a-z\s]+/g, '');
      quoteContentRef.current = content;
      return Promise.resolve(content);
    }
    catch (error) {
      console.error("Error fetching random quote:", error);
      return Promise.reject(error);
    }
  };


  const handleUserInput = (value) => {
    if (value.endsWith(" ")) {
      const lastWord = quoteContentRef.current.split(" ")[activeWordIndex];
      if (lastWord === value.trim() && timeoutValue <= 1 ) {
        setActiveWordIndex((prevIndex) => prevIndex + 1);
        correctWordsRef.current = [ ...correctWordsRef.current, value.trim() ];
        setLastWordLength(lastWordLength + lastWord.length);
        enemyHp.current -= lastWord.length;
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }
        , 450);
      }
      setQuoteInput("");
    }
    else {
     
      setQuoteInput(value);
    }
  };

 

  



  return (
    <div className="wrapper">
      <div className="flex justify-center items-center font-bold absolute top-0	w-full z-30 	 gap-12 h-16 "> 
        <HealthBar color="red" health={enemyHp.current} />
        <h1 className="text-yellow-500ss text-2xl   ">VS</h1>
        <HealthBar color="green" health={myHp} />
      </div>
      {/* <Boxer className={startGame && " in-animation bounce-animation "} images={myBoxer} isTransitioning={isTransitioning} right="calc(50% - 240px - 50px)" bottom="10%" zIndex={20} /> */}
      {/* <Boxer className={startGame && "bounce-animation2"} images={enemyBoxer} isTransitioning={isTransitioningEnemy} right="calc(50% - 350px - 50px)" bottom="8%" height={700} width={700} zIndex={1} /> */}

      <Boxer className={startGame && "bounce-animation transition "} images={myBoxer} zIndex={20} isTransitioning={isTransitioning} right={ `calc((50% - 240px - 50px) * (${timeoutValue}*0.23 + 1)` }
        bottom={`9%`}
      />
      <Boxer className={startGame && "bounce-animation2 transition"} images={enemyBoxer} zIndex={1} isTransitioning={isTransitioningEnemy} right={ `calc((50% - 350px - 50px) * ( (${timeoutValue}* -0.23 + 1)` } bottom="8%" height={700} width={700} />

     

      {!startGame && <button className="start-button" onClick={() => setStartGame(true)}>Start</button> }
      {startGame && timeoutValue > 0 && (
        <div key={timeoutValue} className="countdown animate" >
          {timeoutValue}
        </div>
      )}
      

      <div className="container" >
        { startGame && displayText()}

        <input
          id="quoteInput"
          type="text"
          className="quote-input"
          ref={quoteInputElement}
          autoFocus
          value={quoteInput}
          onChange={(e) => handleUserInput(e.target.value)}
          style={{ color: "black" }}
        ></input>
      </div>
    </div>
  );
};

export default TypeFastGame;
