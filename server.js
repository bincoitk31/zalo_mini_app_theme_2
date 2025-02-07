const express = require('express');
const { spawn, exec } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON request bodies

app.post('/api/run_command', (req, res) => {
  const { command, description, app_id, access_token, site_id, zalo_secret_key, zalo_oa_id } = req.body;

  if (!command) {
      return res.status(400).json({ error: 'Command is required' });
  }

  console.log(req.body, "BODYYYYYY")
  
  process.env.VITE_SITE_ID = site_id
  //process.env.APP_ID = app_id
  process.env.VITE_ZALO_SECRET_KEY = zalo_secret_key
  process.env.VITE_ZALO_OA_ID = zalo_oa_id

  runDeployment(command, description, app_id, access_token).then((output) => {
    console.log("outputtt", output)
    res.json(output)
  }).catch((err) => {
    console.error("\n❌ Deployment Failed:\n", err);
  }).finally(() => {
    //removeEnvVariableAndRestart()
  })
  
});

function removeEnvVariableAndRestart() {
  const envPath = '.env';

  if (!fs.existsSync(envPath)) {
      console.log("⚠️ File .env không tồn tại!");
      return;
  }

  // Đọc nội dung file .env và lọc bỏ dòng chứa APP_ID
  const envLines = fs.readFileSync(envPath, 'utf-8')
      .split('\n')
      .filter(line => !line.startsWith('APP_ID=')); // Xóa dòng APP_ID

  // Ghi lại file .env mà không có APP_ID
  fs.writeFileSync(envPath, envLines.join('\n'), 'utf-8');
  console.log("✅ Đã xóa APP_ID khỏi file .env!");

  // Xóa APP_ID khỏi process.env (nếu đang chạy)
  delete process.env.APP_ID;

  // Restart server
  console.log("♻️ Đang khởi động lại ứng dụng...");
  exec("pm2 restart zalo --update-env", (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Lỗi khi stop & restart: ${error.message}`);
        return;
    }
    console.log(stdout)
  });

  
}

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

app.listen(port, '0.0.0.0',() => {
  console.log(`Server running at http://localhost:${port}`);
});