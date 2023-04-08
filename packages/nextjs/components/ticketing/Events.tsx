import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export const Events = () => {
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "TicketKiosk",
    eventName: "EventAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
  });

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw]">
      <div className="grid grid-cols-4 gap-4 py-8">
        {events?.map((event) => (
          <div key={event.args.eventId.toString()} className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <a href={`/events/${event.args.eventId.toString()}`}>{event.args.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
};
