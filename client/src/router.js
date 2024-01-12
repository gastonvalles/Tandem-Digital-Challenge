import { createRouter, createWebHashHistory } from "vue-router";
import LoginForm from "./components/LoginForm.vue"

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
  },
  //   {
  //     path: "/users",
  //     name: "Users",
  //     component: () => import("./UserList.vue"),
  //   },
  //   {
  //     path: "/register",
  //     name: "Register",
  //     component: () => import("./UserForm.vue"),
  //   },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
