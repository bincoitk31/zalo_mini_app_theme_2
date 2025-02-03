import { memberZaloState, phoneMemberZaloState } from "../../recoil/member"
import { useRecoilValue } from "recoil"

const Infomation = () => {
  const memberZalo = useRecoilValue(memberZaloState)
  const phoneNumber = useRecoilValue(phoneMemberZaloState)

  console.log(memberZalo, "memberZalooo")
  console.log(phoneNumber, "phoneeeeNumberr")

  return (
    <>
    {
      memberZalo ?
        <div>
          <div className="font-bold pb-4"> Thông tin khách hàng </div>
          <div className="flex">
            <div>
              <img src={memberZalo.avatar} className="w-[50px] h-[50px] rounded-full"/>
            </div>
            <div className="pl-2">
              <div>{memberZalo.name}</div>
              <div>{phoneNumber}</div>
            </div>
          </div>
        </div>
      : <div></div>
    }
    
   </>
  )
}

export default Infomation