export const setIsAuthenticated = (state, data) => {
    state.isAuthenticated = data;//注册页面返回来的data
};

export const setUser = (state, data) => {
    state.user = data;//注册的用户信息
    //console.log(state.user);
};

export const setProfile = (state, data) => {
    state.profile = data;
};

export const setLoading = (state, data) => {
    state.loading = data;
};

export const setProfiles = (state, data) => {
    state.profiles = data;//所有用户的信息
};