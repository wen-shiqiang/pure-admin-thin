const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "ep:home-filled",
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "首页",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/admin/index",
      name: "MyIndex",
      component: () => import("@/views/index/index.vue"),
      meta: {
        title: "主页",
        breadcrumb: false
        // keepAlive: false,
        // activePath: "/admin/index",
        // activeMenu: "/admin/index"
      }
    }
  ]
} satisfies RouteConfigsTable;
