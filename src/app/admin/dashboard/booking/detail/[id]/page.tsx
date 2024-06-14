'use client'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { StatusComponent } from '@/components/status'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatDate } from '@/app/lib/time'

export default function BookingDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)
    const params = useParams<{ id: string }>()
    const [booking, setBooking] = useState<Booking | null>()

    const getBooking = async (id: number) => {
        try {
            const response = await fetch(`/api/booking/${id}`)
            if (response.ok) {
                const { success, data } = await response.json()
                if (success) {
                    setBooking(data)
                }
            }
        } catch (error) {
            console.error('Get booking error:', error)
        }
    }

    useEffect(() => {
        getBooking(Number(params.id))
        setIsLoading(false)
    }, [])

    return (
        <div className='className="px-4 sm:px-6 lg:px-8'>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Booking Detail
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Booking Detail Information
                    </p>
                </div>
                {isLoading ? (
                    <p className="text-center my-4">Loading...</p>
                ) : (
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Booking Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {booking?.bookingName}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Applicant Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {booking?.user?.name}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Driver
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {booking?.driver?.name}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Start Date
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formatDate(
                                        booking?.startDate.toLocaleString() ??
                                            ''
                                    )}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Vehicle
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <a
                                        href={`/admin/dashboard/vehicle/detail/${booking?.vehicleId}`}
                                    >
                                        {booking?.vehicle?.model}
                                    </a>
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    End Date
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formatDate(
                                        booking?.endDate.toLocaleString() ?? ''
                                    )}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">
                                    Booking Deskription
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {booking?.description}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">
                                    Status
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <StatusComponent
                                        status={booking?.status!}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}
            </div>
        </div>
    )
}
