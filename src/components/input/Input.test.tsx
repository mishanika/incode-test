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

    // Проверяем, что поле ввода и кнопка присутствуют
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

    // Заполним поле ввода
    fireEvent.change(screen.getByPlaceholderText("Enter repository url"), {
      target: { value: "https://github.com/owner/repo" },
    });
    // Нажмем кнопку "Load issues"
    fireEvent.click(screen.getByRole("button", { name: "Load issues" }));

    // Подождем, чтобы запрос был отправлен
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

    // Проверяем, что поле ввода присутствует
    expect(inputField).toBeInTheDocument();

    // Имитируем изменение значения в поле ввода
    fireEvent.change(inputField, { target: { value: "https://github.com/owner/repo" } });

    // Проверяем, что функция setUrl была вызвана с правильным значением
    expect(inputField).toHaveValue("https://github.com/owner/repo");
  });

  test("handles error if URL is incorrect", async () => {
    render(
      <Provider store={store}>
        <Input />
      </Provider>
    );

    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Invalid URL"));

    // Имитируем ввод некорректного URL и клик на кнопку "Load issues"
    fireEvent.change(screen.getByPlaceholderText("Enter repository url"), { target: { value: "invalid-url" } });
    fireEvent.click(screen.getByRole("button", { name: "Load issues" }));

    // Подождем, чтобы обработалась ошибка
    await waitFor(() => {
      // Проверяем, что выводится сообщение об ошибке
      expect(screen.getByDisplayValue("Invalid URL")).toBeInTheDocument();
    });
  });
});
