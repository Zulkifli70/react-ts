"use client";

import { useState } from "react";
import type { JSX } from "react";
import { languages } from "../type/languages";
import { getRandomWord } from "../type/utils";

import ConfettiContainer from "./components/ConfettiContainer";
import Header from "./components/Header";
import GameStatus from "./components/GameStatus";
import LanguageChips from "./components/LanguageChips";
import WordLetters from "./components/WordLetters";
import AriaLiveStatus from "./components/AriaLiveStatus";
import Keyboard from "./components/Keyboard";
import NewGameButton from "./components/NewGameButton";
import Timer from "./components/Timer";

export default function AssemblyEndgame(): JSX.Element {
  // State values
  const [currentWord, setCurrentWord] = useState<string>((): string =>
    getRandomWord()
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);

  // Derived values
  const numGuessesLeft: number = languages.length - 1;
  const wrongGuessCount: number = guessedLetters.filter(
    (letter: string): boolean => !currentWord.includes(letter)
  ).length;
  const isGameWon: boolean = currentWord
    .split("")
    .every((letter: string): boolean => guessedLetters.includes(letter));
  const isGameLost: boolean = wrongGuessCount >= numGuessesLeft || isTimeUp;
  const isGameOver: boolean = isGameWon || isGameLost;
  const lastGuessedLetter: string = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect: boolean = Boolean(
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  );

  // Static values
  const alphabet: string = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter: string): void {
    setGuessedLetters((prevLetters: string[]): string[] =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  function startNewGame(): void {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
    setIsTimeUp(false);
    setGameKey((prev) => prev + 1); // Increment key untuk reset timer
  }

  function handleTimeUp(): void {
    setIsTimeUp(true);
  }

  return (
    <main>
      <ConfettiContainer isGameWon={isGameWon} />
      <Header />

      <Timer
        key={gameKey} // Key berubah setiap game baru, memaksa timer reset
        isGameOver={isGameOver}
        onTimeUp={handleTimeUp}
        initialTime={60} // 60 detik, bisa diubah sesuai keinginan
      />

      <GameStatus
        isGameWon={isGameWon}
        isGameLost={isGameLost}
        isGameOver={isGameOver}
        isLastGuessIncorrect={isLastGuessIncorrect}
        wrongGuessCount={wrongGuessCount}
      />

      <LanguageChips languages={languages} wrongGuessCount={wrongGuessCount} />

      <WordLetters
        currentWord={currentWord}
        guessedLetters={guessedLetters}
        isGameLost={isGameLost}
      />

      <AriaLiveStatus
        currentWord={currentWord}
        lastGuessedLetter={lastGuessedLetter}
        guessedLetters={guessedLetters}
        numGuessesLeft={numGuessesLeft}
      />

      <Keyboard
        alphabet={alphabet}
        guessedLetters={guessedLetters}
        currentWord={currentWord}
        isGameOver={isGameOver}
        addGuessedLetter={addGuessedLetter}
      />

      <NewGameButton isGameOver={isGameOver} startNewGame={startNewGame} />
    </main>
  );
}
