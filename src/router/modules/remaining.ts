const Layout = () => import("@/layout/index.vue");
const Header = () => import("@/layout/header.vue");

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "人才培养方案研制平台-登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/loginOld",
    name: "LoginOld",
    component: () => import("@/views/loginOld/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/:schlId",
    name: "mmsLogin",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "人才培养方案研制平台-登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/user",
    component: Header,
    meta: {
      title: "",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/user/emptyState",
        name: "Redirect",
        component: () => import("@/views/emptyState/index.vue"),
        meta: {
          title: "人才培养方案研制平台-空权限",
          showLink: false
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
