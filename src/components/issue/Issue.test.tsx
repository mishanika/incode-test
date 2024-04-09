import { render, screen } from "@testing-library/react";
import Issue from "./Issue";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { MemoryRouter } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Flex from "antd/lib/flex";
import { IssueType } from "../../features/issues/issuesSlice";

const onEnd = () => {};

const issueRender = (item: IssueType, id: number) => <Issue {...item} index={id} />;

describe("Issue component", () => {
  test("renders issue with correct title, number, and user", () => {
    const issueData = [
      {
        id: 1,
        title: "Sample Issue",
        number: 123,
        created_at: new Date().toISOString(),
        user: { login: "sample_user" },
        comments: 5,
        index: 0,
        state: "open",
        closed_at: new Date().toISOString(),
        updated_at: null,
      },
    ];

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DragDropContext onDragEnd={() => onEnd()}>
            <Droppable droppableId="toDo" type="ISSUE">
              {(provided) => (
                <Flex
                  gap="15px"
                  align="center"
                  vertical
                  style={{ display: "flex", width: "33%", borderRight: "1px solid black", padding: "15px 0" }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {issueData.map(issueRender)}
                </Flex>
              )}
            </Droppable>
          </DragDropContext>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Sample Issue")).toBeInTheDocument();
    expect(screen.getByText("#123 opened 0 day ago")).toBeInTheDocument();
    expect(screen.getByText("sample_user")).toBeInTheDocument();
    expect(screen.getByText("Comments: 5")).toBeInTheDocument();
  });

  test("calculates correct number of days since issue opened", () => {
    const issueData = [
      {
        id: 1,
        title: "Sample Issue",
        number: 123,
        created_at: new Date("2022-01-01").toISOString(), // Assume issue created on Jan 1, 2022
        user: { login: "sample_user" },
        comments: 5,
        index: 0,
        state: "open",
        closed_at: new Date().toISOString(),
        updated_at: null,
      },
    ];

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DragDropContext onDragEnd={() => onEnd()}>
            <Droppable droppableId="toDo" type="ISSUE">
              {(provided) => (
                <Flex
                  gap="15px"
                  align="center"
                  vertical
                  style={{ display: "flex", width: "33%", borderRight: "1px solid black", padding: "15px 0" }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {issueData.map(issueRender)}
                </Flex>
              )}
            </Droppable>
          </DragDropContext>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("#123 opened 829 day ago")).toBeInTheDocument(); // Assuming test run on April 09, 2023
  });

  test("renders issue with correct draggableId and index", () => {
    const issueData = [
      {
        id: 1,
        title: "Sample Issue",
        number: 123,
        created_at: new Date().toISOString(),
        user: { login: "sample_user" },
        comments: 5,
        index: 0,
        state: "open",
        closed_at: new Date().toISOString(),
        updated_at: null,
      },
    ];

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DragDropContext onDragEnd={() => onEnd()}>
            <Droppable droppableId="toDo" type="ISSUE">
              {(provided) => (
                <Flex
                  gap="15px"
                  align="center"
                  vertical
                  style={{ display: "flex", width: "33%", borderRight: "1px solid black", padding: "15px 0" }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {issueData.map(issueRender)}
                </Flex>
              )}
            </Droppable>
          </DragDropContext>
        </MemoryRouter>
      </Provider>
    );

    const draggableElement = screen.getByTestId("1"); // Assuming the draggableId is set to the issue's id
    expect(draggableElement).toHaveAttribute("data-rbd-draggable-id", "1");
  });
});
