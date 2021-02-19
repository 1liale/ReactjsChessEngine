import React, { useState } from "react";
import "./App.css";
import Chessboard from "chessboardjsx";
import { ChessInstance, ShortMove } from "chess.js";
import { minMaxStart, randomMoves, simpleEval } from "./ChessAI";
const Chess = require("chess.js");

const App: React.FC = () => {
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const [chess] = useState<ChessInstance>(new Chess(initialFen) );
  const [fen, setFen] = useState(chess.fen());

  function generateMove(move: ShortMove) {
    if(chess.move(move)){
      const possibleMoves = chess.moves();
      if (possibleMoves.length > 0) {
        // let computerMove = simpleEval(possibleMoves, chess);
        let computerMove = minMaxStart(4, chess, true, -1)[0];
        console.log(computerMove);
        if (computerMove != null) {
          chess.move(computerMove);
        }
        setFen(chess.fen());
      }
      setFen(chess.fen());
    }
  }

  return (
    <div className="flex-center">
      <h1>MinMax Chess AI</h1>
      <Chessboard
        width={400}
        position={fen}
        onDrop={(move) =>
          generateMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            // defaults promotion to queen
            promotion: "q"
          })
        }
      />
    </div>
  );
};

export default App;