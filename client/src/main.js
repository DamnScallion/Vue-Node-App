// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from './utils/http';//里面的axios有自带token的header
import store from './store';

Vue.prototype.$axios = axios;//全局配置后main.js下的每个组件都可以使用$axios进行请求

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,//挂载到实例上
  router,
  components: { App },
  template: '<App/>'
})
