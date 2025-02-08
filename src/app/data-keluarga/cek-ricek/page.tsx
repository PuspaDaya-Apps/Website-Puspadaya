"use client"

import React, { useEffect, useState } from 'react';
import { statistikDashboard } from '@/app/api/statistik/statistik';

const DashboardPage = () => {
    const [datadash, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await statistikDashboard();

            // console.log("Fetched Data:", result);

            if (result.successCode === 200 && result.data) {
                setData(result.data);
                setError(null);
            } else {
                setData(null);
                setError("Error fetching data. Please try again.");
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h1>Dashboard Data</h1>
            <h2>Jumlah Anak</h2>
            <p>{datadash?.jumlah_anak.jumlah}</p>


            <h2>Jumlah Anak Stunting</h2>
            <p>{datadash?.jumlah_anak_stunting.jumlah}</p>
            <p>{datadash?.jumlah_anak_stunting.status}</p>


            <h2>Jumlah Anak Underweight</h2>
            <p>{datadash?.jumlah_anak_underweight.jumlah}</p>
            <p>{datadash?.jumlah_anak_underweight.status}</p>


            <h2>Jumlah Anak Wasting</h2>
            <p>{datadash?.jumlah_anak_wasting.jumlah}</p>


            <h2>Jumlah Desa</h2>
            <p>{datadash?.jumlah_desa.jumlah}</p>


            <h2>Jumlah Ibu Hamil</h2>
            <p>{datadash?.jumlah_ibu_hamil.jumlah}</p>


            <h2>Jumlah Posyandu</h2>
            <p>{datadash?.jumlah_posyandu.jumlah}</p>


            <h2>Jumlah Kader</h2>
            <p>{datadash?.jumlah_kader.jumlah}</p>

            <h3>Persentase Kader</h3>
            <p>Banyuwangi: {datadash?.persentase_kader.kader_banyuwangi_rate}%</p>
            <p>Maluku: {datadash?.persentase_kader.kader_maluku_rate}%</p>

            <h3>Persentase Posyandu</h3>
            <p>Banyuwangi: {datadash?.persentase_posyandu.posyandu_banyuwangi_rate}%</p>
            <p>Maluku: {datadash?.persentase_posyandu.posyandu_maluku_rate}%</p>
        </div>
    );
};

export default DashboardPage;
