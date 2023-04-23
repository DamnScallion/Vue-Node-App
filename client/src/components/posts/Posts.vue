<template>
  <div class="feed">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <!-- 展示动态发表表单 -->
          <PostForm @update="getPosts" />
          <!-- 展示推荐内容 -->
          <div class="recommendPosts">
            <div class="accordion" id="accordionExample">
              <div class="card" style="border:none;">
                <div id="headingOne">
                  <h2 class="mb-0">
                    <button
                      class="btn btn-info btn-block mr-1"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >您可能喜欢的内容 ></button>
                  </h2>
                </div>

                <div
                  id="collapseOne"
                  class="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <PostFeed
                    v-for="post in recommendPosts"
                    :key="post.index"
                    :post="post"
                    @update="getPosts"
                    :showAction="true"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- 展示动态内容 -->
          <PostFeed
            v-for="post in posts"
            :key="post._id"
            :post="post"
            @update="getPosts"
            :showAction="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostForm from "./PostForm";
import PostFeed from "./PostFeed";
import { RecommendUserService } from "../../../index";
const _ = require("lodash");
// const recommendUserService = new RecommendUserService();
// const result = recommendUserService.start();
export default {
  name: "posts",
  data() {
    return {
      posts: [],
      errors: {},
      flag: 1,
      // t: [],
      currentUserId: "",
      data: [
        {
          userId: "",
          goodsId: ""
        }
      ],
      result: [],
      recommendPosts: []
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getPosts();
      vm.getCurrentUserId();
      vm.recommend();
    });
  },
  methods: {
    getPosts() {
      this.$axios
        .get("/api/posts")
        .then(res => {
          this.posts = res.data;
          // this.t[0] = this.posts[1];
          this.recommendPosts[0] = this.posts[1];
          // console.log(this.posts[7].likes[2].user);

          // this.data.push({
          //   userId: this.posts[7].likes[2].user,
          //   goodsId: this.posts[7]._id
          // });
          // console.log(this.data);
          // this.data.length = 0;
          // this.data = [];

          // this.data = this.data.splice(0, this.data.length);
          if (this.flag == 1) {
            for (let i = 0; i < this.posts.length; i++) {
              for (let j = 0; j < this.posts[i].likes.length; j++) {
                this.data.push({
                  userId: this.posts[i].likes[j].user,
                  goodsId: this.posts[i]._id
                });
              }
            }
            this.flag = 0;
          }
          for (let i = this.posts.length - 1; i < this.posts.length; i++) {
            for (
              let j = this.posts[i].likes.length - 1;
              j < this.posts[i].likes.length;
              j++
            ) {
              this.data.push({
                userId: this.posts[i].likes[j].user,
                goodsId: this.posts[i]._id
              });
            }
          }
          // console.log(this.data);

          // for (let i = 0; i < this.posts.length; i++) {
          //   this.data.push({
          //     // userId: posts[i].likes[0].user,
          //     // goodsId: posts[i]._id
          //     userId: this.posts[i].likes.user,
          //     goodsId: 2
          //   });
          //   console.log(this.data);
          // }
          // console.log(this.recommendPosts.length);
          // for (let i = 0; i < this.posts.length; i++) {
          //   this.recommendPosts[i] = this.posts[i];
          //   console.log(this.recommendPosts[i]);
          // }
          // this.recommendPosts[1] = this.result[0];
          // let num = parseInt(10 * Math.random());
          // this.recommendPosts[0] = this.posts[num];
        })
        .catch(err => {
          this.errors = err.response.data;
        });
    },
    getCurrentUserId() {
      this.$axios
        .get("api/users/current")
        .then(res => {
          this.currentUserId = res.data.id;
          console.log(this.currentUserId);
        })
        .catch(err => {
          this.errors = err.response.data;
        });
    },
    recommend() {
      const recommendUserService = new RecommendUserService(
        this.data,
        this.currentUserId,
        1
      );
      this.result = recommendUserService.start();
      if (this.result.length != 0) {
        this.recommendPosts[1] = _.filter(this.posts, obj => {
          return obj._id == this.result[0];
        });
      }
      console.log(this.result);
    }
  },
  components: {
    PostForm,
    PostFeed
  }
};
</script>


<style scoped>
.recommendPosts {
  /* border: 1px dashed black; */
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>

