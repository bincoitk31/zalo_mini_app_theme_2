import React, { useEffect, useState } from "react"

import { QRCodeCanvas} from "qrcode.react"
import { getQRCodeBankPayment } from "../../utils/genQRBanking"
import { getBankingTransferContent, slugifyBankingContent } from "../../utils/tools"
import { Button } from "antd"
import { formatNumber } from "../../utils/formatNumber"
import { Socket } from "phoenix"

import CountDownOrder from "./countdown-order"
import TcbTransactionSuccess from "./tcb-transaction-success"
import TcbTransactionError from "./tcb-transaction-error"
import PaymentInfomation from "./payment-infomation"
import OrderInfomation from "./order-infomation"



const QrTcb = () => {

  const data = {
    "order": {
        "bill_full_name": "kaka",
        "bill_phone_number": "0966002940",
        "display_id": 606,
        "id": 3558863,
        "inserted_at": "2025-07-07T02:59:43",
        "invoice_value": 320000,
        "render_id": "868f762c-0d3a-47b9-b145-cb0f5900cbd4",
        "transfer_content": null,
        "transfer_money": 0
    },
    "order_transaction": {
        "amount": 320000,
        "content": "Thanh toan don hang 868f762c-0d3a-47b9-b145-cb0f5900cbd4",
        "created_at": "2025-07-07T02:59:47",
        "id": "840792ce-703c-4ff1-9bce-30de3649bb73",
        "inserted_at": "2025-07-07T02:59:47",
        "is_cancel": false,
        "is_expired": false,
        "order_render_id": "868f762c-0d3a-47b9-b145-cb0f5900cbd4",
        "paid_amount": 0,
        "payment_info": {
            "bank_code": "techcombank",
            "merchant_name": "PHAN THI PHUONG",
            "success": true,
            "token_code": "MD041751857187525XM"
        },
        "payment_type": "storecake_payment_techcombank",
        "response_code": null,
        "site_id": "54018bc2-d66b-4fdb-9cbf-30758cf6d59e",
        "transaction_no": null,
        "type": "storecake",
        "updated_at": "2025-07-07T02:59:47",
        "virtual_account": "MD041751857187525XM"
    },
    "site": {
        "currency": "VND",
        "id": "54018bc2-d66b-4fdb-9cbf-30758cf6d59e",
        "name": "abc"
    },
    "vituarl_bank_account": "MD041751857187525XM"
  }




  const [qrCode, setQrCode] = useState(null)

  const transferContent = () => {
    let text = data.order.transfer_content

    if (text) {
      text = text.replaceAll('{ORDER_ID}', data.order.display_id || data.order.render_id)
        .replaceAll('{PHONE_NUMBER}', data.order.bill_phone_number)
        .replaceAll('{FULL_NAME}', data.order.bill_full_name)

      text = getBankingTransferContent(text, data.order.fields)
    }
    else text = `Thanh toan don hang ${data.order.display_id || data.order.render_id}`

    return slugifyBankingContent(text)
  }

  const sendMessage = () => {
    console.log('vaoooooo')
  }

  const connectSocket = () => {
    // Sau khi tạo đơn thành công
    const siteId = "54018bc2-d66b-4fdb-9cbf-30758cf6d59e" // site_id
    const renderId = "414cb375-7662-4331-8402-d394e359976e" // render_id

    const uri = "ws://localhost:24679/socket";

    window.paymentSocket = new Socket(uri);
    window.paymentSocket.connect();

    const channelTcb = window.paymentSocket.channel(`tcb_payment::${siteId}:${renderId}`, {});

    console.log(channelTcb, 'channelTcb')

    channelTcb.on(`tcb_payment_success_${renderId}`, (msg) => {
      let payload = JSON.parse(msg.payload);
      console.log(payload, 'payloadtttttt')
      //this.tcbStore.changeField("order.transfer_money", 320000);
    });

    channelTcb
      .join()
      .receive("error", (resp) => {
        console.error('[ERROR_JOIN_CHANNEL_TCB_PAYMENT]', resp);
      });
  }

  useEffect(() => {
    const content = transferContent()

    const encodeText = getQRCodeBankPayment(
      data.vituarl_bank_account,
      data.order.invoice_value,
      content
    );
    if (encodeText) {
     setQrCode(encodeText)
    }
  }, [])

  useEffect(() => {
    connectSocket()
    return () => {
      window.paymentSocket.disconnect();
    }
  }, [])

  return (
    <div className="p-4">
      <Button onClick={() => sendMessage()}>Send message</Button>
      {
        !data.order.transfer_money ? (
          <div className="mb-4">
            <CountDownOrder data={data} />
          </div>
        ) : (
          <TcbTransactionSuccess data={data} />
        )
      }
      <div className="bg-[url('https://content.pancake.vn/1/s500x500/81/02/74/0a/68f6c4f088cae89f2aada53999474da01c01abfda75a9891a3822a46.png')] h-[508] lg:h-[484px] rounded-lg bg-tcb-payment bg-cover text-white flex flex-col items-center mb-4">
        <div className="text-base leading-6 font-light my-6 max-w-[220px] lg:max-w-[500px] text-center px-4">
          Sử dụng App ngân hàng hỗ trợ QR code để quét mã
        </div>

        <div className="rounded w-[222px] h-[292px] bg-white overflow-hidden text-[#494C4E]">
          <div className="text-sm text-center font-normal mt-4">
            Quét mã QR chuyển khoản
          </div>
          <div className="w-full flex justify-center py-3">
            <QRCodeCanvas id="QRCode" value={qrCode} size={180} />
          </div>
          <div className="text-[12px] text-center">
            Nhấn giữ QR để tải xuống
          </div>
        </div>

        <div className="my-6 text-center">
          <div className="text-base mb-2 font-light">Số tiền thanh toán</div>
          <div className="text-3xl font-medium">
            {formatNumber(data.order.invoice_value, data.site.currency)}
          </div>
        </div>
      </div>

      <PaymentInfomation data={data}/>
      <OrderInfomation data={data}/>

      <div className="mt-4">
        <Button className="w-full h-[42px] text-sm">Hủy thanh toán</Button>
      </div>
    </div>
  )
}

export default QrTcb