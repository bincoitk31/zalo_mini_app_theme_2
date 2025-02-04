const express = require('express');
const { exec, spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON request bodies

app.post('/run-command', (req, res) => {
  const { command } = req.body;

  if (!command) {
      return res.status(400).json({ error: 'Command is required' });
  }

  // // You could add additional logic to check for safe commands here (security)
  // exec(command, (error, stdout, stderr) => {
  //     if (error) {
  //         return res.status(500).json({ error: `Execution error: ${error.message}` });
  //     }
  //     if (stderr) {
  //         return res.status(500).json({ stderr });
  //     }
  //     // Send the command output to the client
  //     res.json({
  //         stdout: stdout.trim(), // Trim to remove any trailing newlines
  //     });
  // });

  // Chạy script
  runDeployment().then((output) => {
    console.log("\n🚀 Deployment Complete:\n", output);
    res.json(output)
  }).catch((err) => {
    console.error("\n❌ Deployment Failed:\n", err);
  });
});

async function runDeployment() {
  return new Promise((resolve, reject) => {
      console.log("🚀 Starting deployment...");

      // Chạy lệnh `zmp deploy`
      const deployProcess = spawn("zmp", ["deploy"]);

      // Lưu trữ output từ terminal
      let output = "";

      // Xử lý dữ liệu đầu ra từ quá trình
      deployProcess.stdout.on("data", (data) => {
          const text = data.toString();
          output += text;
          console.log(text);

          // Nếu xuất hiện menu chọn phiên bản, tự động chọn "Development"
          if (text.includes("What version status are you deploying?")) {
              deployProcess.stdin.write("\n"); // Nhấn Enter để chọn mặc định (Development)
          }

          // Nếu yêu cầu mô tả, nhập "dev"
          if (text.includes("Description:")) {
              deployProcess.stdin.write("dev\n");
          }
      });

      deployProcess.stderr.on("data", (data) => {
          console.error(`❌ Error: ${data}`);
      });

      // Khi lệnh kết thúc
      deployProcess.on("close", (code) => {
          console.log(`✅ Deployment process exited with code ${code}`);
          resolve(output);
      });

      deployProcess.on("error", (err) => {
          console.error(`❌ Failed to start process: ${err.message}`);
          reject(err);
      });
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});