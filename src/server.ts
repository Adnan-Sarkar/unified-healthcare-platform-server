import app from "./app";
import { config } from "./app/config";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING TO THE PORT: ${PORT}`);
});
