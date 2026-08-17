import { AlertTriangle } from "lucide-react";

type AttentionItem = {
    text: string;
    tone:
        | "warning"
        | "danger"
        | "info"
        | "success";
};

type Props = {
    items: AttentionItem[];
};

export default function AttentionCard({
    items,
}: Props) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                }}
            >
                <AlertTriangle
                    size={16}
                    color="var(--warning)"
                />

                <div
                    className="tm-display"
                    style={{
                        fontWeight: 700,
                        fontSize: 14.5,
                    }}
                >
                    Perlu Perhatian
                </div>
            </div>

            {items.map((item, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 0",
                        borderBottom:
                            index < items.length - 1
                                ? "1px solid var(--border-soft)"
                                : "none",
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                            background: `var(--${item.tone})`,
                            flexShrink: 0,
                        }}
                    />

                    <span
                        style={{
                            fontSize: 13,
                        }}
                    >
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );
}