// src/pages/admin/ServicePage.jsx
import { useState } from "react";
import CustomerForm from "../admin/CustomerForm";
import ServiceForm from "../admin/ServiceForm";

export default function ServicePage() {
    const [customerId, setCustomerId] = useState(null); 

    return (
        <div className="p-6">
            {!customerId ? (
                <CustomerForm onCreated={(id) => setCustomerId(id)} />
            ) : (
                <ServiceForm customerId={customerId} />
            )}
        </div>
    );
}
