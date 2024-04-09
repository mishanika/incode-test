import { Typography } from "antd";
import Flex from "antd/lib/flex";
import Issue from "../issue/Issue";
import { IssueType, selectIssues, updateIssues } from "../../features/issues/issuesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { selectPath } from "../../features/path/pathSlice";

const Issues: React.FC = () => {
  const { toDo, inProgress, done } = useAppSelector(selectIssues);
  const { user, repo } = useAppSelector(selectPath);
  const dispatch = useAppDispatch();

  const issueRender = (item: IssueType, id: number) => <Issue {...item} index={id} />;

  const onEnd = (result: DropResult) => {
    if (result.destination && result.destination.droppableId === result.source.droppableId) {
      dispatch(
        updateIssues({
          destination: result.destination,
          source: result.source,
          draggableId: result.draggableId,
          user: user,
          repo: repo,
          sameSource: true,
        })
      );
    } else {
      dispatch(
        updateIssues({
          destination: result.destination,
          source: result.source,
          draggableId: result.draggableId,
          user: user,
          repo: repo,
          sameSource: false,
        })
      );
    }

    console.log(result);
  };

  return (
    <Flex data-testid="issues-component" style={{ width: "100%" }} vertical>
      <Flex gap="15px" justify="space-evenly" style={{ width: "100%" }}>
        <Typography.Title style={{ marginTop: "1.2em" }}>To Do</Typography.Title>
        <Typography.Title>In progress</Typography.Title>
        <Typography.Title>Done</Typography.Title>
      </Flex>
      <DragDropContext onDragEnd={(result) => onEnd(result)}>
        <Flex style={{ border: "1px solid black", borderRadius: "1rem" }}>
          <Droppable droppableId="toDo" type="ISSUE">
            {(provided, snapshot) => (
              <Flex
                gap="15px"
                align="center"
                data-testid="toDo"
                vertical
                style={{ display: "flex", width: "33%", borderRight: "1px solid black", padding: "15px 0" }}
                ref={provided.innerRef}
                key="toDo"
                {...provided.droppableProps}
              >
                {toDo.map(issueRender)}
              </Flex>
            )}
          </Droppable>
          <Droppable droppableId="inProgress" type="ISSUE">
            {(provided, snapshot) => (
              <Flex
                gap="15px"
                align="center"
                data-testid="inProgress"
                vertical
                style={{ display: "flex", width: "33%", borderRight: "1px solid black", padding: "15px 0" }}
                ref={provided.innerRef}
                key="inProgress"
                {...provided.droppableProps}
              >
                {inProgress.map(issueRender)}
              </Flex>
            )}
          </Droppable>
          <Droppable droppableId="done" type="ISSUE">
            {(provided, snapshot) => (
              <Flex
                gap="15px"
                align="center"
                data-testid="done"
                vertical
                style={{ display: "flex", width: "33%", padding: "15px 0" }}
                ref={provided.innerRef}
                key="done"
                {...provided.droppableProps}
              >
                {done.map(issueRender)}
              </Flex>
            )}
          </Droppable>
        </Flex>
      </DragDropContext>
    </Flex>
  );
};

export default Issues;
