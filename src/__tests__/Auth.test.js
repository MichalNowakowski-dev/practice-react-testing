import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "../components/Auth";
import { getMd5 } from "../providers/md5Provider";

jest.mock("../providers/md5Provider");

describe("<Auth />", () => {
  test("logs in the user with correct credentials", async () => {
    getMd5.mockResolvedValue("8ae75b43f70f20ba564200ef4ab63a33"); // Hash dla "janeczek"

    render(<Auth />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(loginInput, { target: { value: "jan@domena.pl" } });
    fireEvent.change(passwordInput, { target: { value: "janeczek" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/jesteś zalogowany jako: jan@domena.pl/i)
      ).toBeInTheDocument();
    });
  });

  test("does not log in the user with incorrect credentials", async () => {
    getMd5.mockResolvedValue("invalidhash");

    render(<Auth />);

    const loginInput = screen.getByLabelText(/login/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(loginInput, { target: { value: "jan@domena.pl" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/jesteś zalogowany/i)).not.toBeInTheDocument();
    });
  });

  test("handles multiple users correctly", async () => {
    render(<Auth />);

    // Logowanie pierwszego użytkownika
    getMd5.mockResolvedValue("8ae75b43f70f20ba564200ef4ab63a33"); // Hash dla "janeczek"
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "jan@domena.pl" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "janeczek" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/jesteś zalogowany jako: jan@domena.pl/i)
      ).toBeInTheDocument();
    });

    // Logowanie drugiego użytkownika
    render(<Auth />);
    getMd5.mockResolvedValue("c5450079ce3aa5440cdea45c4be193bb"); // Hash dla "marcinek"
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "marcin@domena.pl" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "marcinek" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/jesteś zalogowany jako: marcin@domena.pl/i)
      ).toBeInTheDocument();
    });
  });
});
