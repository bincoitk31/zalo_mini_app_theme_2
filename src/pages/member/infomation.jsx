import { memberZaloState, phoneMemberZaloState } from "../../recoil/member"
import { useRecoilState } from "recoil"
import { SignIn, CaretRight } from "@phosphor-icons/react"
import { authorize, getPhoneNumber, getAccessToken, getUserInfo } from "zmp-sdk/apis";
import { getApiAxios } from '../../utils/request';

const Infomation = () => {
  const [phoneNumber, setPhoneMemberZalo] = useRecoilState(phoneMemberZaloState)
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)
  console.log(memberZalo, "memberZalooo")
  console.log(phoneNumber, "phoneeeeNumberr")

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      console.log(userInfo, "userInfooo")
      setMemberZalo(userInfo)
      console.log(memberZalo)
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error)
    }
  }

  const getTokenUser = async () => {
    try {
      let token = await getAccessToken({});
      console.log(token, "rrrrrrrr")
      return token
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error, "error get tokenn");
      return null
    }
  };

  const getCode = async () => {
    try {
      let res = await getPhoneNumber({})
      return res.token
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getPhoneNumberFromToken = async () => {
    let token = await getTokenUser()
    let code = await getCode()
    let secretKey = import.meta.env.VITE_ZALO_SECRET_KEY

    console.log(token, "TÔkenn")
    console.log(code, "codeeee")

    let url = "https://graph.zalo.me/v2.0/me/info"
    let options = {
      code: code,
      access_token: token,
      secret_key: secretKey,
    }
    console.log(options, "optionss")
    getApiAxios(url, {headers: options})
    .then(res => {
      console.log(res, "getPHONEEEE")
      if (res.status == 200) {
        setPhoneMemberZalo(res.data.data.number)
        // get thông tin khách hàng qua sdt từ store
      }
    })
    .catch(err => console.log("get phonenumber error", err))
  }

  const authorizeUser = async () => {
    try {
      const data = await authorize({
        scopes: ["scope.userPhonenumber", "scope.userInfo"],
      });
      console.log(data, "AUthh");
      localStorage.setItem('isAuth', true)
      if (data['scope.userPhonenumber'] && data['scope.userInfo']) {
        //get sdt khách
        getUser()
        getPhoneNumberFromToken()
      }

    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  return (
    <>
    
      
      <div>
        <div className="font-bold"> Thông tin khách hàng </div>
        {memberZalo.id ?
          <div className="flex pt-2">
            <div>
              <img src={memberZalo.avatar} className="w-[50px] h-[50px] rounded-full"/>
            </div>
            <div className="pl-2">
              <div>{memberZalo.name}</div>
              <div>{phoneNumber}</div>
            </div>
          </div>
        :
        <div>
          <div onClick={() => authorizeUser()} className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <div><SignIn size={20} color="#141415" /></div>
              <div className="text-[12px] text-center pl-2">Đăng kí thành viên</div>
            </div>
            <div>
              <CaretRight size={18} color="#141415" />
            </div>
          </div>
        </div>
        }
      </div>
      
    
    
   </>
  )
}

export default Infomation