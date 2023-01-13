const dotenv = require("dotenv")
const cors = require("cors")
const express = require("express")
const bodyParser = require("body-parser")
const { GoogleSpreadsheet } = require("google-spreadsheet");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SPREADSHEET_ID = process.env.PUBLIC_SPREADSHEET_ID ?? "";
const SHEET_ID = process.env.PUBLIC_SHEET_ID ?? "";
const CLIENT_EMAIL = process.env.PUBLIC_GOOGLE_CLIENT_EMAIL ?? "";
let PRIVATE_KEY = process.env.PUBLIC_GOOGLE_SERVICE_PRIVATE_KEY ?? "";
PRIVATE_KEY = PRIVATE_KEY.replace(/\n/g, "\n");

app.post("/api/submit", async (req, res) => {

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    const { name, email, services, message } = req.body;
    const newRow = { Name: name, Email: email, Services: services, Message: message };

    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.split(String.raw`\n`).join('\n'),
      });
      await doc.loadInfo();
      const sheet = doc.sheetsById[SHEET_ID];
      await sheet.addRow(newRow);
      res.status(200).json({ data: "Success" });
    } catch (e) {
      console.error("Error: ", e);
      res.status(500).json({ data: "Error" });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
