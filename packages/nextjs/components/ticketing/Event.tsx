import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const Event = ({ eventId }) => {
  const { data: eventInfo } = useScaffoldContractRead({
    contractName: "TicketKiosk",
    functionName: "eventInfo",
    args: [eventId],
  });

  console.log('eventInfo', eventInfo);

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-6xl text-black">{eventInfo?.name}</span>
          <span className="text-xl sm:text-xl text-black mt-6">Select Show:</span>

          <div className="grid grid-cols-3 gap-4 py-8">
            {eventInfo?.shows.map((show, index) => (
              <a
                href={`/events/${eventId}/shows/${show.name}`}
                className="text-2xl text-black"
              >
                <div key={index} className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                  {show.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
