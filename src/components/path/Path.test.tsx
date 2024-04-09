import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import * as reduxHooks from "../../app/hooks";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../app/store";
import Path from "./Path";

jest.mock("../../app/hooks");

const mockedSelector = jest.spyOn(reduxHooks, "useAppSelector");

describe("Path component", () => {
  beforeEach(() => {
    mockedSelector.mockClear();
  });

  test("renders user and repo with correct links", () => {
    mockedSelector.mockReturnValue({
      user: "username",
      repo: "repository",
      user_url: "https://github.com/mishanika",
      repo_url: "https://github.com/mishanika/monopoly",
      stars: 100,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Path />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("username")).toBeInTheDocument();
    expect(screen.getByText("repository")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "username" })).toHaveAttribute("href", "https://github.com/mishanika");
    expect(screen.getByRole("link", { name: "repository" })).toHaveAttribute(
      "href",
      "https://github.com/mishanika/monopoly"
    );
  });

  test("renders stars count if stars exist", () => {
    mockedSelector.mockReturnValue({
      user: "username",
      repo: "repository",
      user_url: "/username",
      repo_url: "/username/repository",
      stars: 100,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Path />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("100 Stars")).toBeInTheDocument();
  });

  test("does not render stars count if stars do not exist", () => {
    mockedSelector.mockReturnValue({
      user: "username",
      repo: "repository",
      user_url: "/username",
      repo_url: "/username/repository",
      stars: undefined,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Path />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText("Stars")).not.toBeInTheDocument();
  });
});
