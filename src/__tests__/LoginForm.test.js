import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../components/LoginForm"; // Ścieżka do komponentu LoginForm

// Mock funkcji tryAuth
const mockTryAuth = jest.fn();

beforeEach(() => {
  mockTryAuth.mockReset();
});

describe("<LoginForm />", () => {
  it("renders the form correctly", () => {
    render(<LoginForm tryAuth={mockTryAuth} />);

    // Sprawdzamy, czy formularz się renderuje
    expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/send/i)).toBeInTheDocument();
  });

  it("displays an error message when the input is too short", () => {
    render(<LoginForm tryAuth={mockTryAuth} />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(loginInput, { target: { value: "ab" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });

    // Doprecyzowane testy dla każdego pola

    const errors = screen.getAllByText(/The field is too short!/i);
    expect(errors.length).toBe(2); // Dwa komunikaty błędów
  });

  it("calls tryAuth when submitting valid data", async () => {
    mockTryAuth.mockResolvedValueOnce(true); // symulujemy pozytywną odpowiedź

    render(<LoginForm tryAuth={mockTryAuth} />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/send/i);

    fireEvent.change(loginInput, { target: { value: "validLogin" } });
    fireEvent.change(passwordInput, { target: { value: "validPassword" } });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockTryAuth).toHaveBeenCalledWith("validLogin", "validPassword")
    );
  });

  it("displays error message when tryAuth fails", async () => {
    mockTryAuth.mockRejectedValueOnce(new Error("Incorrect data!")); // Symulacja błędu

    render(<LoginForm tryAuth={mockTryAuth} />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/send/i);

    fireEvent.change(loginInput, { target: { value: "validLogin" } });
    fireEvent.change(passwordInput, { target: { value: "validPassword" } });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByRole("heading")).toHaveTextContent(
        "There was an error with your data. Please check and try again."
      )
    );
  });

  it("does not submit the form with short inputs", () => {
    render(<LoginForm tryAuth={mockTryAuth} />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/send/i);

    fireEvent.change(loginInput, { target: { value: "ab" } });
    fireEvent.change(passwordInput, { target: { value: "12" } });

    fireEvent.click(submitButton);

    expect(mockTryAuth).not.toHaveBeenCalled();
  });
});
