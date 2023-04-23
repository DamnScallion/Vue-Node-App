<template>
  <div class="dashboard">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1 class="display-4">个人中心</h1>
          <p v-if="user!==null" class="lead text-muted">
            Welcome
            <router-link v-if="profile==null" to="/profiles">{{user.name}}</router-link>
            <router-link v-else :to="`/profile/${profile.handle}`">{{user.name}}</router-link>
          </p>
          <div v-if="profile!=null">
            <!-- 编辑个人信息  添加个人经历  添加教育经历 -->
            <ProfileActived />

            <!-- 展示个人经历 -->
            <Experience @deleteExperience="deleteExperience" :experience="profile.experience" />

            <!-- 展示教育经历 -->
            <Education @deleteEducation="deleteEducation" :education="profile.education" />

            <!-- 删除用户按钮 -->
            <div style="margin-bottom:60px">
              <button class="btn btn-danger" @click="deleteClick">删除当前账户</button>
            </div>
          </div>
          <div v-else>
            <p>没有任何相关的个人信息，请添加您的个人信息</p>
            <router-link to="/create-profile" class="btn btn-lg btn-info">添加个人信息</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileActived from "./common/ProfileActived";
import Experience from "./common/Experience";
import Education from "./common/Education";
export default {
  name: "Dashboard",
  data() {
    return {
      profile: null
    };
  },
  components: {
    ProfileActived,
    Experience,
    Education
  },
  computed: {
    user() {
      return this.$store.getters.user; //从vuex中获取到user
    }
  },
  methods: {
    getProfileData() {
      this.$axios
        .get("api/profile")
        .then(res => {
          //console.log(res.data);
          this.profile = res.data;

          //更新到store
          this.$store.dispatch("setProfile", this.profile);
        })
        .catch(err => {
          console.log(err.response);
          //更新到store
          this.$store.dispatch("setProfile", null);
        });
    },
    deleteClick() {
      this.$axios
        .delete("/api/profile")
        .then(res => {
          this.profile = null;
          //更新store
          this.$store.dispatch("clearCurrentState");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteExperience(id) {
      this.$axios
        .delete(`api/profile/experience/${id}`) //用反引号为了获取id
        .then(res => {
          this.profile = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteEducation(id) {
      this.$axios
        .delete(`api/profile/education/${id}`) //用反引号为了获取id
        .then(res => {
          this.profile = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    //this.getProfileData();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getProfileData(); //每当进入该组件之前都会执行这个方法，以保证每次都是重新请求
    });
  }
};
</script>

<style scoped>
</style>

