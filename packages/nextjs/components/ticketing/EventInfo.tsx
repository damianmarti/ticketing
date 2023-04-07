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
          className={`flex flex-col max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full`}
        >
          <Address address={eventInfo.owner} />
          <h1>{eventInfo.name}</h1>
          <h2>Total Seats: {eventInfo.totalSeats.toString()} ({eventInfo.totalBookedSeats.toString()} booked})</h2>
          <h2>Amount Raised: {eventInfo.amountRaised.toString()}</h2>
          <h2>
            Shows
            <a href={`/events/${eventId}/shows/create`}>Add</a>
          </h2>
          {eventInfo.shows.map((show, index) => (
            <div key={index}>
              <h3>{show.name}</h3>
              <h3>
                Sections
                <a href={`/events/${eventId}/shows/${show.id}/sections/create`}>Add</a>
              </h3>
              {show.sections.map((section, index) => (
                <div key={index}>
                  <h4>{section.name}</h4>
                  <h4>Total Seats: {section.totalSeats.toString()} ({section.bookedSeats.length} booked})</h4>
                  <h4>Price: {utils.formatEther(section.price.toString())} ETH</h4>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
