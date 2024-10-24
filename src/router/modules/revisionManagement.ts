// const { VITE_HIDE_HOME } = import.meta.env;
// const Layout = () => import("@/layout/index.vue");

export default {
  path: "/admin",
  name: "Admin",
  // component: Layout,
  // redirect: "/login",
  meta: {
    icon: "ep:home-filled",
    title: "修订管理",
    rank: 0,
    breadcrumb: false
  },
  children: [
    {
      path: "/admin/selectTemplate",
      name: "selectTemplate",
      component: () => import("@/views/index/index.vue"),
      meta: {
        title: "修订模板",
        breadcrumb: true
        // showLink: VITE_HIDE_HOME === "true" ? false : true
        // keepAlive: false,
        // activePath: "/admin/selectTemplate",
        // activeMenu: "/admin/selectTemplate"
      }
    }
  ]
} satisfies RouteConfigsTable;
