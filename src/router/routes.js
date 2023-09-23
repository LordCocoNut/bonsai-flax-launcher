/** @enum */
export const PAGE_NAMES = {
  engine: "engine",
  projects: "projects",
  homepage: "homepage",
};

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: PAGE_NAMES.homepage,
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: PAGE_NAMES.engine,
        path: "engine",
        component: () => import("pages/EnginePage.vue"),
      },
      {
        name: PAGE_NAMES.projects,
        path: "projects",
        component: () => import("pages/ProjectsPage.vue"),
      },
    ],
  },
];

export default routes;
