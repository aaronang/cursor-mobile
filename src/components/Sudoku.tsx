import { useState } from "react"
import { RotateCcw } from "lucide-react"

type Cell = {
  value: number | null
  isOriginal: boolean
  isSelected: boolean
  hasError: boolean
}

export function Sudoku() {
  const [board, setBoard] = useState<Cell[][]>(() => {
    // Initialize with a simple Sudoku puzzle
    const puzzle = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ]

    return puzzle.map(row => 
      row.map(value => ({
        value,
        isOriginal: value !== null,
        isSelected: false,
        hasError: false
      }))
    )
  })

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [gameWon, setGameWon] = useState(false)

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col].isOriginal) return

    setBoard(prev => prev.map((r, rIndex) =>
      r.map((cell, cIndex) => ({
        ...cell,
        isSelected: rIndex === row && cIndex === col
      }))
    ))
    setSelectedCell([row, col])
  }

  const handleNumberInput = (number: number) => {
    if (!selectedCell) return

    const [row, col] = selectedCell
    if (board[row][col].isOriginal) return

    const newBoard = board.map((r, rIndex) =>
      r.map((cell, cIndex) => {
        if (rIndex === row && cIndex === col) {
          return { ...cell, value: number, hasError: false }
        }
        return cell
      })
    )

    // Check for errors
    const hasError = checkErrors(newBoard, row, col, number)
    if (hasError) {
      newBoard[row][col].hasError = true
    }

    setBoard(newBoard)

    // Check if game is won
    if (isGameComplete(newBoard)) {
      setGameWon(true)
    }
  }

  const checkErrors = (board: Cell[][], row: number, col: number, value: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c].value === value) return true
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col].value === value) return true
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c].value === value) return true
      }
    }

    return false
  }

  const isGameComplete = (board: Cell[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null) return false
      }
    }
    return true
  }

  const resetGame = () => {
    setBoard([
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ].map(row => 
      row.map(value => ({
        value,
        isOriginal: value !== null,
        isSelected: false,
        hasError: false
      }))
    ))
    setSelectedCell(null)
    setGameWon(false)
  }

  const renderCell = (cell: Cell, row: number, col: number) => {
    const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col

    return (
      <button
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        disabled={cell.isOriginal}
        className={`
          w-8 h-8 text-center text-sm font-medium border
          ${cell.isOriginal 
            ? 'bg-stone-200 text-stone-800 border-stone-300' 
            : 'bg-white text-stone-900 border-stone-200 hover:bg-stone-50'
          }
          ${isSelected ? 'bg-stone-300 border-stone-400' : ''}
          ${cell.hasError ? 'bg-red-100 border-red-300 text-red-800' : ''}
          ${(row + 1) % 3 === 0 ? 'border-b-4 border-b-stone-400' : 'border-b border-b-stone-200'}
          ${(col + 1) % 3 === 0 ? 'border-r-4 border-r-stone-400' : 'border-r border-r-stone-200'}
          ${row === 0 ? 'border-t-4 border-t-stone-400' : ''}
          ${col === 0 ? 'border-l-4 border-l-stone-400' : ''}
          transition-colors
        `}
      >
        {cell.value || ''}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-sm mx-auto">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Sudoku</h2>
          {gameWon && (
            <p className="text-lg text-green-700 font-medium">Congratulations! You solved it!</p>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-9 gap-0 mb-6 bg-stone-900 p-1 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
            <button
              key={number}
              onClick={() => handleNumberInput(number)}
              className="w-12 h-12 bg-stone-900 text-stone-50 rounded-lg font-medium hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-sm"
            >
              {number}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-stone-50 font-medium rounded-lg hover:bg-stone-800 active:bg-stone-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {/* Game Instructions */}
        <div className="mt-8 text-center text-stone-600 text-sm">
          <p className="mb-2">How to play:</p>
          <p>• Fill in the empty cells with numbers 1-9</p>
          <p>• Each row, column, and 3x3 box must contain all numbers 1-9</p>
          <p>• Tap a cell, then tap a number to fill it</p>
        </div>
      </div>
    </div>
  )
}