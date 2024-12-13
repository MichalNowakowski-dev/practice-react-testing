import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Md5Form from "../components/Md5Form";

describe("<Md5Form /> with .spyOn()", () => {
  let mockGetMd5;

  beforeEach(() => {
    mockGetMd5 = jest.fn().mockResolvedValue("mockedMd5Hash");
  });

  it("displays text input in .data-text when typing", () => {
    render(<Md5Form getMd5={mockGetMd5} />);

    const input = screen.getByRole("textbox");
    const dataText = screen.getByText("", { selector: ".data-text" });

    // Typowanie w polu tekstowym
    fireEvent.change(input, { target: { value: "testInput" } });

    // Sprawdzamy, czy wartość jest widoczna w elemencie .data-text
    expect(dataText.textContent).toBe("testInput");
  });

  it("loads md5 into .data-md5 on form submit", async () => {
    // Szpiegowanie funkcji getMd5
    const getMd5Spy = jest.spyOn({ getMd5: mockGetMd5 }, "getMd5");

    render(<Md5Form getMd5={mockGetMd5} />);

    const input = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /send/i });
    const dataMd5 = screen.getByText("", { selector: ".data-md5" });

    // Typowanie w polu tekstowym
    fireEvent.change(input, { target: { value: "testInput" } });

    // Wysłanie formularza
    fireEvent.click(submitButton);

    // Sprawdzamy, czy getMd5 została wywołana z odpowiednią wartością
    expect(getMd5Spy).toHaveBeenCalledWith("testInput");

    // Sprawdzamy, czy wynik md5 pojawił się w elemencie .data-md5
    await waitFor(() => expect(dataMd5.textContent).toBe("mockedMd5Hash"));
  });

  it("clears .data-md5 when input value changes", () => {
    render(<Md5Form getMd5={mockGetMd5} />);

    const input = screen.getByRole("textbox");
    const dataMd5 = screen.getByText("", { selector: ".data-md5" });

    // Typowanie w polu tekstowym
    fireEvent.change(input, { target: { value: "testInput" } });

    // Wysłanie formularza (uzupełnienie md5)
    fireEvent.submit(screen.getByRole("button"));

    // Zmiana wartości w input (powinno wyczyścić md5)
    fireEvent.change(input, { target: { value: "newInput" } });

    // Sprawdzamy, czy md5 zostało wyczyszczone
    expect(dataMd5.textContent).toBe("");
  });
});
