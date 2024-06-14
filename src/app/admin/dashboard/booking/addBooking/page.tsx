'use client'
import { tanggalBesok } from '@/app/lib/time'
import { useState, useEffect, FormEvent } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function AddBooking() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    // untuk dropdown
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [employees, setEmployees] = useState<any[]>([])
    const [supervisors, setSupervisors] = useState<any[]>([])
    const [vehicles, setVehicles] = useState<any[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [selectedSupervisor, setSelectedSupervisor] = useState('')
    const [selectedvehicleId, setSelectedVehicleId] = useState('')

    // normal input
    const [bookingName, setBookingName] = useState('')
    const [description, setDescription] = useState('')
    const [driverId, setDriverId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [purpose, setPurpose] = useState('')

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to add this booking?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('/api/booking', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            bookingName,
                            description,
                            userId: selectedEmployee,
                            vehicleId: selectedvehicleId,
                            driverId: driverId,
                            approverId: parseInt(selectedSupervisor),
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                            purpose: purpose,
                        }),
                    })

                    if (response.ok) {
                        Swal.fire(
                            'Success!',
                            'Booking has been added.',
                            'success'
                        )
                        router.push('/admin/dashboard/booking')
                    } else {
                        Swal.fire('Failed!', 'Failed to add booking.', 'error')
                        console.error('Gagal menambahkan booking')
                    }
                } catch (error) {
                    Swal.fire('Error!', 'An error occurred.', 'error')
                    console.error('Error:', error)
                }
            }
        })
    }

    // get all vehicles
    const getAllVehicles = async () => {
        try {
            const response = await fetch('/api/vehicle')
            if (response.ok) {
                const data = await response.json()
                setVehicles(data.data)
            } else {
                console.error('Gagal mengambil data pengguna')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    // ambil semua data user
    const getAllUsers = async () => {
        try {
            const response = await fetch('/api/user')
            if (response.ok) {
                const data = await response.json()
                const employeeData = data.users.filter(
                    (user: any) => user.role === 'EMPLOYEE'
                )
                const allUsers = data.users
                setEmployees(employeeData)
                setAllUsers(allUsers)
            } else {
                console.error('Gagal mengambil data pengguna')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    // handle dropdown untuk employee dan supervisor yang sama
    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEmployeeId = e.target.value
        setSelectedEmployee(selectedEmployeeId)
        const selectedEmployee = employees.find(
            (user) => user.id === parseInt(selectedEmployeeId)
        )
        // filter supervisor yang ada di de  partemen yang sama
        if (selectedEmployee) {
            const supervisorsInSameDepartment = allUsers.filter(
                (user) =>
                    user.department == selectedEmployee.department &&
                    user.role == 'SUPERVISOR'
            )

            setSupervisors(supervisorsInSameDepartment)

            setSelectedSupervisor('')
        }
    }

    const handleSupervisorChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedSupervisor(e.target.value)
    }

    useEffect(() => {
        getAllUsers()
        getAllVehicles()
        setIsLoading(false)
    }, [])

    return (
        <div className='className="px-4 sm:px-6 lg:px-8'>
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Add New Booking
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Create vehicle resevation here
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <p className="text-center my-4">Loading...</p>
                    ) : (
                        <div className="mt-5 md:col-span-2 md:mt-0">
                            <form
                                action="#"
                                method="POST"
                                onSubmit={handleSubmit}
                            >
                                <div className="overflow-hidden shadow sm:rounded-md">
                                    <div className="bg-white px-4 py-5 sm:p-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="booking-name"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Booking Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="booking-name"
                                                    id="booking-name"
                                                    required
                                                    value={bookingName}
                                                    onChange={(e) =>
                                                        setBookingName(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoComplete="given-name"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="purpose"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Purpose
                                                </label>
                                                <select
                                                    id="employee"
                                                    required
                                                    value={purpose}
                                                    onChange={(e) =>
                                                        setPurpose(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Customer Visit">
                                                        Customer Visit
                                                    </option>
                                                    <option value="Business Meeting">
                                                        Business Meeting
                                                    </option>
                                                    <option value="Goods Delivery">
                                                        Goods Delivery
                                                    </option>
                                                    <option value="Supplier Visit">
                                                        Supplier Visit
                                                    </option>
                                                    <option value="Document Management">
                                                        Document Management
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="col-span-6 sm:col-span-4">
                                                <label
                                                    htmlFor="description"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    id="description"
                                                    required
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoComplete="email"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="employee"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Applicant
                                                </label>
                                                <select
                                                    id="employee"
                                                    value={selectedEmployee}
                                                    onChange={
                                                        handleEmployeeChange
                                                    }
                                                >
                                                    <option value="">
                                                        Select Employee
                                                    </option>
                                                    {employees.map(
                                                        (employee) => (
                                                            <option
                                                                key={
                                                                    employee.id
                                                                }
                                                                value={
                                                                    employee.id
                                                                }
                                                            >
                                                                {employee.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="approver"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Approver
                                                </label>
                                                <select
                                                    id="approver"
                                                    value={selectedSupervisor}
                                                    onChange={
                                                        handleSupervisorChange
                                                    }
                                                    disabled={!selectedEmployee} // Disable supervisor select until an employee is selected
                                                >
                                                    <option value="">
                                                        Select Supervisor
                                                    </option>
                                                    {supervisors.map(
                                                        (supervisor) => (
                                                            <option
                                                                key={
                                                                    supervisor.id
                                                                }
                                                                value={
                                                                    supervisor.id
                                                                }
                                                            >
                                                                {
                                                                    supervisor.name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="driver"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Driver
                                                </label>
                                                <select
                                                    id="driver"
                                                    value={driverId}
                                                    onChange={(e) =>
                                                        setDriverId(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Driver
                                                    </option>
                                                    {employees.map((user) => (
                                                        <option
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            {user.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="driver"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Vehicle
                                                </label>
                                                <select
                                                    id="driver"
                                                    value={selectedvehicleId}
                                                    onChange={(e) =>
                                                        setSelectedVehicleId(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Vehicle
                                                    </option>
                                                    {vehicles!.map(
                                                        (vehicle) => (
                                                            <option
                                                                key={vehicle.id}
                                                                value={
                                                                    vehicle.id
                                                                }
                                                            >
                                                                {vehicle.model}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            <div className="col-span-6">
                                                <label
                                                    htmlFor="startDate"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    min={tanggalBesok()}
                                                    name="startDate"
                                                    id="startDate"
                                                    required
                                                    value={startDate}
                                                    onChange={(e) =>
                                                        setStartDate(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoComplete="startDate"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            <div className="col-span-6 ">
                                                <label
                                                    htmlFor="endDate"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    min={startDate}
                                                    name="endDate"
                                                    id="endDate"
                                                    value={endDate}
                                                    onChange={(e) =>
                                                        setEndDate(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoComplete="address-level2"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Add New Booking
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
