import { memberZaloState, phoneMemberZaloState, customerState } from "../../recoil/member"
import { useRecoilState } from "recoil"
import { SignIn, CaretRight } from "@phosphor-icons/react"
import { authorize, getPhoneNumber, getAccessToken, getUserInfo } from "zmp-sdk/apis"
import { getApiAxios, postApi } from '../../utils/request'

const Infomation = () => {
  const [phoneNumber, setPhoneMember] = useRecoilState(phoneMemberZaloState)
  const [memberZalo, setMemberZalo] = useRecoilState(memberZaloState)
  const [customer, setCustomer] = useRecoilState(customerState)

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      return userInfo
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error)
    }
  }

  const getTokenUser = async () => {
    try {
      let token = await getAccessToken({});
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
    let userInfo = await getUser()
    let secretKey = import.meta.env.VITE_ZALO_SECRET_KEY

    let url = "https://graph.zalo.me/v2.0/me/info"
    let options = {
      code: code,
      access_token: token,
      secret_key: secretKey,
    }

    getApiAxios(url, {headers: options})
    .then(res => {
      if (res.status == 200) {
        setPhoneMember(res.data.data.number)
        setMemberZalo(userInfo)
        // get thông tin khách hàng qua sdt từ store
        console.log(res, "res phone_numberrr")
        console.log(userInfo, "memberrrr")
        loginStorecake()

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
        getPhoneNumberFromToken()
      }

    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const loginStorecake = async () => {
    try {
      let url = "/login"
      // let data = {
      //   phone_number: phoneNumber,
      //   avatar: memberZalo.avatar,
      //   name: memberZalo.name,
      //   zalo_id: memberZalo.id
      // }
      let data = {
        phone_number: '84328821098',
        avatar: 'https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png',
        name: 'HungBin',
        zalo_id: "2345684758342"
      }
      const res = await postApi(url, data)
      if (res.status == 200) {
        console.log(res, "resss")
        setCustomer(res.data.customer)
      }
    } catch(error) {
      console.log(error, "Error login storecake")
    }
  }

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
              <div className="text-[12px] text-center pl-2">Đăng nhập / đăng ký thành viên</div>
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