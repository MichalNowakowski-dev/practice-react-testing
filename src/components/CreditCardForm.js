import React, { useState } from "react";

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [cardBrand, setCardBrand] = useState(null);

  // Algorytm Luhna
  const validateCardNumber = (number) => {
    const paddedNumber = number.padStart(16, "0");
    const digits = paddedNumber.split("").map(Number);

    const sum = digits
      .map((digit, index) => {
        const weight = index % 2 === 0 ? 2 : 1;
        const product = digit * weight;
        return product > 9 ? product - 9 : product;
      })
      .reduce((acc, curr) => acc + curr, 0);

    return sum % 10 === 0;
  };

  // Funkcja identyfikująca organizację
  const getCardBrand = (number) => {
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "MasterCard";
    if (number.startsWith("34") || number.startsWith("37"))
      return "American Express";
    if (
      number.startsWith("30") ||
      number.startsWith("36") ||
      number.startsWith("38")
    )
      return "Diners Club / Carte Blanche";
    if (
      ["3088", "3096", "3112", "3158", "3337", "3528"].some((prefix) =>
        number.startsWith(prefix)
      )
    )
      return "JCB";
    return null;
  };

  const handleInputChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Usuwa znaki niebędące cyframi
    setCardNumber(input);

    if (input.length >= 13) {
      setIsValid(validateCardNumber(input));
      setCardBrand(getCardBrand(input));
    } else {
      setIsValid(null);
      setCardBrand(null);
    }
  };

  return (
    <form className="p-4 border rounded-lg shadow-lg bg-gray-50 max-w-md mx-auto">
      <label
        htmlFor="cardNumber"
        className="block text-gray-700 font-medium mb-2"
      >
        Card Number:
      </label>
      <input
        id="cardNumber"
        type="text"
        value={cardNumber}
        onChange={handleInputChange}
        maxLength={19} // Obsługa spacji (1234 5678 9012 3456)
        className={`w-full p-2 border ${
          isValid === null
            ? "border-gray-300"
            : isValid
            ? "border-green-500"
            : "border-red-500"
        } rounded-lg focus:outline-none`}
        placeholder="Enter card number"
      />
      {cardBrand && (
        <p className="text-gray-700 mt-2">
          Card Brand: <span className="font-medium">{cardBrand}</span>
        </p>
      )}
      {isValid !== null && (
        <p className={`mt-2 ${isValid ? "text-green-600" : "text-red-600"}`}>
          {isValid ? "Valid card number" : "Invalid card number"}
        </p>
      )}
    </form>
  );
};

export default CreditCardForm;
