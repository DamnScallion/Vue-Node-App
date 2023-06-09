import Vue from 'vue';
import Router from 'vue-router';
import Landing from '../components/Landing.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from "../components/Dashboard.vue";
import CreateProfile from '../components/CreateProfile.vue';
import EditProfile from '../components/EditProfile.vue';
import AddExperience from '../components/AddExperience.vue';
import AddEducation from '../components/AddEducation.vue';
import Profiles from '../components/Profiles.vue';
import Profile from '../components/profile/Profile.vue';
import Posts from '../components/posts/Posts.vue';
import Post from '../components/posts/Post.vue';

Vue.use(Router);//实例化Router

const route = new Router({
    mode: "history",
    linkActiveClass: 'active',//点击后让路由处于激活状态，使用选中样式
    routes: [
        { path: "*", redirect: "/" },//没有跳转到任何地址的话，就先跳转到Landing里去
        { path: "/", component: Landing },//配置Landing跳转的组件
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/dashboard", component: Dashboard },
        { path: "/create-profile", component: CreateProfile },
        { path: "/edit-profile", component: EditProfile },
        { path: "/add-experience", component: AddExperience },
        { path: "/add-education", component: AddEducation },
        { path: "/profiles", component: Profiles },
        { path: "/profile/:handle", component: Profile },
        { path: "/feed", component: Posts },
        { path: "/post/:id", component: Post }
    ]
});

//全局守卫
route.beforeEach((to, from, next) => {
    //获取token
    const isLogin = localStorage.jwtToken ? true : false;

    if (to.path == "/login" || to.path == "/register" || to.path == "/") {
        next();
    } else {
        isLogin ? next() : next("/login");
    }
})

export default route;

