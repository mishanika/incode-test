import Flex from "antd/lib/flex";
import AntInput from "antd/lib/input";
import Button from "antd/lib/button";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPath } from "../../features/path/pathSlice";
import { IssueType, initUpdate, setIssues } from "../../features/issues/issuesSlice";

const Input: React.FC = () => {
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState("");

  const rest = ({ id, title, state, number, created_at, closed_at, updated_at, user, comments }: IssueType) => {
    return {
      id: id,
      title: title,
      state: state,
      number: number,
      created_at: created_at,
      closed_at: closed_at,
      updated_at: updated_at,
      user: {
        login: user.login,
      },
      comments: comments,
    };
  };

  const fetchIssues = async () => {
    try {
      if (!url.match(/^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/)) {
        setUrl("Invalid URL");
        return;
      }
      const path = url.split("/");
      const repoResponse = await fetch(
        `https://api.github.com/repos/${path[path.length - 2]}/${path[path.length - 1]}`
      );
      const repoData = await repoResponse.json();

      dispatch(
        setPath({
          user: path[path.length - 2],
          repo: path[path.length - 1],
          user_url: repoData.owner.html_url,
          repo_url: repoData.html_url,
          stars: repoData.stargazers_count,
        })
      );

      const repoIssuesResponse = await fetch(
        `https://api.github.com/repos/${path[path.length - 2]}/${path[path.length - 1]}/issues?state=all`
      );

      const repoIssuesData: IssueType[] = await repoIssuesResponse.json();

      console.log(repoIssuesData.map((issue) => issue.user.login));
      const local = localStorage.getItem("updates");
      const data = JSON.parse(local || "{}");
      const updates = { ...data };

      dispatch(setIssues(repoIssuesData.map(rest)));

      if (updates[path[path.length - 2]] && updates[path[path.length - 2]][path[path.length - 1]]) {
        dispatch(initUpdate({ user: path[path.length - 2], repo: path[path.length - 1] }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex align="center" gap="15px" style={{ width: "100%" }}>
      <AntInput size="middle" value={url} placeholder="Enter repository url" onChange={(e) => setUrl(e.target.value)} />
      <Button type="primary" onClick={() => fetchIssues()}>
        Load issues
      </Button>
    </Flex>
  );
};

export default Input;
