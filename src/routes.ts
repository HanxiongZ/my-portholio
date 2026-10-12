import { createBrowserRouter } from "react-router";
import React from "react";
import { Layout } from "./components/portfolio/Layout";
const OppoAudioCover = React.lazy(() => import("./components/portfolio/OppoAudioCover").then(m => ({default: m.OppoAudioCover})));
const OppoAudio = React.lazy(() => import("./components/portfolio/OppoAudio").then(m => ({default: m.OppoAudio})));
const VolvoTactile = React.lazy(() => import("./components/portfolio/VolvoTactile").then(m => ({default: m.VolvoTactile})));
const CoActNordic = React.lazy(() => import("./components/portfolio/CoActNordic").then(m => ({default: m.CoActNordic})));
const CoActJournal = React.lazy(() => import("./components/portfolio/CoActJournal").then(m => ({default: m.CoActJournal})));
const CoActCase = React.lazy(() => import("./components/portfolio/CoActCase").then(m => ({default: m.CoActCase})));
const CoActEditorial = React.lazy(() => import("./components/portfolio/CoActEditorial").then(m => ({default: m.CoActEditorial})));
const CoActRefined = React.lazy(() => import("./components/portfolio/CoActRefined").then(m => ({default: m.CoActRefined})));
const CoActFieldnotesLight = React.lazy(() => import("./components/portfolio/CoActFieldnotesLight").then(m => ({default: m.CoActFieldnotesLight})));
const CoActFieldnotes = React.lazy(() => import("./components/portfolio/CoActFieldnotes").then(m => ({default: m.CoActFieldnotes})));
const CoActStudio = React.lazy(() => import("./components/portfolio/CoActStudio").then(m => ({default: m.CoActStudio})));

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

// TEMPORARY: haptics animation sandbox. Delete this + its route when done.
const HapticsTest = React.lazy(() =>
  import("./components/portfolio/HapticsTest").then((module) => ({
    default: module.HapticsTest,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "project/oppo-audio", Component: OppoAudio },
      { path: "project/oppo-audio-cover", Component: OppoAudioCover },
      { path: "project/volvo-tactile", Component: VolvoTactile },
      { path: "project/co-act-nordic", Component: CoActNordic },
      { path: "project/co-act-journal", Component: CoActJournal },
      { path: "project/co-act-case", Component: CoActCase },
      { path: "project/co-act-editorial", Component: CoActEditorial },
      { path: "project/co-act-refined", Component: CoActRefined },
      { path: "project/co-act-studio", Component: CoActStudio },
      { path: "project/co-act-fieldnotes-light", Component: CoActFieldnotesLight },
      { path: "project/co-act-fieldnotes", Component: CoActFieldnotes },
      // Keep dynamic route as fallback
      { path: "project/:id", Component: ProjectDetail },
      // Explicit routes for each project so Figma Make can list them
      { path: "project/1", Component: ProjectDetail },
      { path: "project/2", Component: ProjectDetail },
      { path: "project/3", Component: ProjectDetail },
      { path: "project/co-act-original", Component: ProjectDetail },
      { path: "project/4", Component: ProjectDetail },
      { path: "project/5", Component: OppoAudioCover },
      { path: "project/6", Component: ProjectDetail },
      { path: "project/7", Component: ProjectDetail },
      { path: "project/8", Component: ProjectDetail },
      { path: "project/9", Component: ProjectDetail },
      // TEMPORARY: haptics animation sandbox
      { path: "haptics-test", Component: HapticsTest },
    ],
  },
]);
