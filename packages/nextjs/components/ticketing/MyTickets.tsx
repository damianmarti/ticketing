import { useState, useEffect } from "react";
import { CopyIcon } from "../example-ui/assets/CopyIcon";
import { DiamondIcon } from "../example-ui/assets/DiamondIcon";
import { HareIcon } from "../example-ui/assets/HareIcon";
import { useScaffoldContractRead, useScaffoldContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

export const MyTickets = () => {
  const [yourNfts, setYourNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();

  const { data: balance } = useScaffoldContractRead({
    contractName: "TicketKiosk",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: ticketContract } = useScaffoldContract({ contractName: "TicketKiosk" });

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "TicketKiosk",
    eventName: "EventAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  console.log("events", isLoadingEvents, errorReadingEvents, events);

  useEffect(() => {
    const updateYourTickets = async () => {
      setIsLoading(true);
      const nftUpdate = [];
      if (balance && balance.toNumber && balance.toNumber() > 0) {
        for (let tokenIndex = 0; tokenIndex < balance.toNumber(); tokenIndex++) {
          try {
            const tokenId = await ticketContract.tokenOfOwnerByIndex(address, tokenIndex);
            console.log("Getting NFT tokenId: ", tokenId.toNumber());
            const tokenURI = await ticketContract.tokenURI(tokenId);
            console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              nftUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
      setYourNfts(nftUpdate.reverse());
      setIsLoading(false);
    };
    updateYourTickets();
  }, [address, balance, ticketContract]);

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-6xl text-black">My Tickets ({balance?.toString()})</span>
          {isLoading && <div>Loading...</div>}
          <div className="columns-3 py-8">
            {yourNfts.map((nft) => (
              <a key={nft.id} href={"/tickets/" + nft.id + "/checkin"}>
                <img src={nft.image} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};
