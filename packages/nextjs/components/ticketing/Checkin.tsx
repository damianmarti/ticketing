import { useState, useEffect } from "react";
import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useTypedSigner } from "~~/hooks";
import { useSigner, useAccount } from "wagmi";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { QRCodeSVG } from "qrcode.react";

export const Checkin = ({ ticketId }) => {
    const [sig, setSig] = useState("");
    const [ticketData, setTicketData] = useState({});

    const { data: tokenURI } = useScaffoldContractRead({
        contractName: "TicketKiosk",
        functionName: "tokenURI",
        args: [ticketId],
    });

    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { data: deployedContractData, isLoading } = useDeployedContractInfo("TicketKiosk");

    useEffect(() => {
        const updateTicketData = async () => {

            console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI?.substring(29));

            try {
                const jsonManifest = JSON.parse(jsonManifestString);
                const newTokenData = { id: ticketId, uri: tokenURI, owner: address, ...jsonManifest };
                setTicketData(newTokenData);
            } catch (e) {
                console.log(e);
            }
        };
        if (address && tokenURI) {
            updateTicketData();
        }
    }, [address, tokenURI, ticketId]);

    const typedSigner = useTypedSigner(signer, {
        name: "Some Event Ticket",
        version: "0.0.1",
        chainId: getTargetNetwork().id,
        verifyingContract: deployedContractData?.address,
    });

    const generateAdmissionSignature = async () => {
        const value = { owner: address, tokenId: ticketId };

        console.log("value: ", value);

        const signature = await typedSigner(
            {
                Checkin: [
                    { name: "owner", type: "address" },
                    { name: "tokenId", type: "uint256" },
                ],
            },
            value,
        );

        console.log(value);
        console.log(signature);

        setSig(signature);
    };

    return (
        <div className="flex bg-base-300 relative pb-10">
            <DiamondIcon className="absolute top-24" />
            <CopyIcon className="absolute bottom-0 left-36" />
            <HareIcon className="absolute right-0 bottom-24" />
            <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
                <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
                    <span className="text-4xl sm:text-6xl text-black">Admission</span>

                    <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
                        <img src={ticketData.image} alt={"Ticket #" + ticketId} />
                        <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
                            <div className="flex rounded-full border-2 border-primary p-1">
                                <button
                                    className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${isLoading ? "loading" : ""
                                        }`}
                                    onClick={generateAdmissionSignature}
                                >
                                    {!isLoading && (
                                        <>
                                            Show QR <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2 items-start">
                        {sig && (
                            <>
                                <QRCodeSVG value={sig} size={200} />
                                <a className="cursor-pointer" onClick={() => { navigator.clipboard.writeText(sig) }}>📋</a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
