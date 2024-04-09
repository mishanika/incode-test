import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import Input from "./Input";

describe("Input component", () => {
  test("renders input field and button", () => {
    render(
      <Provider store={store}>
        <Input />
      </Provider>
    );

    expect(screen.getByPlaceholderText("Enter repository url")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Load issues" })).toBeInTheDocument();
  });

  test("calls fetchIssues function with correct URL when button is clicked", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        owner: { html_url: "https://github.com/owner" },
        html_url: "https://github.com/repo",
        stargazers_count: 100,
      }),
    });

    render(
      <Provider store={store}>
        <Input />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter repository url"), {
      target: { value: "https://github.com/owner/repo" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Load issues" }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("https://api.github.com/repos/owner/repo"));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("https://api.github.com/repos/owner/repo/issues?state=all")
    );
  });

  test("calls setUrl function when input value changes", () => {
    render(
      <Provider store={store}>
        <Input />
      </Provider>
    );

    const inputField = screen.getByPlaceholderText("Enter repository url");

    expect(inputField).toBeInTheDocument();

    fireEvent.change(inputField, { target: { value: "https://github.com/owner/repo" } });

    expect(inputField).toHaveValue("https://github.com/owner/repo");
  });

  test("handles error if URL is incorrect", async () => {
    render(
      <Provider store={store}>
        <Input />
      </Provider>
    );

    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Invalid URL"));

    fireEvent.change(screen.getByPlaceholderText("Enter repository url"), { target: { value: "invalid-url" } });
    fireEvent.click(screen.getByRole("button", { name: "Load issues" }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Invalid URL")).toBeInTheDocument();
    });
  });
});
