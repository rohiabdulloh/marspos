import type { ElementType } from "react";
import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
    label: string;
    value: string;
    delta?: string | null;
    icon: ElementType;
    tone?: string;
    loading?: boolean;
};

type CardProps = {
    children: React.ReactNode;
    noPad?: boolean;
    style?: React.CSSProperties;
};

function Card({
    children,
    noPad = false,
    style,
}: CardProps) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: noPad ? 0 : 16,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export default function DashboardStatCard({
    label,
    value,
    delta,
    icon: Icon,
    tone = "primary",
    loading,
}: StatCardProps) {
    if (loading) {
        return (
            <Card style={{ height: 96 }}>
                <div
                    className="tm-skel"
                    style={{
                        width: "60%",
                        height: 12,
                        marginBottom: 12,
                    }}
                />

                <div
                    className="tm-skel"
                    style={{
                        width: "80%",
                        height: 20,
                    }}
                />
            </Card>
        );
    }

    return (
        <Card>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        fontSize: 12.5,
                        color: "var(--text-soft)",
                        fontWeight: 500,
                    }}
                >
                    {label}
                </div>

                <div
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: `var(--${tone}-soft)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon
                        size={15}
                        color={`var(--${tone})`}
                    />
                </div>
            </div>

            <div
                className="tm-mono"
                style={{
                    fontSize: 21,
                    fontWeight: 700,
                    marginTop: 10,
                    color: "var(--text)",
                }}
            >
                {value}
            </div>

            {delta && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: delta.startsWith("-")
                            ? "var(--danger)"
                            : "var(--success)",
                    }}
                >
                    {!delta.startsWith("-") && (
                        <ArrowUpRight size={12} />
                    )}

                    {delta}
                </div>
            )}
        </Card>
    );
}