'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import * as XLSX from 'xlsx'
// import { BarChart, LineData } from '@/components/chart'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
// const BarChart = dynamic(() => import('react-apexcharts'), { ssr: false })
// const LineData = dynamic(() => import('react-apexcharts'), { ssr: false })
const BarChart = dynamic(
    () => import('@/components/chart').then((mod) => mod.BarChart),
    { ssr: false }
)
const LineData = dynamic(
    () => import('@/components/chart').then((mod) => mod.LineData),
    { ssr: false }
)

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    )
    const [chartData, setChartData] = useState<{
        categories: string[]
        seriesData: number[]
    }>({
        categories: [],
        seriesData: [],
    })

    const [vehicleUsage, setVehicleUsage] = useState<{
        categories: string[]
        seriesData: number[]
    }>({
        categories: [],
        seriesData: [],
    })

    const fetchVehiclesUsage = async () => {
        try {
            const response = await fetch('/api/booking/vehicleUsage')
            if (response.ok) {
                const result = await response.json()

                if (result.success) {
                    // Extract categories and series data from API response
                    const categories = result.data.map(
                        (item: any) => item.model
                    )
                    const seriesData = result.data.map(
                        (item: any) => item.bookingCount
                    )

                    setVehicleUsage({
                        categories,
                        seriesData,
                    })
                }
            }
        } catch (error) {}
    }

    const fetchMonthlyData = async () => {
        try {
            const response = await fetch('/api/booking/monthlyBook')
            if (response.ok) {
                const result = await response.json()

                if (result.success) {
                    // Extract categories and series data from API response
                    const categories = result.data.map((item: any) => item.date)
                    const seriesData = result.data.map(
                        (item: any) => item.count
                    )

                    setChartData({
                        categories,
                        seriesData,
                    })
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
    }

    async function fetchAndGenerateExcel(year: number) {
        try {
            const response = await axios.get(`/api/logbook/${year}`)
            const { success, data } = response.data

            if (!success) {
                console.error('Failed to fetch data')
                return
            }

            // ubdah format tanggal
            const formatDate = (dateString: string) => {
                const date = new Date(dateString)
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
            }

            // buat dataframe
            const formattedData = data.map((item: Booking) => ({
                'Tanggal Pemesanan': formatDate(
                    new Date(item.createdAt).toISOString()
                ),
                'Booking ID': item.id,
                'Nama Booking': item.bookingName,
                'Deskripsi Booking': item.description,
                'Nama Pemohon': item.user?.name,
                'Nama Kendaraan': item.vehicle?.model,
                'Nomor Kendaraan': item.vehicle?.licensePlate,
                'Tanggal Mulai': formatDate(
                    new Date(item.startDate).toISOString()
                ),
                'Tanggal Selesai': formatDate(
                    new Date(item.endDate).toISOString()
                ),
                'Status Booking': item.status,
                Purpose: item.purpose,
            }))

            // simpan excel
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(formattedData)
            XLSX.utils.book_append_sheet(wb, ws, 'Bookings')
            XLSX.writeFile(wb, `bookings_${year}.xlsx`)
        } catch (error) {
            console.error('Error generating Excel file:', error)
        }
    }

    useEffect(() => {
        fetchMonthlyData()
        fetchVehiclesUsage()
        setLoading(false)
    }, [])

    if (loading) {
        return <p className="text-center my-4">Loading...</p>
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        List and Summary of Booking Data
                    </p>
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <select
                        name=""
                        id=""
                        value={selectedYear}
                        onChange={(e) =>
                            setSelectedYear(parseInt(e.target.value))
                        }
                    >
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        onClick={() => fetchAndGenerateExcel(selectedYear)}
                    >
                        Export CSV
                    </button>
                </div>
            </div>
            <div className="mt-8 flex">
                <div className="container mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Schedule</CardTitle>
                            <CardDescription>
                                The summary of booking reservation requests for
                                each month is presented below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LineData
                                categories={chartData.categories}
                                seriesData={chartData.seriesData}
                            />
                        </CardContent>
                    </Card>
                    <br />
                    <Card>
                        <CardHeader>
                            <CardTitle>Car Usage</CardTitle>
                            <CardDescription>
                                The summary of car usage by amounts of booking
                                request
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                categories={vehicleUsage.categories}
                                seriesData={vehicleUsage.seriesData}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
