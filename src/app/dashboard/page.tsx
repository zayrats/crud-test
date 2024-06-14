'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
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
    const [loading, setLoading] = useState(true)
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

                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
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
