//   store文件夹用于存储数据状态  &而该文件用于配置vuex
import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';//将getters模块化，另外起了一个getters.js文件
import * as mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);//在vue中使用vuex

const state = {
    isAuthenticated: false, //是否认证，即是否登录成功，若登录成功就为true
    user: {},//对应的用户信息
    profile: {}, //存储用户个人信息
    loading: false,
    profiles: []
}

export default new Vuex.Store({
    state,//存储状态（变量）
    getters,//对数据获取之前的再次编译，可以理解为state的计算属性。在组件中使用 $store.getters.fun()
    mutations,//同步操作，更改状态的方法，具体操作的分发
    actions //异步操作。在组件中使用是$store.dispath('')
})