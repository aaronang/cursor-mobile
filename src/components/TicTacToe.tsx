import { useState } from "react"
import { X, Circle, RotateCcw } from "lucide-react"

type Player = "X" | "O" | null

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player>(null)
  const [gameOver, setGameOver] = useState(false)

  const checkWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const checkDraw = (squares: Player[]): boolean => {
    return squares.every(square => square !== null)
  }

  const handleSquareClick = (index: number) => {
    if (board[index] || winner || gameOver) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      setGameOver(true)
    } else if (checkDraw(newBoard)) {
      setGameOver(true)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setGameOver(false)
  }

  const getStatusMessage = () => {
    if (winner) {
      return `Player ${winner} wins!`
    }
    if (gameOver) {
      return "It's a draw!"
    }
    return `Player ${currentPlayer}'s turn`
  }

  const renderSquare = (index: number) => {
    const value = board[index]
    return (
      <button
        key={index}
        onClick={() => handleSquareClick(index)}
        disabled={value !== null || winner !== null || gameOver}
        className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-100"
      >
        {value === "X" && <X className="w-10 h-10 text-blue-600" />}
        {value === "O" && <Circle className="w-10 h-10 text-red-600" />}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-sm mx-auto">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tic Tac Toe</h2>
          <p className="text-lg text-gray-600 font-medium">{getStatusMessage()}</p>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Array(9).fill(null).map((_, index) => renderSquare(index))}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {/* Game Instructions */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p className="mb-2">How to play:</p>
          <p>• Tap any empty square to place your mark</p>
          <p>• Get three in a row to win!</p>
          <p>• X goes first, then O</p>
        </div>
      </div>
    </div>
  )
}