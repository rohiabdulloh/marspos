export type DashboardStats = {
    value: number;
    delta: string | null;
};

export type DashboardCategory = {
    name: string;
    value: number;
    color: string;
};

export type BestSellingProduct = {
    name: string;
    sold: number;
    revenue: number;
};

export type AttentionItem = {
    text: string;
    tone: "warning" | "danger" | "info" | "success";
};

export type DashboardProps = {
    range: string;

    stats: {
        sales: DashboardStats;
        transactions: DashboardStats;
        gross_profit: DashboardStats;
        receivable: DashboardStats;
        payable: DashboardStats;
        low_stock: DashboardStats;
        expired_batches: DashboardStats;
        cash_today: DashboardStats;
    };

    salesTrend: {
        day: string;
        date: string;
        val: number;
    }[];

    categoryDist: DashboardCategory[];

    bestSelling: BestSellingProduct[];

    attention: AttentionItem[];
};