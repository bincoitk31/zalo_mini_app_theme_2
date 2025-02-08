import { Button } from "antd"
import { useRecoilState } from "recoil"
import { followOA, unfollowOA, interactOA } from "zmp-sdk/apis"
import { memberZaloState } from "../recoil/member"
import { useEffect } from "react"

const FollowOA = () => {
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)

  const unfollow = async () => {
    try {
      let oa_id = import.meta.env.VITE_ZALO_OA_ID
      const res = await unfollowOA({
        id: oa_id
      });
      setMemberZalo({...memberZalo, followedOA: false})
      console.log(res, "unfollow oa_id")
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const follow = async () => {
    try {
      let oa_id = import.meta.env.VITE_ZALO_OA_ID
      const res = await followOA({
        id: oa_id
      });
      console.log(res, "res follow OA")
      setMemberZalo({...memberZalo, followedOA: true})
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  }

  return (
    <div className="p-2 bg-[#fff]">
      <div className="p-2 border border-solid border-[#000] rounded-lg bg-[#f2f2f2]">
        <div className="border-b border-b-solid border-[#fff] pb-2">Quan tâm OA để nhận các đặc quyền ưu đãi </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <img className="w-[30px] h-[30px] rounded-full bg-[#fff]" src="https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png" />
            <div className="font-bold pl-2"> STORECAKE </div>
          </div>
          {
            memberZalo ?.followedOA ?
            <Button onClick={() => unfollow()} color="default" variant="solid" className="font-bold text-[12px] rounded-full">Bỏ quan tâm</Button>
            :
            <Button onClick={() => follow()} color="default" variant="solid" className="font-bold text-[12px] rounded-full">Quan tâm</Button>
          }
        </div>
      </div>
    </div>
  )
}

export default FollowOA