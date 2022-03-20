import axios from "axios";
import Vue from "../main";
let base = "api";

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// 拦截axios请求从服务器得到的响应
axios.interceptors.response.use(
  resp => {
    // console.log(resp);
    if (resp.status === 403) {
      console.log(resp);
      Vue.$router.push({ path: "/login" });
    }
    return resp;
  },
  (error) => {
    //敏感接口.如果没有session跳转登录界面
    // console.log(error)
    if (error.response.status === 403) {
      Vue.$router.push({ path: "/login" });
    }
    return Promise.reject(error);
  }
);

export const postRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
  });
};

export const uploadFileRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const putRequest = (url, params) => {
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

export const deleteRequest = url => {
  return axios({
    method: "delete",
    url: `${base}${url}`
  });
};

export const getRequest = (url, params) => {
  return axios({
    method: "get",
    data: params,
    headers: {
      "Content-Type": "application/json"
    },
    url: `${base}${url}`
  });
};
