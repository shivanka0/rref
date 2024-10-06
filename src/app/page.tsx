'use client';
import { useState } from 'react';
var rref = require('rref');

interface MatrixCell {
  value: number;
}

// Separate Matrix component for RREF calculations
const Matrix: React.FC = () => {
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [rrefMatrix, setRrefMatrix] = useState<number[][] | null>(null);

  // Handle matrix dimension change
  const handleMatrixDimensionChange = () => {
    const newMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0) // Initialize with zeros
    );
    setMatrix(newMatrix);
    setRrefMatrix(null); // Reset RREF matrix when dimensions change
  };

  // Handle cell value change
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    // Convert the value to a number
    const numericValue = parseFloat(value);

    // Check if the input value is a valid number
    if (isNaN(numericValue)) return; // Ignore invalid inputs

    // Update the matrix with the new value
    const newMatrix = matrix.map((row, i) =>
      row.map((cell, j) => (i === rowIndex && j === colIndex ? numericValue : cell))
    );
    setMatrix(newMatrix);

    // Check if all values are filled (optional step)
    if (newMatrix.every(row => row.every(cell => !isNaN(cell)))) {
      calculateRREF(newMatrix);
    }
  };

  // Function to calculate the RREF of the matrix
  const calculateRREF = (matrixValues: number[][]) => {
    const result = rref(matrixValues); // Assuming rref function works correctly
    setRrefMatrix(result); // Store the calculated RREF matrix
  };

  return (
    <main className="flex flex-col items-center justify-center p-10">
      <h1 className="text-2xl mb-4">Matrix RREF Calculator</h1>

      {/* Matrix dimensions input */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Rows"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Columns"
          value={cols}
          onChange={(e) => setCols(Number(e.target.value))}
          className="border p-2"
        />
        <button
          onClick={handleMatrixDimensionChange}
          className="bg-blue-500 text-white p-2"
        >
          Set Dimensions
        </button>
      </div>

      {/* Matrix input grid */}
      {matrix.length > 0 && (
        <div className="matrix-input-grid">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="number"
                  value={cell}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  className="border p-2 w-16 text-center"
                  step="any" // Allows floating-point numbers
                />
              ))}
            </div>
          ))}

        </div>
      )}
      {/* RREF result */}
      {rrefMatrix && (
        <div className="rref-result mt-6">
          <h2 className="text-xl mb-4">RREF Result</h2>
          <div className="flex flex-col">
            {rrefMatrix.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <span key={colIndex} className="border p-2 w-16 text-center">
                    {cell.toFixed(2)} {/* Adjust precision if needed */}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

// HomePage component remains unchanged
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl mb-4">Welcome to the App</h1>
      <Matrix /> {/* Add the Matrix component here */}
    </main>
  );
}
