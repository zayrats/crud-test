import React from 'react'

interface StatusProps {
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
    onApprove: () => void
    onReject: () => void
}

export const StatusComponentButton: React.FC<StatusProps> = ({
    status,
    onApprove,
    onReject,
}) => {
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
            <div className="mt-2">
                {status === 'PENDING' && (
                    <>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={onApprove}
                        >
                            Approve
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            onClick={onReject}
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
