'use client'

import { StatusComponent } from '@/components/status'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/app/lib/time'

export default function BookingPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [bookings, setBookings] = useState<Booking[]>([])

    const router = useRouter()

    const getBookings = async () => {
        try {
            const response = await fetch('/api/booking')
            if (response.ok) {
                const data = await response.json()
                setBookings(data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getBookings()
        setIsLoading(false)
    }, [])

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Booking List
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        List of Booking
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <a href="/admin/dashboard/booking/addBooking">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Add Booking
                        </button>
                    </a>
                </div>
            </div>
            {isLoading ? (
                <p className="text-center my-4">Loading...</p>
            ) : (
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                                        >
                                            Booking Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Applicant
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Vehicle
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Purpose
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bookings.map((book: Booking) => (
                                        <tr key={book.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                                {book.bookingName}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {book.user?.name}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {formatDate(
                                                    book.startDate.toLocaleString()
                                                )}
                                                -
                                                {formatDate(
                                                    book.endDate.toLocaleString()
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {book.vehicle?.model}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                <StatusComponent
                                                    status={book.status}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {book.purpose}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                <a
                                                    href={`/admin/dashboard/booking/detail/${book.id}`}
                                                >
                                                    Detail
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
