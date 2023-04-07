import { useState } from "react";
import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { EtherInput } from "~~/components/scaffold-eth";
import { useRouter } from 'next/router'
import { utils } from "ethers";

export const SectionCreate = ({ eventId, showName }) => {
  const [sectionName, setSectionName] = useState("");
  const [sectionTotalSeats, setSectionTotalSeats] = useState("");
  const [sectionPrice, setSectionPrice] = useState("");

  const router = useRouter()

  const { data: eventName } = useScaffoldContractRead({
    contractName: "TicketKiosk",
    functionName: "eventName",
    args: [eventId],
  });

  const newCreatedSection = async (data) => {
    console.log('Success', data)
    const result = await data.wait();
    console.log('Result', result);
    router.push("/events/" + eventId.toString() + "/edit");
  }

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "TicketKiosk",
    functionName: "addSection",
    args: [eventId, showName, sectionName, sectionTotalSeats, utils.parseEther(sectionPrice || "0")],
    onSuccess(data) {
      newCreatedSection(data);
    }
  });

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-l sm:text-6xl text-black">Event: {eventName}</span>
          <span className="text-l sm:text-6xl text-black">Show: {showName}</span>
          <span className="text-4xl sm:text-6xl text-black">Create new section</span>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <input
              type="text"
              placeholder="Section name"
              className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
              onChange={e => setSectionName(e.target.value)}
            />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <input
              type="text"
              placeholder="Total seats"
              className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
              onChange={e => setSectionTotalSeats(e.target.value)}
            />
            <EtherInput value={sectionPrice} onChange={value => setSectionPrice(value)} />
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1">
                <button
                  className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${isLoading ? "loading" : ""
                    }`}
                  onClick={writeAsync}
                >
                  {!isLoading && (
                    <>
                      Create <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
