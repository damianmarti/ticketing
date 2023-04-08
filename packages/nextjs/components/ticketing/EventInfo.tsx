import { useState } from "react";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { BigNumber } from "ethers";
import { useRouter } from 'next/router'
import { utils } from "ethers";

export const EventInfo = ({ eventId }) => {
  const [eventName, setEventName] = useState("");

  const router = useRouter()

  const { data: eventInfo } = useScaffoldContractRead({
    contractName: "TicketKiosk",
    functionName: "eventInfo",
    args: [eventId],
  });

  console.log('eventInfo', eventInfo);

  const newCreatedEvent = async (data) => {
    console.log('Success', data)
    const result = await data.wait();
    console.log('Result', result);
    const eventId = BigNumber.from(result.logs[0].topics[1]);
    console.log('EventId', eventId);
    router.push("/events/" + eventId.toString() + "/shows/create");
  }

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "TicketKiosk",
    functionName: "addEvent",
    args: [eventName],
    value: "0.1",
    onSuccess(data) {
      newCreatedEvent(data);
    }
  });

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw]">
      {eventInfo && (
        <div
          className="flex flex-col max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full"
        >
          <Address address={eventInfo.owner} />
          <h2 className="font-black text-2xl">{eventInfo.name}</h2>
          <p className="my-1"><strong>Total Seats:</strong> {eventInfo.totalSeats.toString()} ({eventInfo.totalBookedSeats.toString()} booked)</p>
          <p className="my-1"><strong>Amount Raised:</strong> {utils.formatEther(eventInfo.amountRaised.toString())} ETH</p>
          <h3 className="mt-2 font-bold text-xl">
            Shows
            <a className="font-normal text-l mx-1" href={`/events/${eventId}/shows/create`}>+</a>
          </h3>
          <ul className="list-disc list-inside">
            {eventInfo.shows.map((show, index) => (
              <li className="mb-3" key={index}>
                {show.name}
                <h4 className="my-1 mx-5 font-bold text-l">
                  Sections
                  <a className="font-normal text-l mx-1" href={`/events/${eventId}/shows/${show.name}/sections/create`}>+</a>
                </h4>
                <ul className="list-disc list-inside mx-5">
                  {show.sections.map((section, index) => (
                    <li className="mb-3" key={index}>
                      {section.name}
                      <div className="mx-10">
                        <p className="my-1"><strong>Total Seats:</strong> {section.totalSeats.toString()} ({section.bookedSeats.length} booked})</p>
                        <p className="my-1"><strong>Price:</strong> {utils.formatEther(section.price.toString())} ETH</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
