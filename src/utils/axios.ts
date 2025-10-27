import axios from "axios";

export const BASE_URL = process.env.NODE_ENV === "production" ? '' : '';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // timeout: 1000,
});

axiosInstance.interceptors.request.use(request => {
  if (request.headers) {
    // request.headers["Authorization"] = ""
  }
  return request;
})

axiosInstance.interceptors.response.use(response => {
  const { data } = response;
    
  if (data.code === "200") {
    return data.data;
  }

  Promise.reject(data.message);
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;