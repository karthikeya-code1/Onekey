import { useEffect, useState } from "react";
import type { App } from "primary-backend";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
// import { treaty } from "@elysia/eden";
import { Landing } from "./pages/Landing";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Credits } from "./pages/Credits";
import { Apikeys } from "./pages/Apikeys";
import { QueryClient, QueryClientProvider } from "react-query";
import { ElysiaClientContextProvider } from "./providers/Eden";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/signin"} element={<Signin />} />
          <Route path={"/dashboard"} element={<Dashboard />} />
          <Route path={"/credits"} element={<Credits />} />
          <Route path={"/apikeys"} element={<Apikeys />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
