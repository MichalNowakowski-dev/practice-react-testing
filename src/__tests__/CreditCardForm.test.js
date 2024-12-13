import { render, screen, fireEvent } from "@testing-library/react";
import CreditCardForm from "../components/CreditCardForm";

describe("<CreditCardForm />", () => {
  test("displays card brand and validation status for a valid Visa card", () => {
    render(<CreditCardForm />);

    const input = screen.getByPlaceholderText(/enter card number/i);
    fireEvent.change(input, { target: { value: "4111111111111111" } });

    expect(screen.getByText(/visa/i)).toBeInTheDocument();
    expect(screen.getByText(/valid card number/i)).toBeInTheDocument();
  });

  test("identifies MasterCard correctly", () => {
    render(<CreditCardForm />);

    const input = screen.getByPlaceholderText(/enter card number/i);
    fireEvent.change(input, { target: { value: "5105105105105100" } });

    expect(screen.getByText(/mastercard/i)).toBeInTheDocument();
    expect(screen.getByText(/valid card number/i)).toBeInTheDocument();
  });
  test("displays card brand and validation status for an invalid card", () => {
    render(<CreditCardForm />);

    const input = screen.getByPlaceholderText(/enter card number/i);
    fireEvent.change(input, { target: { value: "1234567890123456" } }); // Niepoprawny numer

    expect(screen.queryByText(/card brand:/i)).not.toBeInTheDocument();
    expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
  });

  test("displays no brand for incomplete card numbers", () => {
    render(<CreditCardForm />);

    const input = screen.getByPlaceholderText(/enter card number/i);
    fireEvent.change(input, { target: { value: "4111" } });

    expect(screen.queryByText(/card brand:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/valid card number/i)).not.toBeInTheDocument();
  });
});
