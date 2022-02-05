import type { GetServerSideProps, NextPage } from 'next'
import { URLRow } from 'types/GoogleSheets';
import { getDoc } from 'utils/getDoc';

const Slug: NextPage = () => null
export default Slug

type Params = {
  slug: string
}

export const getServerSideProps: GetServerSideProps<{}, Params> = async (context) => {
  const slug = context.params?.slug

  if (!slug) {
    return {
      notFound: true
    }
  }

  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows() as URLRow[];

  const urlRow = rows.find(({ SLUG }) => SLUG === slug);

  if (!urlRow || urlRow.ACTIVE !== 'TRUE') {
    return {
      notFound: true,
    }
  }

  return {
    redirect: {
      destination: urlRow.URL,
      permanent: true
    },
    props: {}
  }
}
