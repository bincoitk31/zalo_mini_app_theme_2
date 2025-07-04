const express = require('express');
const { spawn, exec } = require('child_process');
const fs = require('fs');

require('dotenv').config();
const { PartnerClient, createMiniApp, updatePaymentSetting, createPaymentChannel, deployMiniApp, listCategories, listPaymentChannels, updatePaymentChannel } = require("zmp-openapi-nodejs")

const app = express();
const port = 3002;
const client = new PartnerClient(
  "97771a9d-16ac-4de7-a6ec-d5fe7419fe1d",
  "1133",
)

app.use(express.json()); // To parse JSON request bodies

app.post('/api/create_zalo_mini_app', async (req, res) => {
  console.log("vaoooo")
  const { name, description, category, logo, subCategory } = req.body

  console.log(req.body, "req.bodyyyyy")

  const res_create_mini_app = await client.createMiniApp({
    appName: name,
    appDescription: description,
    appCategory: category,
    appLogoUrl: logo,
    browsable: true,
    appSubCategory: subCategory
  });
  console.log(res_create_mini_app, "res_create_mini_app")
  if (res_create_mini_app.error != 0) {
    return res.status(400).json({error: res_create_mini_app.error, message: res_create_mini_app.message})
  }

  const app_id = res_create_mini_app.appId
  const res_payment = await client.updatePaymentSetting({
    miniAppId: app_id,
    callbackUrl: "https://api.storecake.io/api/v1/zalo_mini_app/callback",
    sandboxCallbackUrl: "https://api.storecake.io/api/v1/zalo_mini_app/callback",
    status: "ACTIVE",
  });
  console.log(res_payment, "res_payment")

    if (res_payment.error != 0) {
      return res.status(400).json({ error: res_payment.error, message: res_payment.message });
    }

  console.log(res_payment.error, "app_id")

  const data = {
    method: "COD",
    miniAppId: app_id,
    status: "ACTIVE",
    notifyUrl: "https://api.storecake.io/api/v1/zalo_mini_app/callback",
    redirectPath: "/"
  }

  const res_create_payment_channel = await client.createPaymentChannel(data);
  console.log(res_create_payment_channel, "res_create_payment_channel")

  if (res_create_payment_channel.error != 0) {
    return res.status(400).json({error: res_create_payment_channel.error, message: res_create_payment_channel.message})
  }

  res.status(200).json({appId: res_create_mini_app.appId, appName: res_create_mini_app.appName, privateKey: res_payment.paymentSetting.privateKey })
})

app.post('/api/test', async (req, res) => {
  const { paymentChannels, error, message } = await client.listPaymentChannels({
    miniAppId: "2484018188571193268",
  });
  console.log(paymentChannels, "paymentChannels")
  res.status(200).json({paymentChannels, error, message})
})

app.post('/api/get_versions', async (req, res) => {
  const { app_id, limit, offset } = req.body
  const { versions, total, error, message } = await client.getVersionsMiniApp({
    miniAppId: app_id,
    offset: offset || 0,
    limit: limit || 10,
  })
  res.status(200).json({versions, total, error, message})
})

app.post('/api/publish', async (req, res) => {
  const { app_id, version_id } = req.body
  const { error, message } = await client.publishMiniApp({
    miniAppId: app_id,
    versionId: version_id,
  })
  res.status(200).json({error, message})
})

app.post('/api/upsert_payment_channels', async (req, res) => {
  const { mini_app_id, payment_channels } = req.body
  const { paymentChannels, error, message } = await client.listPaymentChannels({
    miniAppId: mini_app_id,
  });

  console.log(paymentChannels, "paymentChannels111")
  console.log(payment_channels, "payment_channels222")

  // const payment_channels = [
  //   {
  //     "displayName": "COD",
  //     "isSandbox": true,
  //     "method": "COD",
  //     "thumbnail": "https://content.pancake.vn/1/s700x700/fwebp0/47/5d/8a/32/205d0cff4110716026077e6d7bd721d05a365a3fcb17c34cd579adbb.png"
  //   },
  //   {
  //     "accessKey": "4321",
  //     "method": "MOMO_SANDBOX",
  //     "partnerCode": "1234",
  //     "publicKey": null,
  //     "secretKey": "1234"
  //   },
  //   {
  //     "key1": "1234",
  //     "key2": "4321",
  //     "merchantAppId": "idzalopay",
  //     "method": "ZALOPAY_SANDBOX"
  //   },
  //   {
  //     "customMethod": "STORECAKE",
  //     "displayName": "Storecake",
  //     "isSandbox": true,
  //     "method": "CUSTOM",
  //     "thumbnail": "https://content.pancake.vn/1/s700x700/fwebp0/47/5d/8a/32/205d0cff4110716026077e6d7bd721d05a365a3fcb17c34cd579adbb.png"
  //   }
  // ]


  // paymentchanel = [
  //     {
  //        thumbnail: 'https://stc-zmp.zadn.vn/payment/cod.png',
  //        method: 'COD',
  //        isCustom: false,
  //        name: 'Thanh toán khi nhận hàng',
  //        redirectPath: '/',
  //        id: 7388,
  //        isSandbox: false,
  //        status: 'ACTIVE'
  //     },
  //     {
  //        thumbnail: 'https://stc-zmp.zadn.vn/payment/momo.png',
  //        method: 'MOMO_SANDBOX',
  //        isCustom: false,
  //        name: 'Ví Momo - Sandbox',
  //        id: 7628,
  //        isSandbox: true,
  //        status: 'ACTIVE'
  //     },
  //     {
  //        thumbnail: 'https://stc-zmp.zadn.vn/payment/vnpay.png',
  //        method: 'VNPAY_SANDBOX',
  //        isCustom: false,
  //        name: 'Ví VNPay - Sandbox',
  //        redirectPath: '/',
  //        id: 7630,
  //        isSandbox: true,
  //        status: 'ACTIVE'
  //     },
  //     {
  //        thumbnail: 'https://stc-zmp.zadn.vn/payment/zalopay.png',
  //        method: 'ZALOPAY_SANDBOX',
  //        isCustom: false,
  //        name: 'Ví ZaloPay - Sandbox',
  //        redirectPath: '/',
  //        id: 7637,
  //        isSandbox: true,
  //        status: 'ACTIVE'
  //     },
  //     {
  //        thumbnail: 'https://stc-zmp.zadn.vn/payment/zalopay.png',
  //        method: 'ZALOPAY',
  //        isCustom: false,
  //        name: 'Ví ZaloPay',
  //        redirectPath: '/',
  //        id: 7627,
  //        isSandbox: false,
  //        status: 'INACTIVE'
  //     },
  //     {
  //        thumbnail: 'https://logo-mapps.zdn.vn/8a7ad52d73689a36c379.jpg',
  //        method: 'STORECAKE',
  //        name: 'Storecake',
  //        isCustom: true,
  //        id: 1001056,
  //        isSandbox: true,
  //        status: 'ACTIVE'
  //     }
  //    ]

  if (error != 0) return res.status(400).json({error, message})
    const inactive_payment_channels = paymentChannels.filter(c => !payment_channels.find(p => p.method == c.method || p.customMethod == c.method) && c.status == "ACTIVE")
    console.log(inactive_payment_channels, "inactive_payment_channels")
    const results_inactive = await Promise.all(inactive_payment_channels.map(async (channel) => {
      const { channelId, error, message } = await client.updatePaymentChannel({
        ...channel,
        channelId: channel.id,
        status: "INACTIVE",
        miniAppId: mini_app_id
      })
      return { channelId, error, message }
    }))

    console.log(results_inactive, "results_inactive")

    if (error != 0) return res.status(400).json({error, message})
    const results = await Promise.all(payment_channels.map(async (channel) => {
      const paymentChannel = paymentChannels.find(c => c.method === channel.method || c.method === channel.customMethod)
      if (channel.method == "CUSTOM") {
        channel.thumbnail =  fs.createReadStream('./src/assets/images/storecake.webp')
      }
      if (paymentChannel) {
        let data = {...channel, channelId: paymentChannel.id,  miniAppId: mini_app_id}
        const { channelId, error, message } = await client.updatePaymentChannel(data);
        return { channelId, error, message }
      } else {
        let data = {...channel, miniAppId: mini_app_id, status: "ACTIVE", redirectPath: "/"}
        const { channelId, error, message } = await client.createPaymentChannel(data);
        return { channelId, error, message }
      }
    }))

    res.status(200).json({results, error, message})
})

app.post('/api/deploy', async (req, res) => {
  const { createReadStream } = require('fs')
  const { env, description, app_id, site_id, zalo_oa_id, zalo_private_key, settings, name, zalo_secret_key } = req.body

  try {
    // Kiểm tra các tham số bắt buộc
    if (!app_id || !name || !description) {
      return res.status(400).json({ error: 1, message: "miniAppId, name, description is required" });
    }

    // thêm env
    process.env.VITE_SITE_ID = site_id
    process.env.VITE_ZALO_OA_ID = zalo_oa_id
    process.env.VITE_APP_ID = app_id
    process.env.VITE_ZALO_PRIVATE_KEY = zalo_private_key
    process.env.VITE_ENV = env
    process.env.APP_ID = app_id
    process.env.VITE_ZALO_SECRET_KEY = zalo_secret_key
    //write settings to app-settings.json
    fs.writeFileSync('app-settings.json', JSON.stringify(settings, null, 2), 'utf8');

    //run build
    const isBuildSuccess = await runBuild()
    if (!isBuildSuccess) {
      return res.status(400).json({message: "Build failed" });
    }
    // clean env
    await cleanEnv()

    // Tạo read stream với buffer size phù hợp
    const file = createReadStream("build.zip");

    const { versionId, entrypoint, error, message } = await client.deployMiniApp({
      miniAppId: app_id,
      file,
      name,
      description,
    });

    if (error !== 0) {
      return res.status(400).json({ error, message });
    }

    res.status(200).json({
      versionId,
      entrypoint,
      message: "Deploy successful"
    });
  } catch (err) {
    console.error('Deploy error:', err);
    res.status(500).json({ error: 1, message: err.message });
  }
});

async function runBuild() {
  return new Promise((resolve, reject) => {
    exec('npm run build:zip', (error, stdout, stderr) => {
      if (error) {
        console.error('Error running build:', error);
        reject(error);
        return;
      }
      console.log('Build successful:', stdout);
      resolve(true);
    });
  });
}

async function cleanEnv() {
  return new Promise((resolve, reject) => {
    exec("rm -rf .env", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Lỗi khi xóa .env: ${error.message}`);
        reject(error);
        return;
      }
      delete process.env.APP_ID;
      delete process.env.VITE_SITE_ID;
      delete process.env.VITE_ZALO_SECRET_KEY;
      delete process.env.VITE_ZALO_OA_ID;
      delete process.env.VITE_ZALO_PRIVATE_KEY;
      delete process.env.VITE_ENV;

      fs.writeFileSync('app-settings.json', JSON.stringify({}, null, 2), 'utf8');
      resolve();
    });
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
