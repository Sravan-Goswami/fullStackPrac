const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 3000;
const logFile = path.join(__dirname, "visitors.log");
const backupFile = path.join(__dirname, "backup.log");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/updateUser") {
    const entry = `Visited at: ${new Date().toISOString()}\n`;

    fs.appendFile(logFile, entry, (err) => {
      if (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Failed to update log" }));
      }
      res.end(JSON.stringify({ message: "User logged" }));
    });
  }

  else if (req.method === "GET" && req.url === "/saveLog") {
    fs.readFile(logFile, "utf8", (err, data) => {
      if (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Cannot read log" }));
      }
      res.end(JSON.stringify({ log: data }));
    });
  }

  else if (req.method === "POST" && req.url === "/backup") {
    fs.copyFile(logFile, backupFile, (err) => {
      if (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Backup failed" }));
      }
      res.end(JSON.stringify({ message: "Backup created" }));
    });
  }

  else if (req.method === "GET" && req.url === "/clearLog") {
    fs.writeFile(logFile, "", (err) => {
      if (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Clear failed" }));
      }
      res.end(JSON.stringify({ message: "Log cleared" }));
    });
  }

  else if (req.method === "GET" && req.url === "/serverInfo") {
    const info = {
      platform: os.platform(),
      cpu: os.cpus().length,
      uptime: os.uptime(),
      memory: os.totalmem(),
      freeMemory: os.freemem(),
    };
    res.end(JSON.stringify(info, null, 2));
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});