<template>
  <div class="post-form mb-3">
    <div class="card card-info">
      <div class="card-header bg-info text-white">说点啥...</div>
      <div class="card-body">
        <form @submit.prevent="submit">
          <TextArea name="text" placeholder="随便说点..." v-model="text" :error="errors.text" />
          <input type="submit" class="btn btn-dark" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "../common/TextAreaGroup";
export default {
  name: "commentForm",
  data() {
    return {
      text: "",
      errors: {}
    };
  },
  props: {
    postId: String
  },
  methods: {
    submit() {
      //console.log(this.text);
      const user = this.$store.getters.user; //获取到当前user

      const newComment = {
        text: this.text,
        name: user.name,
        avatar: user.avatar
      };

      //添加评论
      this.$axios
        .post(`/api/posts/comment/${this.postId}`, newComment)
        .then(res => {
          this.errors = {};
          this.text = "";
          this.$emit("update"); //用于回调父级方法，可实现自动刷新
        })
        .catch(err => {
          this.errors = err.response.data;
        });
    }
  },
  components: {
    TextArea
  }
};
</script>

<style scoped>
</style>