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

export const slugifyBankingContent = (string) => {
  let str = string, array = [], c = 0
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = String(str)
  .normalize('NFKC') // split accented characters into their base characters and diacritical marks
  .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
  .trim() // trim leading or trailing whitespace

  str.split(/([{}])/).filter(Boolean).forEach(e =>
  // Increase / decrease counter and push desired values to an array
  e == '{' ? c++ : e == '}' ? c-- : c > 0 ? array.push('{' + e + '}') : array.push(e)
  );

  array = array.map(el => {
    if (el[0] == '{') return el.replace(/[^A-Za-z0-9 {}_]/g, '')
    else return el.replace(/[^A-Za-z0-9 {}]/g, '')
  })

  return array.join('')
}

export const getBankingTransferContent = (transfer_content, fields) => {
  let copy_fields = { ...fields }
  for (const [k, v] of Object.entries(copy_fields)) {
    if (typeof v === "object") {
      Object.assign(copy_fields, v);
      delete copy_fields[k];
    }
  }

  const defaultKey = ['ORDER_ID', 'PHONE_NUMBER', 'FULL_NAME']

  const listKey = [...new Set(
    (transfer_content
      .match(/{.*?}/g) || [])
      .map(key => key.replace(/{/g, '').replace(/}/g, ''))
      .filter(key => !defaultKey.includes(key))
  )]

  listKey.forEach(key => {
    const value = copy_fields[key] || ""
    const re = new RegExp(`{${key}}`, 'g')
    transfer_content = transfer_content.replace(re, value)
  })

  return transfer_content
}

export const capitalize = (string) => {
  if (typeof string !== 'string' || string === null) {
    return ''; // Trả về chuỗi rỗng nếu đầu vào không phải là chuỗi hoặc là null
  }

  if (string.length === 0) {
    return ''; // Trả về chuỗi rỗng nếu chuỗi đầu vào rỗng
  }

  // Chuyển đổi ký tự đầu tiên thành chữ hoa
  const firstChar = string.charAt(0).toUpperCase();

  // Chuyển đổi phần còn lại của chuỗi thành chữ thường
  const restOfString = string.slice(1).toLowerCase();

  return firstChar + restOfString;
}