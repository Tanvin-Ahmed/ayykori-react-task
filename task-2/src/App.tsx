import React, { useState } from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const replaceConsecutiveLetters = (str: string): string => {
  let result = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (i > 0 && str[i] === str[i - 1]) {
      count++;
    } else {
      count = 1;
    }

    if (count === 3) {
      result = result.slice(0, -2) + "_";
    } else if (count > 3) {
      result = result.slice(0, -1) + "_".repeat(count - 2);
    } else {
      result += str[i];
    }
  }

  return result;
};

const App: React.FC = () => {
  const [outputString, setOutputString] = useState<string>("");

  const handleClick = (letter: string) => {
    let newOutputString = outputString + letter;
    newOutputString = replaceConsecutiveLetters(newOutputString);
    setOutputString(newOutputString);
  };

  return (
    <main className="flex flex-col items-center p-4 space-y-20">
      <div className="text-2xl font-bold mt-4" id="outputString">
        {outputString}
      </div>
      <div className="grid md:grid-cols-12 sm:grid-cols-6 grid-cols-4 gap-2 mb-4">
        {alphabet.split("").map((letter) => (
          <div
            key={letter}
            className="flex items-center justify-center w-12 h-12 bg-gray-200 border border-gray-400 cursor-pointer text-xl font-bold hover:bg-gray-300"
            onClick={() => handleClick(letter)}
          >
            {letter}
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;
