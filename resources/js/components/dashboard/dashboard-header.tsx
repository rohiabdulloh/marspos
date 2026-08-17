type DashboardHeaderProps = {
    range: string;
    onRangeChange: (value: string) => void;
};

const ranges = [
    {
        label: "Hari Ini",
        value: "today",
    },
    {
        label: "Minggu Ini",
        value: "week",
    },
    {
        label: "Bulan Ini",
        value: "month",
    },
    {
        label: "Custom",
        value: "custom",
    },
];

export default function DashboardHeader({
    range,
    onRangeChange,
}: DashboardHeaderProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 18,
            }}
        >
            <div>

                <h1
                    className="tm-display"
                    style={{
                        margin: 0,
                        fontSize: 24,
                        fontWeight: 700,
                    }}
                >
                    Dashboard
                </h1>

                <div
                    style={{
                        marginTop: 4,
                        fontSize: 13,
                        color: "var(--text-soft)",
                    }}
                >
                    Selamat datang kembali, Admin
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 6,
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 3,
                }}
            >
                {ranges.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                            onRangeChange(item.value)
                        }
                        className="tm-focus"
                        style={{
                            padding: "7px 12px",
                            borderRadius: 7,
                            fontSize: 12.5,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            background:
                                range === item.value
                                    ? "var(--primary)"
                                    : "transparent",
                            color:
                                range === item.value
                                    ? "#fff"
                                    : "var(--text-soft)",
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}