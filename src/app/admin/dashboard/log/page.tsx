'use client'
import { formatDate } from '@/app/lib/time'
import { useEffect, useState } from 'react'

const transactions = [
    {
        id: 'AAPS0L',
        company: 'Chase & Co.',
        share: 'CAC',
        commission: '+$4.37',
        price: '$3,509.00',
        quantity: '12.00',
        netAmount: '$4,397.00',
    },
    // More transactions...
]

export default function Example() {
    const [isLoading, setIsLoading] = useState(true)
    const [actvityLogs, setActivityLogs] = useState<ActivityLog[]>([])

    const fetchActivityLogs = async () => {
        try {
            const response = await fetch('/api/logActivity')
            if (response.ok) {
                const data = await response.json()
                setActivityLogs(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch activity logs', error)
        }
    }

    useEffect(() => {
        fetchActivityLogs()
        setIsLoading(false)
    }, [])

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Logs
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        All activities in the system.
                    </p>
                </div>
            </div>
            {isLoading ? (
                <p className="text-center my-4">Loading...</p>
            ) : (
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                Activity Action
                                            </th>
                                            <th
                                                scope="col"
                                                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                User
                                            </th>
                                            <th
                                                scope="col"
                                                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Time
                                            </th>
                                            <th
                                                scope="col"
                                                className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Description
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {actvityLogs.map((ac: ActivityLog) => (
                                            <tr key={ac.id}>
                                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                                    {ac.action}
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                                                    {ac.user?.name}
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                                                    {formatDate(
                                                        ac.timestamp?.toLocaleString()
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                    {ac.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
