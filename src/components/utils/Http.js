import axios from 'axios';

const baseUrl = 'https://api.lianjia.oopmind.com';
// const baseUrl = 'http://localhost:8060';

// axios 拦截器
axios.interceptors.request.use(config => {
  // loading
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.resolve(error.response);
});

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    if (response.data.status === 0) {
      return response.data;
    }
    return {
      status: response.data.status,
      message: response.data.message
    };
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  };
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.message);
  }
  if (res && res.status !== 0) {
    if (res.status === 7) {
      alert('登录超时，请重新登录');
    } else {
      alert(res.message);
    }
  }
  return res;
}

export default {
  post(url, data) {
    return axios({
      method: 'post',
      baseURL: baseUrl,
      url,
      data: data,
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response);
      }
    ).then(
      (res) => {
        return checkCode(res);
      }
    );
  },
  get(url, params) {
    return axios({
      method: 'get',
      baseURL: baseUrl,
      url,
      params, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response);
      }
    ).then(
      (res) => {
        return checkCode(res);
      }
    );
  }
};
