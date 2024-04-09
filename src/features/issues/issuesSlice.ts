import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type Move = {
  destination: { droppableId: string; index: number } | null | undefined;
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
  user: string;
  repo: string;
  sameSource: boolean;
};

export type IssueType = {
  id: number;
  title: string;
  state: string;
  number: number;
  created_at: string;
  closed_at: string | null;
  updated_at: string | null;
  user: {
    login: string;
  };
  comments: number;
};

export type Issues = {
  toDo: IssueType[];
  inProgress: IssueType[];
  done: IssueType[];
};

const initialState: Issues = {
  toDo: [],
  inProgress: [],
  done: [],
};

export const issuesSlice = createSlice({
  name: "issues",
  initialState,

  reducers: {
    setIssues: (state, action: PayloadAction<IssueType[]>) => {
      state.toDo = action.payload.filter((issue) => issue.state === "open" && !issue.updated_at);
      state.inProgress = action.payload.filter((issue) => issue.state === "open" && issue.updated_at);
      state.done = action.payload.filter((issue) => issue.state === "closed");
    },
    initUpdate: (state, action: PayloadAction<{ user: string; repo: string }>) => {
      const local = localStorage.getItem("updates");
      const data = JSON.parse(local || "{}");

      const updates = { ...data };
      console.log(updates);

      const repo = updates[action.payload.user][action.payload.repo];

      const sorted: { id: string; destination: string; source: string; index: number }[] = [];

      for (const key in repo) {
        sorted.push(repo[key]);
      }

      sorted.sort((a, b) => a.index - b.index);

      for (let i = 0; i < sorted.length; i++) {
        const issueId = state[repo[sorted[i].id].source as keyof typeof state].findIndex((issue) => {
          return issue.id === parseInt(sorted[i].id);
        });
        state[repo[sorted[i].id].destination as keyof Issues].splice(
          repo[sorted[i].id].index,
          0,
          state[repo[sorted[i].id].source as keyof Issues][issueId]
        );
        state[repo[sorted[i].id].source as keyof Issues].splice(issueId, 1);
      }
    },
    updateIssues: (state, action: PayloadAction<Move>) => {
      const { destination, source, draggableId, user, repo } = action.payload;

      if (destination) {
        if (action.payload.sameSource) {
          const temp = state[source.droppableId as keyof Issues][source.index];
          state[destination.droppableId as keyof Issues].splice(source.index, 1);
          state[destination.droppableId as keyof Issues].splice(destination.index, 0, temp);
        } else {
          state[destination.droppableId as keyof Issues].splice(
            destination.index,
            0,
            state[source.droppableId as keyof Issues][source.index]
          );
          state[source.droppableId as keyof Issues].splice(source.index, 1);
        }

        const local = localStorage.getItem("updates");
        const data = JSON.parse(local || "{}");

        const updates = { ...data };

        if (!updates[user]) {
          updates[user] = {};
        }
        if (!updates[user][repo]) {
          updates[user][repo] = {};
        }
        if (!updates[user][repo][draggableId]) {
          updates[user][repo][draggableId] = {};
        }

        for (const key in updates[user][repo]) {
          if (updates[user][repo][key].index === destination.index) {
            updates[user][repo][key].index =
              updates[user][repo][key].index +
              (updates[user][repo][draggableId].index < updates[user][repo][key].index ? -1 : 1);
            break;
          }
        }

        updates[user][repo][draggableId] = {
          id: draggableId,
          destination: destination.droppableId,
          source: action.payload.sameSource ? updates[user][repo][draggableId].source : source.droppableId,
          index: destination.index,
        };

        console.log(updates);

        localStorage.setItem("updates", JSON.stringify(updates));
      }
    },
  },
});

export const { setIssues, updateIssues, initUpdate } = issuesSlice.actions;

export const selectIssues = (state: RootState): Issues => state.issues;

export default issuesSlice.reducer;
