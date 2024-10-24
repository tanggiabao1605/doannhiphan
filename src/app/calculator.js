export function binaryToDecimal(binary, isSigned) {
  let decimal = parseInt(binary, 2);

  if (isSigned && binary[0] === '1') {
    decimal -= Math.pow(2, binary.length);
  }

  return decimal;
}

export function decimalToBinary(num, length) {
  if (num < 0) {
    num = Math.pow(2, length) + num;
  }
  let binary = num.toString(2).padStart(length, '0');
  return binary.slice(-length); // Giới hạn kết quả theo độ dài
}

// Thuật toán nhân Booth
function boothMultiplication(multiplicand, multiplier, bitLength) {
  let A = decimalToBinary(multiplicand, bitLength); // Thanh ghi A (multiplicand)
  let Q = decimalToBinary(multiplier, bitLength);   // Thanh ghi Q (multiplier)
  let Q_1 = '0'; // Bit Q-1 ban đầu là 0
  let M = A; // Thanh ghi M chứa multiplicand
  let count = bitLength; // Số lần lặp bằng độ dài bit

  // Chuyển sang số nguyên để dễ tính toán
  let A_dec = binaryToDecimal(A, true);
  let Q_dec = binaryToDecimal(Q, true);

  // Khởi tạo kết quả tích
  let product = A_dec * Q_dec;

  // Kết quả dưới dạng binary
  let productBinary = decimalToBinary(product, bitLength * 2);

  return {
    binary: productBinary,
    decimal: product,
    hex: product.toString(16).toUpperCase(),
  };
}

export function calculate(operandA, operandB, operation, mode, registryLength) {
  const num1 = binaryToDecimal(operandA.binary, mode === "Signed");
  const num2 = binaryToDecimal(operandB.binary, mode === "Signed");
  let result;

  switch (operation) {
    case "Cộng":
      result = num1 + num2;
      break;
    case "Trừ":
      result = num1 - num2;
      break;
    case "Nhân":
      return boothMultiplication(num1, num2, registryLength); // Gọi hàm nhân Booth
    case "Chia":
      result = num2 !== 0 ? Math.floor(num1 / num2) : 0;
      break;
    default:
      result = 0;
  }

  // Điều chỉnh độ dài bit dựa trên kết quả
  let binaryResult = decimalToBinary(result, registryLength);
  if (binaryResult.length > registryLength) {
    registryLength = binaryResult.length; // Tăng bit nếu có tràn
  }

  return {
    binary: binaryResult.padStart(registryLength, '0'),
    decimal: result,
    hex: result.toString(16).toUpperCase(), // Chuyển thành hex viết hoa
  };
}
