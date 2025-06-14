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
  const { categories, total, error, message } = await client.listCategories();
  console.log(categories, "categories")
  res.json({categories, total, error, message})
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
  console.log(req.body, "req.bodyyyyy")
  console.log(paymentChannels, "paymentChannels")
  console.log(error, "error")
  console.log(message, "message")
  if (error != 0) return res.status(400).json({error, message})
    const results = await Promise.all(payment_channels.map(async (channel) => {
      const paymentChannel = paymentChannels.find(c => c.method === channel.method)
      if (paymentChannel) {
        let data = {...channel, channelId: paymentChannel.channelId}
        console.log(data, "dataaaaa1111")
        const { channelId, error, message } = await client.updatePaymentChannel(data);
        console.log(channelId, "channelId1111")
        console.log(error, "error1111")
        console.log(message, "message1111")
        return { channelId, error, message }
      } else {
        let data = {...channel, miniAppId: mini_app_id, status: "ACTIVE"}
        console.log(data, "dataaaaa2222")
        const { channelId, error, message } = await client.createPaymentChannel(data);
        console.log(channelId, "channelId2222")
        console.log(error, "error2222")
        console.log(message, "message2222")
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
