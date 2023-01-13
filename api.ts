import { GoogleSpreadsheet } from "google-spreadsheet";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const SPREADSHEET_ID = process.env.PUBLIC_SPREADSHEET_ID ?? "";
const SHEET_ID = process.env.PUBLIC_SHEET_ID ?? "";
const CLIENT_EMAIL = process.env.PUBLIC_GOOGLE_CLIENT_EMAIL ?? "";
let PRIVATE_KEY = process.env.PUBLIC_GOOGLE_SERVICE_PRIVATE_KEY ?? "";
PRIVATE_KEY = PRIVATE_KEY.replace(/\n/g, "\n");

export const api = {
  sendMessage: async (req: Request, res: Response) => {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    const { name, email, bio } = req.body;
    const newRow = { Name: name, Email: email, Bio: bio };

    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();

      const sheet = doc.sheetsById[SHEET_ID];
      const _result = await sheet.addRow(newRow);
      res.status(200).json({ data: "Success" });
    } catch (e) {
      console.error("Error: ", e);
      res.status(500).json({ data: "Error" });
    }
  },
};
