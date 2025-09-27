import React from "react";

function StatusBadge({ status }) {
    const map = {
        Open: "bg-blue-50 text-blue-700",
        "In Progress": "bg-yellow-50 text-yellow-700",
        Solving: "bg-gray-100 text-gray-700",
        Urgency: "bg-red-50 text-red-700",
        Done: "bg-green-50 text-green-700",
        Cancel: "bg-gray-50 text-gray-500",
    };
    const classes = map[status] || "bg-gray-50 text-gray-700";
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
            {status}
        </span>
    );
}

export default function ServiceCard({ service, onView }) {
    return (
        <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
            <div>
                <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-slate-800">
                        <span className="text-indigo-600">#{service.id}</span>
                        <span className="ml-2">{service.customerName ?? service.customer ?? "-"}</span>
                    </div>
                    <StatusBadge status={service.status} />
                </div>

                <p className="mt-3 text-sm text-slate-600 min-h-[44px]">
                    {service.shortDescription ?? (service.description?.slice(0, 120) ?? "-")}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                    {new Date(service.date ?? service.createdAt ?? Date.now()).toLocaleDateString()}
                </div>
                <button
                    onClick={() => onView(service.id)}
                    className="text-xs px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                >
                    View
                </button>
            </div>
        </div>
    );
}
