import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from 'next/router'
import { EventEdit } from "~~/components/ticketing/EventEdit";
import { EventInfo } from "~~/components/ticketing/EventInfo";

const EventsEditPage: NextPage = () => {
  const router = useRouter()
  const { eventId } = router.query

  console.log("eventId: ", eventId);

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
        <EventEdit eventId={eventId} />
        <EventInfo eventId={eventId} />
      </div>
    </>
  );
};

export default EventsEditPage;
