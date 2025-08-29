"use client";
import React, {
  useState, useEffect, useRef 
} from "react";
import HealthBar from "../component/HealthBar";

import idle from "../../public/idle.png";
import prepare_jab from "../../public/prepare_jab.png";
import jab from "../../public/jab.png";
import Link from 'next/link'

import Image from 'next/image';
import Opponent_iddle from "../../public/Opponent_iddle.png";
import Opponent_jab from "../../public/Opponent_jab.png";
import Opponent_prepare_jab from "../../public/Opponent_prepare_jab.png";
import { getLocalQuoteWords } from "../data/typingTexts"; 


const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random?minLength=400&maxLength=600";



const Word = React.memo(function Word(props) {
  const {
    word, activeWord, correct,activeWordIndex, index 
  } = props;

  const passed = activeWordIndex > index


  let className = "word";
  if (activeWord ) {
    className += " text-blue-500";
  }
  if (correct && passed) {
    className += " text-green-500";
  }
  if (!correct && passed) {
    className += " text-red-500";
  }
  else{
    className += " text-black";
  }
  

  return <div className={`quote-display ${className}`}>{word} </div>;
});




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
  const [ win, setWin ] = useState("");
  const [ difficulty, setDifficulty ] = useState(3);
  const [ openModal, setOpenModal ] = useState(true);





  const lastWord = quoteContentRef.current[activeWordIndex];

  useEffect(() => {
    if ((quoteContentRef.current.length - 1) == activeWordIndex ){
      setActiveWordIndex(0);
      getRandomQuote();
      console.log("working")
      setActiveWordIndex(0);
      correctWordsRef.current = [];
      setLastWordLength(0);
    }
  }, [ activeWordIndex ]);


  console.log("11111",(quoteContentRef.current.length - 1) == activeWordIndex)



  

  const handleUserInput = (value) => {
    if (value.endsWith(" ")) {
      if( timeoutValue === 0 ){
        setLastWordLength(lastWordLength + lastWord.length);
        if (lastWord === value.trim() && timeoutValue <= 1 ) {
          setActiveWordIndex((prevIndex) => prevIndex + 1);
          correctWordsRef.current = [ ...correctWordsRef.current, value.trim() ];
          enemyHp.current -= lastWord.length;
          setIsTransitioning(true);
          setTimeout(() => {
            setIsTransitioning(false);
          }
          , 450);
        }
        else {
          setActiveWordIndex((prevIndex) => prevIndex + 1);
          correctWordsRef.current = [ ...correctWordsRef.current, "WRONGG" ];
        }
      }
      setQuoteInput("");
    }
    else {
     
      setQuoteInput(value);
    
    }
  };

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

            const deduction = Math.floor(Math.random() * difficulty) + 2;
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

      quoteInputElement.current.focus();
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
      }, 500);
    }
  }, [ isShaking ]);


  
  const resetGame = () => {
    if( enemyHp.current <= 0 && myHp > 0){
      setWin("YOU WIN")
    }
    else if(myHp <= 0 && enemyHp.current > 0){
      setWin("YOU LOSE, YOU SUCK!!")
    }
    else if (enemyHp.current <= 0 && myHp <= 0) {
      setWin("DRAW")
    }
    setActiveWordIndex(0);
    correctWordsRef.current = [];
    setQuoteInput("");
    setMyHp(100);
    enemyHp.current = 100;
    setGameOver(false);
    setStartGame(false);
    setTimeoutValue(3);
    setLastWordLength(0);
    setOpenModal(true);
   

  };





  const displayText = () => {
    const text = quoteContentRef.current;
    if (!text || /\d/.test(text)) {
      return null;
    }
    const firstLength = text[0].length;

    return (
      <div className="quote-wrapper">
        <div className="quote-container" style={ activeWordIndex === 0 ? { left: '50%' } : { left: `calc(50% - ${(lastWordLength * 15) + (activeWordIndex* 10) }px  - ${(firstLength * 6)}px)` }}>
          {text.map((word, index) => { 
            if (word === ""){
              return null
            }

            return(
              <Word
                key={index}
                word={word}
                activeWord={index === activeWordIndex}
                activeWordIndex={activeWordIndex}
                index={index}
                correct={correctWordsRef.current[index] === quoteContentRef.current[index]}
              />
            )
          })}
        </div>
      </div>
    );
  };

const getRandomQuote = async () => {
  try {
    const content = getLocalQuoteWords();
    quoteContentRef.current = content;
    return Promise.resolve(content);
  } catch (error) {
    console.error("Error getting local quote:", error);
    return Promise.reject(error);
  }
};



 


  const zIndexValue = 20;




  return (
    <div className="wrapper">
      {openModal && ( <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
        <div className="bg-amber-600 rounded-lg p-6 shadow-xl w-1/2 h-1/2 flex flex-col items-center">
          <h2 className="text-3xl font-bold ">{win}</h2>

          <h2 className="text-3xl font-bold mb-4">Choose Your Diifculty</h2>
          <div className="flex justify-between gap-2 w-4/5 mb-4">
            <button className="w-5/12 h-20 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
              onClick={() => {
                setDifficulty(3); 
                setOpenModal(false) 
              } }
            >
              Easy
            </button>
            <button onClick={() => {
              setDifficulty(4); 
              setOpenModal(false) 
            } }
            className="w-5/12 h-20 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
              Medium
            </button>
            <button onClick={() => {
              setDifficulty(6); 
              setOpenModal(false) 
            } }
              className="w-5/12 h-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
              Hard
            </button>
            <button onClick={() => {
              setDifficulty(10); 
              setOpenModal(false)
            } }
              className="w-5/12 h-20 px-4 py-2 bg-black  text-white font-semibold rounded-lg">
              NO WAY
            </button>
            

          
          </div>
          <Link href="/"> 
            <button className="w-64 h-20 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
              Go Back Home
            </button>
          </Link>

        </div>
      </div>)}
     
      <div className="flex justify-center items-center font-bold absolute top-0	w-full z-30 	 gap-12 h-16 "> 
        <HealthBar color="rgb(9, 255, 0)" health={myHp} />

        <h1 className="text-yellow-500ss text-2xl   ">VS</h1>
        <HealthBar color="rgb(255, 36, 16)" health={enemyHp.current} />

      </div>
      {/* <Boxer className={startGame && " in-animation bounce-animation "} images={myBoxer} isTransitioning={isTransitioning} right="calc(50% - 240px - 50px)" bottom="10%" zIndex={20} /> */}
      {/* <Boxer className={startGame && "bounce-animation2"} images={enemyBoxer} isTransitioning={isTransitioningEnemy} right="calc(50% - 350px - 50px)" bottom="8%" height={700} width={700} zIndex={1} /> */}

      <Boxer className={startGame && "bounce-animation transition-all-1s "} images={myBoxer} zIndex={zIndexValue} isTransitioning={isTransitioning} right={ `calc((50% - 240px - 50px) * (${timeoutValue}*0.23 + 1))` }
        bottom={`9%`}
      />
      <Boxer className={startGame && "bounce-animation2 transition-all-1s"} images={enemyBoxer} zIndex={1} isTransitioning={isTransitioningEnemy} right={ `calc((50% - 350px - 50px) * (${timeoutValue}* -0.23 + 1))` } bottom="8%" height={700} width={700} />

     

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
          value={quoteInput}
          onChange={(e) => handleUserInput(e.target.value)}
          style={{ color: "black" }}
        ></input>
      </div>
    </div>
  );
};

export default TypeFastGame;
