// src/hooks/useServices.js
import { useEffect, useState, useRef } from "react";
import { getServices } from "../utils/api";

export default function useServices({ initialStatus = "", initialSearch = "" } = {}) {
    const [services, setServices] = useState([]);
    const [status, setStatus] = useState(initialStatus);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const debounceRef = useRef(null);

    const fetchList = async ({ statusParam = status, searchParam = search } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const json = await getServices({ status: statusParam || undefined, search: searchParam || undefined });
            // dukungan API: jika response: { data: [...] } gunakan json.data
            setServices(json?.data ?? json);
        } catch (err) {
            setError(err?.message ?? "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    // initial load
    useEffect(() => {
        fetchList({ statusParam: initialStatus, searchParam: initialSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // when status changes -> immediate fetch
    useEffect(() => {
        fetchList({ statusParam: status, searchParam: search });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchList({ statusParam: status, searchParam: search });
        }, 350);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return {
        services,
        loading,
        error,
        status,
        setStatus,
        search,
        setSearch,
        fetchList,
        setServices,
    };
}
