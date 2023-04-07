import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from 'next/router'
import { EventInfo } from "~~/components/ticketing/EventInfo";
import { SectionCreate } from "~~/components/ticketing/SectionCreate";

const SectionsCreatePage: NextPage = () => {
  const router = useRouter()
  const { eventId, showName } = router.query

  console.log("eventId: ", eventId);
  console.log("showName: ", showName);

  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        <SectionCreate eventId={eventId} showName={showName} />
        <EventInfo eventId={eventId} />
      </div>
    </>
  );
};

export default SectionsCreatePage;
