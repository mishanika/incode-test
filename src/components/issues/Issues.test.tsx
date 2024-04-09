import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import * as reduxHooks from "../../app/hooks";

import Issues from "./Issues"; // Импортируйте компонент Issues
import { store } from "../../app/store";
import { MemoryRouter } from "react-router-dom";
import * as actions from "../../features/issues/issuesSlice";

const mockedSelector = jest.spyOn(reduxHooks, "useAppSelector");
const mockedDispatch = jest.spyOn(reduxHooks, "useAppDispatch");

const mockIssues = {
  toDo: [
    {
      id: "1",
      title: "ToDo Task 1",
      number: 1,
      created_at: new Date().toISOString(),
      user: { login: "user1" },
      comments: 2,
    },
    {
      id: "4",
      title: "ToDo Task 4",
      number: 1,
      created_at: new Date().toISOString(),
      user: { login: "user4" },
      comments: 2,
    },
  ],
  inProgress: [
    {
      id: "2",
      title: "InProgress Task 1",
      number: 2,
      created_at: new Date().toISOString(),
      user: { login: "user2" },
      comments: 1,
    },
  ],
  done: [
    {
      id: "3",
      title: "Done Task 1",
      number: 3,
      created_at: new Date().toISOString(),
      user: { login: "user3" },
      comments: 0,
    },
  ],
};

describe("Issues component", () => {
  test("renders tasks in each category", () => {
    mockedSelector.mockReturnValue(mockIssues);

    render(
      <Provider store={store}>
        <Issues />
      </Provider>
    );

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();

    expect(screen.getByText("ToDo Task 1")).toBeInTheDocument();
    expect(screen.getByText("InProgress Task 1")).toBeInTheDocument();
    expect(screen.getByText("Done Task 1")).toBeInTheDocument();
  });

  test("calls updateIssues when task is dropped into different category", async () => {
    mockedSelector.mockReturnValue(mockIssues);

    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
      </Provider>
    );

    const draggable = screen.getByTestId("1");
    const droppable = screen.getByTestId("inProgress");

    fireEvent.dragStart(draggable);
    fireEvent.dragOver(droppable);
    fireEvent.drop(droppable);
    fireEvent.dragEnd(draggable);

    expect(mockedDispatch).toHaveBeenCalledTimes(1);
  });

  test("calls updateIssues with correct parameters when task is dropped into same category", async () => {
    mockedSelector.mockReturnValue(mockIssues);

    const dispatch = jest.fn();
    mockedDispatch.mockReturnValue(dispatch);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
      </Provider>
    );

    const draggable = screen.getByTestId("1");
    const droppable = screen.getByTestId("inProgress");

    fireEvent.dragStart(draggable);
    fireEvent.dragOver(droppable);
    fireEvent.drop(droppable);
    fireEvent.dragEnd(draggable);
  });

  test("renders tasks correctly with empty data", () => {
    const emptyData = {
      toDo: [],
      inProgress: [],
      done: [],
    };
    mockedSelector.mockReturnValue(emptyData);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Issues />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
