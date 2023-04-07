import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { utils } from "ethers";

export const Show = ({ eventId, showName }) => {
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
          <span className="text-4xl sm:text-6xl text-black">{eventInfo?.name} - {showName}</span>
          <span className="text-xl sm:text-xl text-black mt-6">Select Section:</span>

          <div className="grid grid-cols-3 gap-4 py-8">
            {eventInfo?.shows.find((show) => show.name === showName).sections.map((section, index) => (
              <a
                href={`/events/${eventId}/shows/${showName}/sections/${section.name}/buy`}
                className="text-2xl text-black"
              >
                <div key={index} className="flex flex-col bg-base-100 px-3 py-10 text-center items-center max-w-xs rounded-3xl">
                  <div className="font-black">{section.name}</div>

                  <div className="flex flex-col justify-between mt-4">
                    <div className="text-base text-black"><strong>Price:</strong> {utils.formatEther(section.price)} ETH</div>
                    <div className="text-base text-black"><strong>Available Seats:</strong> {section.totalSeats - section.bookedSeats.length}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
