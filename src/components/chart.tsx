'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface LineDataProps {
    categories: string[]
    seriesData: number[]
}

export function LineData({ categories, seriesData }: LineDataProps) {
    const options = {
        chart: {
            toolbar: {
                show: false,
            },
            id: 'example-data',
        },
        xaxis: {
            categories: categories,
        },
    }

    const series = [
        {
            name: 'Bookings',
            data: seriesData,
        },
    ]

    return (
        <>
            <ApexChart
                type="line"
                options={options}
                series={series}
                height={200}
                width={600}
            />
        </>
    )
}

export function BarChart({ categories, seriesData }: LineDataProps) {
    const options = {
        chart: {
            id: 'basic-bar',
        },
        xaxis: {
            categories: categories,
        },
    }

    const series = [
        {
            name: 'CarUsage',
            data: seriesData,
        },
    ]

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        width="500"
                    />
                </div>
            </div>
        </div>
    )
}
