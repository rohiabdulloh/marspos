import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type SalesTrend = {
    day: string;
    date: string;
    val: number;
};

type Props = {
    data: SalesTrend[];
};

function rp(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

function Card({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
            }}
        >
            {children}
        </div>
    );
}

export default function SalesTrendChart({
    data,
}: Props) {
    return (
        <Card>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                }}
            >
                <div
                    className="tm-display"
                    style={{
                        fontWeight: 700,
                        fontSize: 14.5,
                    }}
                >
                    Tren Penjualan
                </div>

                <span
                    style={{
                        fontSize: 12,
                        color: "var(--text-faint)",
                    }}
                >
                    7 hari terakhir
                </span>
            </div>

            <ResponsiveContainer
                width="100%"
                height={220}
            >
                <AreaChart
                    data={data}
                    margin={{
                        left: -20,
                        top: 10,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="salesGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#2F6B3C"
                                stopOpacity={0.25}
                            />

                            <stop
                                offset="100%"
                                stopColor="#2F6B3C"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E9ECE5"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="day"
                        tick={{
                            fontSize: 11,
                            fill: "#8A978C",
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        tick={{
                            fontSize: 11,
                            fill: "#8A978C",
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                            `${value / 1000000}jt`
                        }
                    />

                    <Tooltip
                        formatter={(value) =>
                            rp(Number(value))
                        }
                        contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #E3E7DE",
                            fontSize: 12.5,
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#2F6B3C"
                        strokeWidth={2.4}
                        fill="url(#salesGrad)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}