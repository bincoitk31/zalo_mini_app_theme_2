import { Button } from "antd"
import { useRecoilState } from "recoil"
import { followOA, unfollowOA } from "zmp-sdk/apis"
import { memberZaloState } from "../recoil/member"

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
    <div className="p-2">
      <div className="p-2 border border-solid border-[#000] rounded-lg bg-[#f2f2f2]">
        <div className="border-b border-b-solid border-[#fff] pb-2">Quan tâm OA để nhận các đặc quyền ưu đãi </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <img className="w-[30px] h-[30px] rounded-full bg-[#fff]" src="https://content.pancake.vn/1/s900x900/fwebp/ef/a5/21/80/6c8c38d77a6e2788c681255b20e0b13068010b1eba28895384246920.png" />
            <div className="font-bold pl-2"> PCSG </div>
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