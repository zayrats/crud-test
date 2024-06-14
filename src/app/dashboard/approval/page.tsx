'use client'
import { formatDate } from '@/app/lib/time'
import { StatusComponentButton } from '@/components/button'
import { useEffect, useState } from 'react'
import swal from 'sweetalert2'

export default function ApprovalPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [approvals, setApprovals] = useState<Approval[]>([])

    const getMyApproval = async () => {
        try {
            const response = await fetch(`/api/approval`)
            if (response.ok) {
                const { success, data } = await response.json()
                if (success) {
                    setApprovals(data)
                }
            }
        } catch (error) {
            console.error('Get Approval error:', error)
        }
    }

    const updateApproval = async (
        id: string,
        status: 'APPROVED' | 'REJECTED',
        comments: string
    ) => {
        try {
            const response = await fetch(`/api/approval/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approvalStatus: status,
                    comments: comments,
                }),
            })
            if (response.ok) {
                const { success } = await response.json()
                if (success) {
                    getMyApproval()
                    swal.fire({
                        title: 'Success',
                        text: 'Approval was successfully updated',
                        icon: 'success',
                    })
                }
            }
        } catch (error) {
            console.error(`${status} error:`, error)
            swal.fire({
                title: 'Error',
                text: 'An error occurred while updating approval',
                icon: 'error',
            })
        }
    }

    const confirmAction = (id: string, action: 'approve' | 'reject') => {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} this approval?`,
            icon: 'warning',
            input: 'textarea',
            inputPlaceholder: 'Add your comments here...',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, do it!',
        }).then((result: any) => {
            if (result.isConfirmed) {
                const comments = result.value || ''
                action === 'approve'
                    ? updateApproval(id, 'APPROVED', comments)
                    : updateApproval(id, 'REJECTED', comments)
            }
        })
    }

    useEffect(() => {
        getMyApproval()
        setIsLoading(false)
    }, [])

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* APPROVAL LIST ================= */}
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    My Approval
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Some approval need to be approved or rejected.
                </p>
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
                                            Approval Booking
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
                                            Created at
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Comment
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
                                    {approvals.map((approval: Approval) => (
                                        <tr key={approval.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                                <a
                                                    href={`/dashboard/booking/detail/${approval.bookingId}`}
                                                >
                                                    more details...
                                                </a>
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {approval.status}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {formatDate(
                                                    approval.createdAt.toLocaleString()
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                {approval.comments}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                                <StatusComponentButton
                                                    status={approval.status}
                                                    onApprove={() =>
                                                        confirmAction(
                                                            approval.id.toString(),
                                                            'approve'
                                                        )
                                                    }
                                                    onReject={() =>
                                                        confirmAction(
                                                            approval.id.toString(),
                                                            'reject'
                                                        )
                                                    }
                                                ></StatusComponentButton>
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
