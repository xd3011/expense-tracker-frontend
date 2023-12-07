import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5000/api/v1/";

const register = (email, phone_number, user_name, password, nickname) => {
  return axios.post(API_URL + "register", {
    email,
    phone_number,
    user_name,
    password,
    nickname,
  });
};


const login = (user_name, password) => {
  return axios
    .post(API_URL + "login", {
      user_name,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        localStorage.setItem("uid", JSON.stringify(response.data.uid));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("uid");

  return axios.post(API_URL + "logout").then((response) => {
    return response.data;
  });

};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("uid"));
};

const getAccessToken = () => {
  return JSON.parse(localStorage.getItem("accessToken"));
};
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAccessToken,
}

export default AuthService;
