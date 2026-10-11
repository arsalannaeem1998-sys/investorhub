import { config } from "./config";
import app from "./app";

app.listen(config.port, () => {
  console.log(`🚀 InvestorHub Australia API running on port ${config.port}`);
  console.log(`🔗 Health: http://localhost:${config.port}/api/v1/health`);
});
