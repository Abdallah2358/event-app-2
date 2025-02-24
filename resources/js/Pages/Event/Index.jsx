import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


export default function Index({ events }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Events
                </h2>
            }
        >
            <Head title="Events" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {events.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {events.map((event) => (
                                    <li key={event.id} className="py-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {event.id}
                                        </h3>
                                        <p className="text-gray-600">{event.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {event.date ? new Date(event.date).toLocaleDateString() : 'No Date'}
                                        </p>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No events available.</p>
                        )}
                    </div>


                </div>
            </div>
        </AuthenticatedLayout>
    );
}
