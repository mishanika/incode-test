import { render, screen } from "@testing-library/react";
import Layout from "./Layout"; // Импортируйте компонент Layout
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../app/store";

describe("Layout component", () => {
  test("renders input, path, and issues components", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("path-component")).toBeInTheDocument();
    expect(screen.getByTestId("issues-component")).toBeInTheDocument();
  });

  test("applies correct styles", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    const antLayoutElement = screen.getByTestId("layout-component");
    expect(antLayoutElement).toHaveStyle({ padding: "25px", alignItems: "center" });
  });
});
