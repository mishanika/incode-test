import "./Issue.css";
import Flex from "antd/lib/flex";
import { IssueType } from "../../features/issues/issuesSlice";
import { Typography } from "antd";
import { Draggable } from "react-beautiful-dnd";

const Issue: React.FC<IssueType & { index: number }> = ({ id, title, number, created_at, user, comments, index }) => {
  return (
    <Draggable draggableId={`${id}`} index={index} key={id}>
      {(provided, snapshot) => (
        <Flex
          gap="10px"
          vertical
          className="issue"
          data-testid={id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Typography.Text
            style={{
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            {title}
          </Typography.Text>
          <Typography.Text>{`#${number} opened ${Math.floor(
            (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)
          )} day ago`}</Typography.Text>
          <Flex gap="10px">
            <Typography.Text>{user.login}</Typography.Text> |{" "}
            <Typography.Text>{`Comments: ${comments}`}</Typography.Text>
          </Flex>
        </Flex>
      )}
    </Draggable>
  );
};

export default Issue;
