import type { NextApiRequest, NextApiResponse } from 'next'
import { URLRow } from 'types/GoogleSheets';
import { basicAuthCheck } from 'utils/basicAuthCheck';
import { formatDateToExcel } from 'utils/formatDateToExcel';
import { getDoc } from 'utils/getDoc';
import { validateCreateUrl } from 'utils/validators/createUrl';

export interface CreateUrlResponseDTO {
  URL: string
  SLUG: string
  CREATED_AT: number
  ACTIVE: 'TRUE' | 'FALSE' | ''
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await basicAuthCheck(req, res)

  if (req.method !== 'POST') {
    return res.status(404).send('');
  }

  const result = validateCreateUrl(req.body);

  if (!result.valid) {
    return res.status(422).json({ error: result.error })
  }

  const { data } = result

  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[0];

  const rows = await sheet.getRows() as URLRow[];
  const existingSlugs = rows.map(({ SLUG }) => SLUG)

  if (data.SLUG !== undefined && existingSlugs.indexOf(data.SLUG) >= 0) {
    return res.status(422).json({ error: 'Redirect with specified SLUG already exists' })
  }

  const now = new Date()
  const newRowData = {
    URL: data.URL,
    CREATED_AT: formatDateToExcel(now),
    ...((data.SLUG !== undefined && data.SLUG !== '') ? { SLUG: data.SLUG } : {})
  }

  const newRow = await sheet.addRow(newRowData) as URLRow;
  await newRow.save()

  const responseData: CreateUrlResponseDTO = {
    URL: newRow.URL,
    SLUG: newRow.SLUG,
    CREATED_AT: now.getTime(),
    ACTIVE: newRow.ACTIVE
  }

  res.status(200).json(responseData)
}

export default handler;
