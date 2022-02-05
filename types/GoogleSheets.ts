import { GoogleSpreadsheetRow } from "google-spreadsheet";

export interface URLRow extends GoogleSpreadsheetRow {
  URL: string
  SLUG: string
  ACTIVE: 'TRUE' | 'FALSE' | ''
}
