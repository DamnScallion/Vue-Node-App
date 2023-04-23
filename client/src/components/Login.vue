<template>
  <!-- 登录 -->
  <div class="login">
    <div class="container">
      <div class="row">
        <div class="col-md-8 m-auto">
          <h1 class="display-4 text-center">登录</h1>
          <p class="lead text-center">使用已有的账号登录</p>
          <form @submit.prevent="submit" autocomplete="off" method="post">
            <TextField
              type="email"
              name="email"
              placeholder="邮箱地址"
              v-model="user.email"
              :error="errors.email"
            />
            <TextField
              type="password"
              name="password"
              placeholder="密码"
              v-model="user.password"
              :error="errors.password"
            />
            <input type="submit" class="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode"; //引入用于解析token
import TextField from "./common/TextFieldGroup";
export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      errors: {}
    };
  },
  components: {
    TextField
  },
  methods: {
    submit() {
      //console.log(this.user.email);
      this.$axios
        .post("/api/users/login", this.user)
        .then(res => {
          //console.log(res.data);
          //存储token到localStorage里面来
          const { token } = res.data;
          window.localStorage.setItem("jwtToken", token);

          //解析token
          const decoded = jwt_decode(token);
          //console.log(decoded);

          //分发action更改store的state
          this.$store.dispatch("setIsAuthenticated", !this.isEmpty(decoded)); //更改授权
          this.$store.dispatch("setUser", decoded);

          this.errors = {}; //将错误提示清空
          //页面跳转
          this.$router.push("/dashboard");
        })
        .catch(err => {
          if (err.response.data) {
            this.errors = err.response.data;
          }
        });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
</style>

