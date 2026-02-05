"use client";

import { useEffect, useState } from "react";

export default function ReceiptPage({
    params,
}: {
    params: { id: string };
}) {
    const [sale, setSale] = useState<any>(null);
    const [details, setDetails] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/sales/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setSale(data.sale);
                setDetails(data.details);
            });
    }, [params.id]);

    if (!sale) return <p>Loading...</p>;

    return (
        <div
            style={{
                maxWidth: 320,
                margin: "auto",
                padding: 20,
                fontFamily: "monospace",
            }}
        >
            <h3 style={{ textAlign: "center" }}>
                🏥 APOTEK SEHAT
            </h3>
            <p style={{ textAlign: "center" }}>
                Jl. Contoh No. 123
            </p>

            <hr />

            <p>
                <b>No:</b> {sale.id}
            </p>
            <p>
                <b>Tanggal:</b>{" "}
                {new Date(sale.date).toLocaleString()}
            </p>

            <hr />

            {details.map((item, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                    }}
                >
                    <div>
                        <div>{item.name}</div>
                        <small>
                            {item.qty} x {item.price}
                        </small>
                    </div>
                    <div>
                        {item.qty * item.price}
                    </div>
                </div>
            ))}

            <hr />

            <p>
                <b>Total:</b> Rp {sale.total}
            </p>

            <hr />

            <p style={{ textAlign: "center" }}>
                Terima kasih 🙏
            </p>

            <button
                onClick={() => window.print()}
                style={{
                    width: "100%",
                    marginTop: 20,
                    padding: 10,
                }}
            >
                🖨 Cetak Struk
            </button>
        </div>
    );
}
