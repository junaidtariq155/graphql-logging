// index.js

const fs = require("fs");

class GraphQLLogger {
  constructor(logsFilePath = "graphql-logs.json") {
    this.logsFilePath = logsFilePath;
    this.logs = this.loadLogs();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
    this.saveLogs();
  }

  getLogs() {
    return this.logs;
  }

  loadLogs() {
    try {
      const data = fs.readFileSync(this.logsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or is corrupted, return an empty array
      return [];
    }
  }

  saveLogs() {
    try {
      const data = JSON.stringify(this.logs, null, 2);
      fs.writeFileSync(this.logsFilePath, data);
    } catch (error) {
      console.error("Error saving logs:", error.message);
    }
  }

  exportLogs(options = {}) {
    const { format = "json", filePath } = options;

    if (format === "json") {
      this.exportToJSON(filePath);
    } else if (format === "csv") {
      this.exportToCSV(filePath);
    } else {
      console.error("Invalid format specified. Supported formats: json, csv");
    }
  }

  exportToCSV(csvFilePath = "graphql-logs.csv") {
    const csvData = this.logs.map((log) => [log]);
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    fs.writeFileSync(csvFilePath, "Log\n");
    fs.appendFileSync(csvFilePath, csvContent);

    console.log(`Logs exported to CSV: ${csvFilePath}`);
  }

  exportToJSON(jsonFilePath = "graphql-logs-export.json") {
    const data = JSON.stringify(this.logs, null, 2);
    fs.writeFileSync(jsonFilePath, data);
    console.log(`Logs exported to JSON: ${jsonFilePath}`);
  }

  middleware() {
    return (req, res, next) => {
      const start = Date.now();
      const originalEnd = res.end;

      // Capture GraphQL queries
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk.toString();
      });

      req.on("end", () => {
        const parsedBody = JSON.parse(requestBody);
        if (parsedBody && parsedBody.query) {
          this.log(`GraphQL Query: ${parsedBody.query}`);
        }
      });

      // Capture GraphQL connections
      res.end = (chunk, encoding) => {
        res.end = originalEnd;
        const duration = Date.now() - start;

        if (res.statusCode === 200) {
          this.log(
            `GraphQL Connection: ${req.method} ${req.url} - ${duration}ms`
          );
        }

        res.end(chunk, encoding);
      };

      next();
    };
  }
}

module.exports = GraphQLLogger;
