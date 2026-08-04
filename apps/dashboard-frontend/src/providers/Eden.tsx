import { treaty } from "@elysiajs/eden";
import type { App } from "primary-backend";
import { createContext, useContext } from "react";

const client = treaty<App>("http://localhost:3001", {
  headers: {
    // any custom headers can go here
  },
  fetch: {
    credentials: "include",
  },
});

export const ElysiaClientContext = createContext(client);

export const ElysiaClientContextProvider = ElysiaClientContext.Provider;
export const useElysiaClient = () => {
  const client = useContext(ElysiaClientContext);
  return client;
};
