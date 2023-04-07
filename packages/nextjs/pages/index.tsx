import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "TicketKiosk",
    eventName: "EventAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
  });

  console.log("events", isLoadingEvents, errorReadingEvents, events);

  return (
    <>
      <Head>
        <title>TicketKiosk</title>
        <meta name="description" content="Event tickets on-chain" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold mb-2">TicketKiosk</span>
            <span className="block text-2xl">Event tickets on-chain</span>
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex items-center flex-col flex-grow pt-10">
            <a
              className="btn btn-primary rounded-full capitalize font-normal font-white flex items-center"
              href="/events/create"
            >Create New Event</a>
            <div className="grid grid-cols-4 gap-4 py-8">
              {events?.map((event) => (
                <div key={event.args.eventId.toString()} className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                  <a href={`/events/${event.args.eventId.toString()}`}>{event.args.name}</a>
                  <a
                    className="btn btn-primary rounded-full capitalize font-normal font-white flex items-center mt-10"
                    href={`/events/${event.args.eventId.toString()}/edit`}
                  >✎</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
