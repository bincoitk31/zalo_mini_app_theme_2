import React, { useEffect, useState } from "react"
import moment from "moment"

const CountDownOrder = ({data}) => {
  console.log(data, 'dataaaaa')
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  
  const minuteText = () => {
    if (minute < 10) {
      return `0${minute}`;
    }
    return minute
  }
  
  const secondText = () => {
    if (second < 10) {
      return `0${second}`;
    }
    return second;
  }

  const calcTime = () => {
    const duration = 10 * 60;
    const endDate = moment.utc(data.order_transaction.inserted_at);
    const now = moment.utc();

    const diffNow = now.diff(endDate, "seconds");

    if (diffNow > duration) {
      setMinute(0);
      setSecond(0);
      //window.location.reload()
    } else {
      const rest = duration - diffNow;
      setMinute(Math.floor(rest / 60));
      setSecond(rest % 60);
    }
  }

  const countDown = () => {
    setInterval(() => {
      calcTime();
    }, 1000);
  }

  useEffect(() => {
    calcTime()
    countDown()
  }, [])

  return (
    <>
    {
      minute > 0 || second > 0 ?
        <div className="rounded-lg bg-white py-4 px-4 flex justify-between items-center h-16">
          <div className="font-medium text-black">Hết hạn sau:</div>

          <div className="flex items-center text-base font-medium text-color-primary-v2">
            <div className="overflow-hidden flex items-center justify-center w-[27px] h-8 rounded bg-green-100">
              { minuteText() }
            </div>
            <div className="w-[9px] flex justify-center">:</div>
            <div className="flex items-center justify-center w-[27px] h-8 rounded bg-green-100">
              { secondText() }
            </div>
          </div>
        </div>
       :
        <div className="rounded bg-red-50 p-4 text-red-700">
          <div className="text-center"> Đơn hàng đã hết hạn thanh toán </div>
        </div>
    }
    </>
  )
}

export default CountDownOrder