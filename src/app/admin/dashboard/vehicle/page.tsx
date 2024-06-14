'use client'
import { formatDate } from '@/app/lib/time'
import { isVehicleInUse } from '@/app/lib/vehicle'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function VehiclePage() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [inUse, setInUse] = useState<Record<number, boolean | null>>({})

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/vehicle')
            if (response.ok) {
                const data = await response.json()
                setVehicles(data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const checkVehicleInUse = async (vehicleId: number) => {
        try {
            const result = await isVehicleInUse(vehicleId)
            setInUse((prevState) => ({
                ...prevState,
                [vehicleId]: result,
            }))
        } catch (error) {
            console.error('Error checking vehicle usage:', error)
            setInUse((prevState) => ({
                ...prevState,
                [vehicleId]: false, // handle error state appropriately
            }))
        }
    }

    useEffect(() => {
        setIsLoading(true)
        fetchVehicles().then(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        vehicles.forEach((vehicle) => {
            checkVehicleInUse(vehicle.id)
        })
    }, [vehicles])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!vehicles.length) {
        return <div>No vehicles available.</div>
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Vehicle
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        List of vehicle, include company vehichle and rental
                        vehicle
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
            </div>
            {isLoading ? (
                <p className="text-center my-4">Loading...</p>
            ) : (
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                                            >
                                                Vehicle Model
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                License Plate
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Ownership
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Last Service
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Fuel Consumption
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {vehicles!.map((vehicle) => (
                                            <tr key={vehicle.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                    {vehicle.model}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {vehicle.licensePlate}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {vehicle.ownedBy}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <>
                                                        {inUse[vehicle.id] ===
                                                        null ? (
                                                            <dd className="mt-1 text-sm text-gray-600">
                                                                Checking...
                                                            </dd>
                                                        ) : inUse[
                                                              vehicle.id
                                                          ] ? (
                                                            <dd className="mt-1 text-sm text-yellow-600">
                                                                In Use
                                                            </dd>
                                                        ) : (
                                                            <dd className="mt-1 text-sm text-green-600">
                                                                Available
                                                            </dd>
                                                        )}
                                                    </>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatDate(
                                                        vehicle.lastServiceDate
                                                            ? vehicle.lastServiceDate.toLocaleString()
                                                            : ''
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {vehicle.fuelConsumption}
                                                    Km/liter
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <a
                                                        // href={`/admin/dashboard/vehicle/detail/${vehicle.id}`}
                                                        text-decoration="color-indigo-600"
                                                    >
                                                        More details..
                                                    </a>
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
