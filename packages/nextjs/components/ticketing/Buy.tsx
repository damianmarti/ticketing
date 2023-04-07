import { useState, useEffect } from "react";
import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { utils, BigNumber } from "ethers";
import { useRouter } from 'next/router'

export const Buy = ({ eventId, showName, sectionName }) => {
  const router = useRouter()

  const [price, setPrice] = useState(0);
  const [seatId, setSeatId] = useState("");

  const { data: eventInfo } = useScaffoldContractRead({
    contractName: "TicketKiosk",
    functionName: "eventInfo",
    args: [eventId],
  });

  console.log('eventInfo', eventInfo);

  useEffect(() => {
    if (eventInfo) {
      const section = eventInfo.shows.find((show) => show.name === showName).sections.find((section) => section.name === sectionName);
      setPrice(utils.formatEther(section.price));
      setSeatId(BigNumber.from(section.bookedSeats.length + 1));
    }
  }, [eventInfo]);

  const ticketBought = async (data) => {
    console.log('Success', data)
    const result = await data.wait();
    console.log('Result', result);
    router.push("/my-tickets");
  }

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "TicketKiosk",
    functionName: "buyTicket",
    args: [eventId, showName, sectionName, seatId],
    value: price,
    onSuccess(data) {
      ticketBought(data);
    }
  });

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-6xl text-black">{eventInfo?.name} - {showName} - {sectionName}</span>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1">
                <button
                  className={`btn btn-primary rounded-full capitalize font-normal font-white w-100 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${isLoading ? "loading" : ""
                    }`}
                  onClick={writeAsync}
                >
                  {!isLoading && (
                    <>
                      Buy Ticket <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 items-start">
            <span className="text-sm leading-tight">Price:</span>
            <div className="badge badge-warning">{price} ETH + Gas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
