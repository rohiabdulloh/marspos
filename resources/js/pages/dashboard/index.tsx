import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

import r from "@/lib/route";

import {
    Boxes,
    CalendarClock,
    HandCoins,
    Landmark,
    Receipt,
    ShoppingCart,
    TrendingUp,
    Wallet,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStatCard from "@/components/dashboard/dashboard-stat-card";
import SalesTrendChart from "@/components/dashboard/sales-trend-chart";
import CategoryDistribution from "@/components/dashboard/category-distribution";
import BestSellingProducts from "@/components/dashboard/best-selling-products";
import AttentionCard from "@/components/dashboard/attention-card";

import type { DashboardProps } from "@/types/dashboard";

function rp(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Dashboard({
    range,
    stats,
    salesTrend,
    categoryDist,
    bestSelling,
    attention,
}: DashboardProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const removeStart = router.on(
            "start",
            () => setLoading(true)
        );

        const removeFinish = router.on(
            "finish",
            () => setLoading(false)
        );

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const changeRange = (value: string) => {
        if (value === "custom") {
            return;
        }

        router.get(
            r("dashboard"),
            {
                range: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const statCards = [
        {
            label: "Penjualan Hari Ini",
            value: rp(stats.sales.value),
            delta: stats.sales.delta,
            icon: Receipt,
            tone: "primary",
        },
        {
            label: "Transaksi",
            value: stats.transactions.value.toLocaleString(
                "id-ID"
            ),
            delta: stats.transactions.delta,
            icon: ShoppingCart,
            tone: "info",
        },
        {
            label: "Laba Kotor",
            value: rp(stats.gross_profit.value),
            delta: stats.gross_profit.delta,
            icon: TrendingUp,
            tone: "success",
        },
        {
            label: "Piutang",
            value: rp(stats.receivable.value),
            icon: HandCoins,
            tone: "warning",
        },
        {
            label: "Hutang",
            value: rp(stats.payable.value),
            icon: Wallet,
            tone: "danger",
        },
        {
            label: "Stok Menipis",
            value: `${stats.low_stock.value} Produk`,
            icon: Boxes,
            tone: "warning",
        },
        {
            label: "Produk Expired",
            value: `${stats.expired_batches.value} Batch`,
            icon: CalendarClock,
            tone: "danger",
        },
        {
            label: "Kas Hari Ini",
            value: rp(stats.cash_today.value),
            icon: Landmark,
            tone: "primary",
        },
    ];

    return (
        <div>
            <DashboardHeader
                range={range}
                onRangeChange={changeRange}
            />

            {/* Stats */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: 14,
                    marginBottom: 18,
                }}
            >
                {statCards.map((stat) => (
                    <DashboardStatCard
                        key={stat.label}
                        {...stat}
                        loading={loading}
                    />
                ))}
            </div>

            {/* Charts */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1.6fr 1fr",
                    gap: 14,
                    marginBottom: 18,
                }}
            >
                <SalesTrendChart
                    data={salesTrend}
                />

                <CategoryDistribution
                    data={categoryDist}
                />
            </div>

            {/* Bottom */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1.6fr 1fr",
                    gap: 14,
                }}
            >
                <BestSellingProducts
                    products={bestSelling}
                />

                <AttentionCard
                    items={attention}
                />
            </div>
        </div>
    );
}


Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: r('dashboard'),
        },
    ],
};