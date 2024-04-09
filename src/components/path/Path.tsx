import Flex from "antd/lib/flex";
import { Typography } from "antd";
import { useAppSelector } from "../../app/hooks";
import { selectPath } from "../../features/path/pathSlice";
import { Link } from "react-router-dom";
import Star from "../../assets/svg/Star";

const Path: React.FC = () => {
  const { user, repo, user_url, repo_url, stars } = useAppSelector(selectPath);

  return (
    <Flex gap={"25px"} data-testid="path-component" style={{ alignSelf: "flex-start" }}>
      <Flex gap={"10px"}>
        <Link to={user_url} target="_blank" color="#1677ff">
          <Typography.Text style={{ fontWeight: 500, fontSize: "1.5rem" }}>{user.length ? user : ""}</Typography.Text>
        </Link>
        <Typography.Text style={{ fontWeight: 500, fontSize: "1.5rem" }}>
          {repo.length && user.length ? ">" : ""}
        </Typography.Text>
        <Link to={repo_url} target="_blank">
          <Typography.Text style={{ fontWeight: 500, fontSize: "1.5rem" }}>{repo.length ? repo : ""}</Typography.Text>
        </Link>
      </Flex>

      <Typography.Text style={{ fontWeight: 500, fontSize: "1.5rem" }}>
        {stars && stars > 0 ? (
          <Flex gap={"10px"} align="center">
            <Star /> {`${stars} Stars`}
          </Flex>
        ) : (
          ""
        )}{" "}
      </Typography.Text>
    </Flex>
  );
};

export default Path;
