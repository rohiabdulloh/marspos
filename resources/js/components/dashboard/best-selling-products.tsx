type Product = {
    name: string;
    sold: number;
    revenue: number;
};

type Props = {
    products: Product[];
};

function rp(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function BestSellingProducts({
    products,
}: Props) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
            }}
        >
            <div
                className="tm-display"
                style={{
                    padding: "16px 18px 10px",
                    fontWeight: 700,
                    fontSize: 14.5,
                }}
            >
                Produk Terlaris
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr
                        style={{
                            borderTop:
                                "1px solid var(--border-soft)",
                            borderBottom:
                                "1px solid var(--border-soft)",
                        }}
                    >
                        {[
                            "Produk",
                            "Terjual",
                            "Omzet",
                        ].map((header) => (
                            <th
                                key={header}
                                style={{
                                    textAlign:
                                        header === "Produk"
                                            ? "left"
                                            : "right",
                                    padding:
                                        "9px 18px",
                                    fontSize: 11.5,
                                    color:
                                        "var(--text-faint)",
                                    fontWeight: 600,
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: 0.4,
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {products.map((product, index) => (
                        <tr
                            key={index}
                            style={{
                                borderBottom:
                                    "1px solid var(--border-soft)",
                            }}
                        >
                            <td
                                style={{
                                    padding:
                                        "10px 18px",
                                    fontSize: 13,
                                }}
                            >
                                {product.name}
                            </td>

                            <td
                                className="tm-mono"
                                style={{
                                    padding:
                                        "10px 18px",
                                    fontSize: 12.5,
                                    textAlign: "right",
                                    color:
                                        "var(--text-soft)",
                                }}
                            >
                                {product.sold.toLocaleString(
                                    "id-ID"
                                )}
                            </td>

                            <td
                                className="tm-mono"
                                style={{
                                    padding:
                                        "10px 18px",
                                    fontSize: 12.5,
                                    textAlign: "right",
                                    fontWeight: 600,
                                }}
                            >
                                {rp(product.revenue)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}