import axios from "axios";
import { ElMessage } from "element-plus";

// console.log(import.meta.env.VITE_BASE_URL);
const inst = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// console.log(import.meta.env.VITE_BASE_URL, import.meta.env.MODE);

const statusMap = new Map([
  [500, "服务器出错辣！"],
  [404, "接口不存在！"],
  [401, "无权访问！"],
  [403, "拒绝服务！"],
  [405, "请求类型错误！"],
]);

inst.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  () => {
    ElMessage.error({
      message: "请求失败，请检查网络情况！",
    });
  }
);

inst.interceptors.response.use(
  (config) => {
    const { data } = config;

    return data;
  },
  (error) => {
    const {
      response: { status },
    } = error;
    if (statusMap.has(status)) {
      ElMessage.error({
        message: statusMap.get(status),
      });
    }
  }
);

export default inst;
