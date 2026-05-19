import app from "./app.js";
import config from "./lib/config.js";
import connectDB from "./lib/dbconnect.js";

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(config.port, config.host, () => {
      console.log(`Server running at http://${config.host}:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
