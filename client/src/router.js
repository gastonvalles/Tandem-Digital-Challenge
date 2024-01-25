import { createRouter, createWebHashHistory } from "vue-router";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import UserList from "./components/UserList.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
  },
  {
    path: "/users",
    name: "Users",
    component: UserList,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterForm,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
