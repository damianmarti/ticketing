import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from 'next/router'
import { ContractData } from "~~/components/example-ui/ContractData";
import { Checkin } from "~~/components/ticketing/Checkin";

const CheckinPage: NextPage = () => {
    const router = useRouter()
    const { ticketId } = router.query

    console.log("ticketId: ", ticketId);

    return (
        <>
            <Head>
                <title>Scaffold-eth Example Ui</title>
                <meta name="description" content="Created with 🏗 scaffold-eth" />
                {/* We are importing the font this way to lighten the size of SE2. */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
            </Head>
            <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
                <Checkin ticketId={ticketId} />
                <ContractData />
            </div>
        </>
    );
};

export default CheckinPage;
