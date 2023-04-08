import { useState } from "react";
import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { QRCodeSVG } from "qrcode.react";

export const Admission = () => {
  const [ticketId, setTicketId] = useState("");
  const [sig, setSig] = useState("");

  const { writeAsync: admitHolder, isLoading } = useScaffoldContractWrite({
    contractName: "TicketKiosk",
    functionName: "admitHolder",
    args: [ticketId, sig]
  });

  return (
    <>
      <div className="flex bg-base-300 relative pb-10">
        <DiamondIcon className="absolute top-24" />
        <CopyIcon className="absolute bottom-0 left-36" />
        <HareIcon className="absolute right-0 bottom-24" />
        <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
          <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
            <span className="text-4xl sm:text-6xl text-black">Admission</span>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
              <input
                type="text"
                placeholder="Ticket ID"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setTicketId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Signature"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setSig(e.target.value)}
              />
              <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                <div className="flex rounded-full border-2 border-primary p-1">
                  <button
                    className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${isLoading ? "loading" : ""
                      }`}
                    onClick={admitHolder}
                  >
                    {!isLoading && (
                      <>
                        Register <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw]">
        <div className="mt-4 flex gap-2 items-start">
          {sig && (
            <>
              <QRCodeSVG value={sig} size={400} />
              <a className="cursor-pointer" onClick={() => { navigator.clipboard.writeText(sig) }}>📋</a>
            </>
          )}
        </div>
      </div>
    </>
  );
};
