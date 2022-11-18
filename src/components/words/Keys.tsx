import React, { useEffect, useState,useCallback } from 'react'
import word from "./words.json"
import HangmanDrawing from "./HangmanDrawing"
import HangmanWord from "./HangmanWord"
import Keyboard from "./Keyboard"


function getWord(){
  return word[Math.floor(Math.random()*word.length)]
}
function Keys() {
    const [wordtoGuess, setwordtoGuess] = useState(getWord)
    const [guessedLetter,setguessedLetter] = useState<string[]>([])
    const incorrectlet = guessedLetter.filter(
      letter => !wordtoGuess.includes(letter)
    )
   
   const isLoser = incorrectlet.length >= 6
   const iswinner = wordtoGuess.split("").every(letter =>
    guessedLetter.includes(letter))
    const addguestletter = useCallback((letter:string)=>{
      if(guessedLetter.includes(letter)|| isLoser || iswinner) return

      setguessedLetter(currentLetter => [...currentLetter,letter])
    },[guessedLetter,iswinner,isLoser]
    )
    
    useEffect(()=>{
      const handler = (e: KeyboardEvent) => {
        const key = e.key

        if(!key.match(/^[a-z]$/)) return

        e.preventDefault()
        addguestletter(key)

      }
      document.addEventListener("keypress",handler)
    },[guessedLetter])
    
    useEffect(()=>{
      const handler = (e: KeyboardEvent) => {
        const key = e.key

        if( key !== "Enter") return

        e.preventDefault()
        setguessedLetter([])
        setwordtoGuess(getWord())
      }
      document.addEventListener("keypress",handler)
    },[])


  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column", 
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center"
      }}
    > 
    <div style={{fontSize:"2rem",textAlign:"center"}}>
      {iswinner && "Ganaste, reinicia para intentarlo de nuevo"}
      {isLoser && "Perdiste, reinicia para intentarlo de nuevo"}
    </div>
    <HangmanDrawing numberofGuesses={incorrectlet.length}/>
    <HangmanWord reveal={isLoser} guessedLetter={guessedLetter} wordToGuess={wordtoGuess}/>
    <div style={{alignSelf:"stretch"}}>
    <Keyboard
    disabled={iswinner || isLoser}
    activeLetter={guessedLetter.filter(letter =>
      wordtoGuess.includes(letter))}
      inactiveletter ={incorrectlet}
      addguestletter={addguestletter}
      />
    </div>
    </div>
  )
}

export default Keys