"use client";

import { useState } from "react";
import { calculate, binaryToDecimal, decimalToBinary } from "./calculator";

// Hàm rút ngắn chuỗi nhị phân
const shortenBinary = (binary) => {
  // Loại bỏ các số 0 thừa ở đầu, giữ ít nhất 1 ký tự '0' nếu toàn bộ là 0
  return binary.replace(/^0+(?!$)/, '');
};

export default function Home() {
  const [mode, setMode] = useState("Signed");
  const [operation, setOperation] = useState("Cộng");
  const [registryLength, setRegistryLength] = useState(8);
  const [operandA, setOperandA] = useState({ binary: "00000000", decimal: 0 });
  const [operandB, setOperandB] = useState({ binary: "00000000", decimal: 0 });
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const calculationResult = calculate(
      operandA,
      operandB,
      operation,
      mode,
      registryLength
    );
    setResult(calculationResult);
  };

  const reset = () => {
    setOperandA({ binary: "00000000", decimal: 0 });
    setOperandB({ binary: "00000000", decimal: 0 });
    setResult(null);
    setRegistryLength(8);
  };

  const isValidBinary = (binary) => /^[01]*$/.test(binary); // Kiểm tra chuỗi nhị phân hợp lệ

  const handleBinaryChangeA = (binary) => {
    if (isValidBinary(binary)) {
      setOperandA({
        binary,
        decimal: binaryToDecimal(binary, mode === "Signed"),
      });
    }
  };

  const handleBinaryChangeB = (binary) => {
    if (isValidBinary(binary)) {
      setOperandB({
        binary,
        decimal: binaryToDecimal(binary, mode === "Signed"),
      });
    }
  };

  const handleDecimalChangeA = (decimal) => {
    const decimalValue = Number(decimal);
    const binary = decimalToBinary(decimalValue, registryLength);
    setOperandA({ binary, decimal: decimalValue });
  };

  const handleDecimalChangeB = (decimal) => {
    const decimalValue = Number(decimal);
    const binary = decimalToBinary(decimalValue, registryLength);
    setOperandB({ binary, decimal: decimalValue });
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Cộng Trừ Nhân Chia Số Nhị Phân
      </h1>
      <div className="flex justify-center gap-10">
        <div className="w-1/2 bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Nhập liệu</h2>

          <div className="mb-4">
            <h3 className="text-xl font-medium">Số A</h3>
            <input
              type="number"
              className="w-full p-2 border rounded mb-2"
              placeholder="Số thập phân"
              value={operandA.decimal}
              onChange={(e) => handleDecimalChangeA(e.target.value)}
              disabled={mode === "Signed"}
            />
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Nhị phân"
              value={operandA.binary}
              onChange={(e) => handleBinaryChangeA(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-medium">Số B</h3>
            <input
              type="number"
              className="w-full p-2 border rounded mb-2"
              placeholder="Số thập phân"
              value={operandB.decimal}
              onChange={(e) => handleDecimalChangeB(e.target.value)}
              disabled={mode === "Signed"}
            />
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Nhị phân"
              value={operandB.binary}
              onChange={(e) => handleBinaryChangeB(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">Chế độ</label>
            <select
              className="w-full p-2 border rounded"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="Signed">Có dấu</option>
              <option value="Unsigned">Không dấu</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">Phép toán</label>
            <select
              className="w-full p-2 border rounded"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="Cộng">Cộng</option>
              <option value="Trừ">Trừ</option>
              <option value="Nhân">Nhân</option>
              <option value="Chia">Chia</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">Độ dài bit</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={registryLength}
              onChange={(e) => setRegistryLength(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCalculate}
            >
              Tính toán
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={reset}>
              Làm mới
            </button>
          </div>
        </div>

        <div className="w-1/2 bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Kết quả</h2>
          {result ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">Loại</th>
                  <th className="border p-2">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Nhị phân</td>
                  <td className="border p-2">
                    {shortenBinary(result.binary)}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">Thập phân</td>
                  <td className="border p-2">{result.decimal}</td>
                </tr>
                <tr>
                  <td className="border p-2">Hex</td>
                  <td className="border p-2">{result.hex}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div>Không có kết quả</div>
          )}
        </div>
      </div>
    </div>
  );
}
