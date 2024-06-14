import React from 'react'

interface StatusProps {
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
}

export const StatusComponent: React.FC<StatusProps> = ({ status }) => {
    let statusText
    let statusColor

    switch (status) {
        case 'APPROVED':
            statusText = 'Approved'
            statusColor = 'text-green-600'
            break
        case 'PENDING':
            statusText = 'Pending'
            statusColor = 'text-yellow-600'
            break
        case 'REJECTED':
            statusText = 'Rejected'
            statusColor = 'text-red-600'
            break
        default:
            statusText = 'Unknown'
            statusColor = 'text-gray-500'
            break
    }

    return (
        <div className="sm:col-span-2">
            <dd className={`mt-1 text-sm ${statusColor}`}>{statusText}</dd>
        </div>
    )
}
