import { createBrowserRouter } from "react-router";
import React from "react";
import { Layout } from "./components/portfolio/Layout";

const Home = React.lazy(() =>
  import("./components/portfolio/Home").then((module) => ({
    default: module.Home,
  }))
);

const ProjectDetail = React.lazy(() =>
  import("./components/portfolio/ProjectDetail").then((module) => ({
    default: module.ProjectDetail,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      // Keep dynamic route as fallback
      { path: "project/:id", Component: ProjectDetail },
      // Explicit routes for each project so Figma Make can list them
      { path: "project/1", Component: ProjectDetail },
      { path: "project/2", Component: ProjectDetail },
      { path: "project/3", Component: ProjectDetail },
      { path: "project/4", Component: ProjectDetail },
      { path: "project/5", Component: ProjectDetail },
      { path: "project/6", Component: ProjectDetail },
      { path: "project/7", Component: ProjectDetail },
      { path: "project/8", Component: ProjectDetail },
      { path: "project/9", Component: ProjectDetail },
    ],
  },
]);
