import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type Category = {
    name: string;
    value: number;
    color: string;
};

type Props = {
    data: Category[];
};

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

export default function CategoryDistribution({
    data,
}: Props) {
    return (
        <Card>
            <div
                className="tm-display"
                style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    marginBottom: 10,
                }}
            >
                Distribusi Kategori
            </div>

            <ResponsiveContainer
                width="100%"
                height={170}
            >
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        fill="#2F6B3C"
                    />

                    <Tooltip
                        formatter={(value) =>
                            `${value}%`
                        }
                        contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #E3E7DE",
                            fontSize: 12.5,
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginTop: 6,
                }}
            >
                {data.map((category, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: 12,
                        }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 999,
                                background:
                                    category.color,
                            }}
                        />

                        <span
                            style={{
                                flex: 1,
                                color: "var(--text-soft)",
                            }}
                        >
                            {category.name}
                        </span>

                        <span
                            className="tm-mono"
                            style={{
                                fontWeight: 600,
                            }}
                        >
                            {category.value}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}