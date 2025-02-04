const express = require('express');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON request bodies

app.post('/api/run_command', (req, res) => {
  const { command, description, app_id, access_token, site_id, zalo_secret_key } = req.body;
  console.log(req.body, "reqqqqq")
  if (!command) {
      return res.status(400).json({ error: 'Command is required' });
  }

  console.log(process.env.APP_ID, "APP_IDDD")
  process.env.VITE_SITE_ID = site_id
  process.env.APP_ID = app_id
  process.env.VITE_ZALO_SECRET_KEY = zalo_secret_key
  console.log(process.env.VITE_SITE_ID, "site_id")
  //Chạy script
  runDeployment(command, description, app_id, access_token).then((output) => {
    console.log("\n🚀 Deployment Complete:\n", output);

    res.json(output)
  }).catch((err) => {
    console.error("\n❌ Deployment Failed:\n", err);
  });
});

async function runDeployment(command, description, app_id, access_token) {
  return new Promise((resolve, reject) => {
      console.log("🚀 Starting deployment...");

      // Chạy lệnh `zmp login`
      const loginProcess = spawn("zmp", ["login"], { stdio: ["pipe", "pipe", "inherit"]});
      let isAppIdEntered = false;
      let isLoginMethodSelected = false;
      let isAccessTokenEntered = false;

      // Xử lý dữ liệu đầu ra từ quá trình
      loginProcess.stdout.on("data", (data) => {
        const text = data.toString();
        console.log("texttttt", text);
        // Nhập mini app id nếu yêu cầu
        if (loginProcess.stdin.writable) {
          if (text.includes("Mini App ID") && !isAppIdEntered) {
            loginProcess.stdin.write(`${app_id}\n`)
            isAppIdEntered = true
          }

          // Chọn Login Method, tự động chọn "Login with App Access Token"
          if (text.includes("Choose a Login Method") && !isLoginMethodSelected) {
            loginProcess.stdin.write("2\n"); // Chọn Testing
            isLoginMethodSelected = true
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
          // Chạy lệnh `zmp deploy`
          const deployProcess = spawn("zmp", ["deploy"]);

          // Lưu trữ output từ terminal
          let output = "";

          // Xử lý dữ liệu đầu ra từ quá trình
          deployProcess.stdout.on("data", (data) => {
              const text = data.toString();
              // output += text;
              if (text.includes("Version:")) output += text
              console.log("11111",text);

              // Nếu xuất hiện menu chọn phiên bản, tự động chọn "Development"
              if (text.includes("What version status are you deploying?")) {
                if (versionChoice === "Development") {
                    deployProcess.stdin.write("\n"); // Chọn Development (mặc định khi nhấn Enter)
                } else if (versionChoice === "Testing") {
                    deployProcess.stdin.write("Testing\n"); // Chọn Testing
                }
              }

              // Nếu yêu cầu mô tả, nhập "dev"
              if (text.includes("Description:")) {
                  deployProcess.stdin.write(`${description}\n`);
              }
          });

          deployProcess.stderr.on("data", (data) => {
              console.error(`22222: ${data}`);
              const text = data.toString();
              if (text.includes("Version:")) output += text
          });

          // Khi lệnh kết thúc
          deployProcess.on("close", (code) => {
              console.log(`✅ Deployment process exited with code ${code}`);
              const match = output.match(/✔ Version: (\S+)/); // Tìm chuỗi sau "✔ Version: "
              const version = match ? match[1] : null;

              console.log(version, "hihihihi");

              resolve(version);
          });

          deployProcess.on("error", (err) => {
              console.error(`❌ Failed to start process: ${err.message}`);
              reject(err);
          });
        }
      })

      
  });
}

app.listen(port, '0.0.0.0',() => {
  console.log(`Server running at http://localhost:${port}`);
});