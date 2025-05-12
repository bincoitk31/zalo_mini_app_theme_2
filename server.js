const express = require('express');
const { spawn, exec } = require('child_process');
const fs = require('fs');
require('dotenv').config();
const { PartnerClient, createMiniApp, updatePaymentSetting, createPaymentChannel, deployMiniApp } = require("zmp-openapi-nodejs")

const app = express();
const port = 3002;
const client = new PartnerClient(
  "97771a9d-16ac-4de7-a6ec-d5fe7419fe1d",
  "1133",
)

app.use(express.json()); // To parse JSON request bodies

app.post('/api/run_command', (req, res) => {
  const { env, command, description, app_id, access_token, site_id, zalo_secret_key, zalo_oa_id, zalo_private_key, settings } = req.body;

  if (!command) {
      return res.status(400).json({ error: 'Command is required' });
  }

  console.log(req.body, "BODYYYYYY")
  
  process.env.VITE_SITE_ID = site_id
  process.env.VITE_ZALO_SECRET_KEY = zalo_secret_key
  process.env.VITE_ZALO_OA_ID = zalo_oa_id
  process.env.VITE_APP_ID = app_id
  process.env.VITE_ZALO_PRIVATE_KEY = zalo_private_key
  process.env.VITE_ENV = env
  process.env.APP_ID = app_id

  //write settings to app-settings.json

  fs.writeFileSync('app-settings.json', JSON.stringify(settings, null, 2), 'utf8');

  console.log(JSON.stringify(settings, null, 2), "settinggg")

  runDeployment(command, description, app_id, access_token).then((output) => {
    console.log("outputtt", output)
    res.json(output)
  }).catch((err) => {
    console.error("\n❌ Deployment Failed:\n", err);
  }).finally(() => {
    exec("rm -rf .env", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Lỗi khi xóa .env: ${error.message}`);
        return;
      }
      delete process.env.APP_ID
      delete process.env.VITE_SITE_ID
      delete process.env.VITE_ZALO_SECRET_KEY
      delete process.env.VITE_ZALO_OA_ID
      delete process.env.VITE_ZALO_PRIVATE_KEY
      delete process.env.VITE_ENV

      fs.writeFileSync('app-settings.json', JSON.stringify({}, null, 2), 'utf8');
      console.log(stdout)
    })
  })

});

async function runDeployment(command, description, app_id, access_token) {
  return new Promise((resolve, reject) => {
      console.log("🚀 Starting deployment...");

      // Chạy lệnh `zmp login`
      const loginProcess = spawn("zmp", ["login"],  {stdio: ["pipe", "pipe", "inherit"]});
      let isAppIdEntered = false;
      let isLoginMethodSelected = false;
      let isAccessTokenEntered = false;

      // Xử lý dữ liệu đầu ra từ quá trình
      loginProcess.stdout.on("data", (data) => {
        const text = data.toString();
        // Lưu trữ output từ terminal
        console.log("textttt",text)
        
        // Nhập mini app id nếu yêu cầu
        if (loginProcess.stdin.writable) {
          if (text.includes("Mini App ID") && !isAppIdEntered) {
            loginProcess.stdin.write(`${app_id}\n`)
            isAppIdEntered = true
          }

        // Chọn Login Method, tự động chọn "Login with App Access Token"
        if (text.includes("Choose a Login Method") && !isLoginMethodSelected) {
          loginProcess.stdin.write("2\n");
          isLoginMethodSelected = true;
        }

          // Nhập "access token"
          if (text.includes("Zalo Access Token:") && !isAccessTokenEntered) {
            loginProcess.stdin.write(`${access_token}\n`);
            isAccessTokenEntered = true
          }

        }
      });

      loginProcess.stdin.on("error", (err) => {
        console.error("❌ Lỗi stdin:", err.message);
      });

      loginProcess.on("exit", (code) => {
        if (code === 0) {
          // Kiểm tra nếu command là "dev" hoặc "test" để chọn đúng version
          const versionChoice = command === "test" ? "Testing" : "Development";
          let isVersionChoiseEntered = false
          let isDesEntered = false
          // Chạy lệnh `zmp deploy`
          const deployProcess = spawn("zmp", ["deploy"]);

        // Lưu trữ output từ terminal
        let output = "";

          // Xử lý dữ liệu đầu ra từ quá trình
          deployProcess.stdout.on("data", (data) => {
              const text = data.toString();
              console.log(text, "texx")
              // output += text;
              if (text.includes("Version:")) output += text

              // Nếu xuất hiện menu chọn phiên bản, tự động chọn "Development"
              if (text.includes("What version status are you deploying?") && !isVersionChoiseEntered) {
                if (versionChoice === "Development") {
                    deployProcess.stdin.write("\n"); // Chọn Development (mặc định khi nhấn Enter)
                } else if (versionChoice === "Testing") {
                    deployProcess.stdin.write("2\n"); // Chọn Testing
                }
                isVersionChoiseEntered = true
              }

              // Nếu yêu cầu mô tả, nhập "dev"
              if (text.includes("Description:") && !isDesEntered) {
                  deployProcess.stdin.write(`${description}\n`);
                  isDesEntered = true
              }
          });

          deployProcess.stderr.on("data", (data) => {
              const text = data.toString();
              console.log(text, "texx")
              if (text.includes("Version:")) output += text
          });

          // Khi lệnh kết thúc
          deployProcess.on("close", (code) => {
              const match = output.match(/✔ Version: (\S+)/); // Tìm chuỗi sau "✔ Version: "
              const version = match ? match[1] : null
              resolve(version)
          });

          deployProcess.on("error", (err) => {
              console.error(`❌ Failed to start process: ${err.message}`);
              reject(err);
          });
        }
      })

  });
}

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

  res.status(200).json({appId: res_create_mini_app.appId, appName: res_create_mini_app.appName, privateKey: res_payment.privateKey })
})

app.post('/api/test', async (req, res) => {

  const { paymentChannels, error, message } = await client.listPaymentChannels({
    miniAppId: "2583693547572750764",
  });
  res.json({paymentChannels, error, message})
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

app.post('/api/deploy', async (req, res) => {
  const { createReadStream } = require('fs')
  const { env, description, app_id, site_id, zalo_oa_id, zalo_private_key, settings, name } = req.body

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
