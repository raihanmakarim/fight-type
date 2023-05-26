"use client";
import React, {
  useState, useEffect, useRef 
} from "react";
import HealthBar from "./component/HealthBar";
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

  return <span className={`quote-display ${className}`}>{word} </span>;
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






const TypeFastGame = () => {
  const [ quoteInput, setQuoteInput ] = useState("");
  
  const quoteInputElement = useRef(null);
  const [ activeWordIndex, setActiveWordIndex ] = useState(0);
  const quoteContentRef = useRef("");
  const correctWordsRef = useRef([]);
  const enemyHp = useRef(100);


  const [ myHp, setMyHp ] = useState(100);

  const decreaseHp = () => {
    const threshold = 10;

    const interval = setInterval(() => {
      setMyHp((prevHp) => {
        if (prevHp <= 0) {
          clearInterval(interval);
          return prevHp;
        }

        const deduction = Math.min(Math.floor(Math.random() * threshold) + 1, prevHp);
        const newHp = prevHp - deduction;
        return newHp;
      });
    }, Math.floor(Math.random() * (3500 - 2500 + 1)) + 2500);
  };


  
  const [ gameOver, setGameOver ] = useState(false);

  const resetGame = () => {
    setActiveWordIndex(0);
    correctWordsRef.current = [];
    setQuoteInput("");
    setMyHp(100);
    enemyHp.current = 100;
    setGameOver(false);
    setStartGame(false);
    getRandomQuote()

  };


  const [ startGame, setStartGame ] = useState(false);

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


  const displayText = () => {
    const text = quoteContentRef.current?.split(" ");
    if (!text) {
      return null;
    }
    return text.map((word, index) => (
      <Word
        key={index}
        word={word}
        activeWord={index === activeWordIndex}
        correct={correctWordsRef.current[index]}
      />
    ));
  };


  const getRandomQuote = async () => {
    try {
      const response = await fetch(RANDOM_QUOTE_API_URL);
      const data = await response.json();
      return Promise.resolve(data.content).then((content) => {
        quoteContentRef.current = content;
      })
    }
    catch (error) {
      console.error("Error fetching random quote:", error);
      return Promise.reject(error);
    }
  };


  useEffect(() => {
    getRandomQuote()

  }, []);

  
  console.log("quoteInput", quoteInput);


  const handleUserInput = (value) => {
    if (value.endsWith(" ")) {
      const lastWord = quoteContentRef.current.split(" ")[activeWordIndex];
      if (lastWord === value.trim()) {
        setActiveWordIndex((prevIndex) => prevIndex + 1);
        correctWordsRef.current = [ ...correctWordsRef.current, value.trim() ];
        enemyHp.current -= 10;
      }
      setQuoteInput("");
    }
    else {
     
      setQuoteInput(value);
    }
  };


  return (
    <div className="wrapper">
      <div className="flex justify-center items-center font-bold bg-yellow-400	 gap-12 h-20 border-2 border-black"> 
        <HealthBar color="red" health={enemyHp.current} />

        <h1 className="text-black text-2xl  ">VS</h1>
        {/* <h1 className="text-green-500 ">{myHp}</h1> */}
        <HealthBar color="green" health={myHp} />
      </div>
     


      <div className="container">
        <p className="quote">{displayText()}</p>
        <input
      
          id="quoteInput"
          type="text"
          className="quote-input"
          ref={quoteInputElement}
          autoFocus
          value={quoteInput}
          onChange={(e) => handleUserInput(e.target.value)}
          style={{ color: "black" }}
        ></input>{" "}
      </div>
    </div>
  );
};

export default TypeFastGame;
