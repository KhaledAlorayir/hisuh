type Props = {};
import Head from "next/head";

const HeadTag = (props: Props) => {
  const title = "Hisuh";
  const desc = "Create and Share Lists of your Favourite Places!";

  return (
    <Head>
      <title>Hisuh</title>
      <meta
        name="twitter:card"
        content="Hisuh: Create and Share Lists of your Favourite Places"
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
    </Head>
  );
};

export default HeadTag;
