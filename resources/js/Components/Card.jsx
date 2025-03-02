import { formatDate } from "@/src/utils/date";

export default function Card({ event }) {

    return (
        <div className="m-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{event.name}</h5>
            </a>
            <h6 className="font-bold">Date</h6>
            <p className="mb-3 font-normal text-gray-700 ">{formatDate(event.start_date)} -&gt; {formatDate(event.end_date)} </p>
            <hr />
            <h6 className="font-bold">Time</h6>
            <p className="mb-3 font-normal text-gray-700 ">{event.start_time} -&gt; {event.end_time} </p>

            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                Read more
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </a>
        </div>

    );
}