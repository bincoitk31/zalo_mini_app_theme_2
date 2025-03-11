import { nativeStorage } from "zmp-sdk/apis"

export const validatePhoneNumber = (value) => {
  const cleanPhoneNumber = value.replace(/\s+/g, "").trim();
  const vietnamPhoneRegex = /^(?:\+84|0)(3[2-9]|5[2-9]|7[0-9]|8[1-9]|9[0-9])\d{7}$/;
  return vietnamPhoneRegex.test(cleanPhoneNumber);
};

export const isValidEmail= (email) =>  {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const setDataToStorage = (key, value) => {
  try {
    let valueJson = JSON.stringify(value)
    nativeStorage.setItem(key, valueJson);
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export const getDataToStorage = (key) => {
  try {
    const value = nativeStorage.getItem(key);
    return JSON.parse(value)
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export const removeStorageData = (key) => {
  try {
    nativeStorage.removeItem(key);
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};