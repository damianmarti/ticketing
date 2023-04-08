import Head from "next/head";
import type { NextPage } from "next";
import { Events } from "~~/components/ticketing/Events";
import { EventCreate } from "~~/components/ticketing/EventCreate";

const EventsCreatePage: NextPage = () => {
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
                <EventCreate />
                <Events />
            </div>
        </>
    );
};

export default EventsCreatePage;
