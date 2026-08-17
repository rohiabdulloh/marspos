<?php

namespace App\Services;

use App\Models\Category;
use App\Models\ProductStock;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Receivable;
use App\Models\Payable;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Return seluruh data dashboard.
     */
    public function getDashboard(string $range = 'today'): array
    {
        [$startDate, $endDate, $previousStart, $previousEnd] =
            $this->resolveRange($range);

        return [
            'range' => $range,

            'stats' => $this->getStats(
                $startDate,
                $endDate,
                $previousStart,
                $previousEnd
            ),

            'salesTrend' => $this->getSalesTrend(),

            'categoryDist' => $this->getCategoryDistribution(),

            'bestSelling' => $this->getBestSellingProducts(
                $startDate,
                $endDate
            ),

            'attention' => $this->getAttentionItems(),
        ];
    }

    /**
     * =========================================================
     * STATS
     * =========================================================
     */
    public function getStats(
        Carbon $startDate,
        Carbon $endDate,
        Carbon $previousStart,
        Carbon $previousEnd
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Current sales
        |--------------------------------------------------------------------------
        */

        $sales = Sale::query()
            ->where('status', '!=', 'cancelled')
            ->whereBetween('transaction_date', [
                $startDate,
                $endDate,
            ])
            ->sum('grand_total');

        /*
        |--------------------------------------------------------------------------
        | Transactions
        |--------------------------------------------------------------------------
        */

        $transactions = Sale::query()
            ->where('status', '!=', 'cancelled')
            ->whereBetween('transaction_date', [
                $startDate,
                $endDate,
            ])
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Gross profit
        |--------------------------------------------------------------------------
        */

        $grossProfit = SaleItem::query()
            ->whereHas('sale', function ($query) use (
                $startDate,
                $endDate
            ) {
                $query
                    ->where('status', '!=', 'cancelled')
                    ->whereBetween('transaction_date', [
                        $startDate,
                        $endDate,
                    ]);
            })
            ->selectRaw('
                COALESCE(SUM(total), 0)
                -
                COALESCE(
                    SUM(cost_price * base_quantity),
                    0
                ) AS gross_profit
            ')
            ->value('gross_profit');

        /*
        |--------------------------------------------------------------------------
        | Receivable
        |--------------------------------------------------------------------------
        */

        $receivable = Receivable::query()
            ->where('remaining_amount', '>', 0)
            ->sum('remaining_amount');

        /*
        |--------------------------------------------------------------------------
        | Payable
        |--------------------------------------------------------------------------
        */

        $payable = Payable::query()
            ->where('remaining_amount', '>', 0)
            ->sum('remaining_amount');

        /*
        |--------------------------------------------------------------------------
        | Low stock
        |--------------------------------------------------------------------------
        */

        $lowStock = ProductStock::query()
            ->join(
                'products',
                'products.id',
                '=',
                'product_stocks.product_id'
            )
            ->where('products.is_active', true)
            ->whereRaw(
                'product_stocks.quantity <= products.minimum_stock'
            )
            ->distinct()
            ->count('product_stocks.product_id');

        /*
        |--------------------------------------------------------------------------
        | Expired batches
        |--------------------------------------------------------------------------
        |
        | Sementara menggunakan product_batches.
        |
        */

        $expiredBatches = DB::table('product_batches')
            ->whereNotNull('expiry_date')
            ->where(
                'expiry_date',
                '<=',
                now()->addDays(30)
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Cash today
        |--------------------------------------------------------------------------
        |
        | Untuk sementara berdasarkan paid_amount pada sales.
        | Jika SalePayment tersedia, sebaiknya diganti
        | menggunakan SalePayment.
        |
        */

        $cashToday = Sale::query()
            ->where('status', '!=', 'cancelled')
            ->whereDate(
                'transaction_date',
                today()
            )
            ->sum('paid_amount');

        /*
        |--------------------------------------------------------------------------
        | Previous sales
        |--------------------------------------------------------------------------
        */

        $previousSales = Sale::query()
            ->where('status', '!=', 'cancelled')
            ->whereBetween('transaction_date', [
                $previousStart,
                $previousEnd,
            ])
            ->sum('grand_total');

        /*
        |--------------------------------------------------------------------------
        | Previous transactions
        |--------------------------------------------------------------------------
        */

        $previousTransactions = Sale::query()
            ->where('status', '!=', 'cancelled')
            ->whereBetween('transaction_date', [
                $previousStart,
                $previousEnd,
            ])
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Previous gross profit
        |--------------------------------------------------------------------------
        */

        $previousGrossProfit = SaleItem::query()
            ->whereHas('sale', function ($query) use (
                $previousStart,
                $previousEnd
            ) {
                $query
                    ->where('status', '!=', 'cancelled')
                    ->whereBetween('transaction_date', [
                        $previousStart,
                        $previousEnd,
                    ]);
            })
            ->selectRaw('
                COALESCE(SUM(total), 0)
                -
                COALESCE(
                    SUM(cost_price * base_quantity),
                    0
                ) AS gross_profit
            ')
            ->value('gross_profit');

        return [
            'sales' => [
                'value' => (float) $sales,
                'delta' => $this->calculateDelta(
                    $sales,
                    $previousSales
                ),
            ],

            'transactions' => [
                'value' => (int) $transactions,
                'delta' => $this->calculateDelta(
                    $transactions,
                    $previousTransactions
                ),
            ],

            'gross_profit' => [
                'value' => (float) $grossProfit,
                'delta' => $this->calculateDelta(
                    (float) $grossProfit,
                    (float) $previousGrossProfit
                ),
            ],

            'receivable' => [
                'value' => (float) $receivable,
                'delta' => null,
            ],

            'payable' => [
                'value' => (float) $payable,
                'delta' => null,
            ],

            'low_stock' => [
                'value' => (int) $lowStock,
                'delta' => null,
            ],

            'expired_batches' => [
                'value' => (int) $expiredBatches,
                'delta' => null,
            ],

            'cash_today' => [
                'value' => (float) $cashToday,
                'delta' => null,
            ],
        ];
    }

    /**
     * =========================================================
     * SALES TREND
     * =========================================================
     */
    public function getSalesTrend(): Collection
    {
        $start = Carbon::today()
            ->subDays(6)
            ->startOfDay();

        $end = Carbon::today()
            ->endOfDay();

        $sales = Sale::query()
            ->selectRaw(
                'DATE(transaction_date) as date,
                 SUM(grand_total) as total'
            )
            ->where(
                'status',
                '!=',
                'cancelled'
            )
            ->whereBetween(
                'transaction_date',
                [
                    $start,
                    $end,
                ]
            )
            ->groupByRaw(
                'DATE(transaction_date)'
            )
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        return collect(range(6, 0))
            ->map(function ($daysAgo) use ($sales) {
                $date = Carbon::today()
                    ->subDays($daysAgo);

                $key = $date->toDateString();

                return [
                    'day' => $date->translatedFormat('D'),

                    'date' => $key,

                    'val' => (float) (
                        $sales[$key]->total ?? 0
                    ),
                ];
            })
            ->values();
    }

    /**
     * =========================================================
     * CATEGORY DISTRIBUTION
     * =========================================================
     */
    public function getCategoryDistribution(): Collection
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount([
                'products' => function ($query) {
                    $query->where(
                        'is_active',
                        true
                    );
                },
            ])
            ->having(
                'products_count',
                '>',
                0
            )
            ->orderByDesc(
                'products_count'
            )
            ->limit(6)
            ->get([
                'id',
                'name',
            ]);

        $total = max(
            1,
            $categories->sum(
                'products_count'
            )
        );

        $colors = [
            '#2F6B3C',
            '#5A8F62',
            '#86A98B',
            '#B0C6B3',
            '#D0DDD2',
            '#E3EAE3',
        ];

        return $categories
            ->values()
            ->map(
                function (
                    $category,
                    $index
                ) use (
                    $total,
                    $colors
                ) {
                    return [
                        'name' => $category->name,

                        'value' => round(
                            (
                                $category
                                    ->products_count
                                / $total
                            ) * 100,
                            1
                        ),

                        'color' =>
                            $colors[
                                $index %
                                count($colors)
                            ],
                    ];
                }
            );
    }

    /**
     * =========================================================
     * BEST SELLING PRODUCTS
     * =========================================================
     */
    public function getBestSellingProducts(
        Carbon $startDate,
        Carbon $endDate
    ): Collection {
        return SaleItem::query()
            ->select(
                'product_id',
                'product_name',
                DB::raw(
                    'SUM(base_quantity) as sold'
                ),
                DB::raw(
                    'SUM(total) as revenue'
                )
            )
            ->whereHas(
                'sale',
                function ($query) use (
                    $startDate,
                    $endDate
                ) {
                    $query
                        ->where(
                            'status',
                            '!=',
                            'cancelled'
                        )
                        ->whereBetween(
                            'transaction_date',
                            [
                                $startDate,
                                $endDate,
                            ]
                        );
                }
            )
            ->groupBy(
                'product_id',
                'product_name'
            )
            ->orderByDesc('sold')
            ->limit(5)
            ->get()
            ->map(
                function ($item) {
                    return [
                        'name' =>
                            $item->product_name,

                        'sold' =>
                            (float) $item->sold,

                        'revenue' =>
                            (float) $item->revenue,
                    ];
                }
            );
    }

    /**
     * =========================================================
     * ATTENTION ITEMS
     * =========================================================
     */
    public function getAttentionItems(): array
    {
        /*
        |--------------------------------------------------------------------------
        | Low stock
        |--------------------------------------------------------------------------
        */

        $lowStock = ProductStock::query()
            ->join(
                'products',
                'products.id',
                '=',
                'product_stocks.product_id'
            )
            ->where(
                'products.is_active',
                true
            )
            ->whereRaw(
                'product_stocks.quantity <= products.minimum_stock'
            )
            ->distinct()
            ->count(
                'product_stocks.product_id'
            );

        /*
        |--------------------------------------------------------------------------
        | Expired
        |--------------------------------------------------------------------------
        */

        $expiredBatches = DB::table(
            'product_batches'
        )
            ->whereNotNull(
                'expiry_date'
            )
            ->where(
                'expiry_date',
                '<=',
                now()->addDays(30)
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Overdue receivable
        |--------------------------------------------------------------------------
        */

        $overdueReceivable = Receivable::query()
            ->where(
                'remaining_amount',
                '>',
                0
            )
            ->whereDate(
                'due_date',
                '<',
                today()
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Overdue payable
        |--------------------------------------------------------------------------
        */

        $overduePayable = Payable::query()
            ->where(
                'remaining_amount',
                '>',
                0
            )
            ->whereDate(
                'due_date',
                '<',
                today()
            )
            ->count();

        return [
            [
                'text' =>
                    "{$lowStock} produk stok menipis",

                'tone' =>
                    'warning',
            ],

            [
                'text' =>
                    "{$expiredBatches} batch akan expired dalam 30 hari",

                'tone' =>
                    'danger',
            ],

            [
                'text' =>
                    "{$overdueReceivable} invoice pelanggan jatuh tempo",

                'tone' =>
                    'info',
            ],

            [
                'text' =>
                    "{$overduePayable} invoice supplier jatuh tempo",

                'tone' =>
                    'warning',
            ],
        ];
    }

    /**
     * =========================================================
     * RANGE
     * =========================================================
     */
    private function resolveRange(
        string $range
    ): array {
        $today = Carbon::today();

        return match ($range) {
            'week' => [
                $today
                    ->copy()
                    ->startOfWeek(),

                $today
                    ->copy()
                    ->endOfWeek(),

                $today
                    ->copy()
                    ->subWeek()
                    ->startOfWeek(),

                $today
                    ->copy()
                    ->subWeek()
                    ->endOfWeek(),
            ],

            'month' => [
                $today
                    ->copy()
                    ->startOfMonth(),

                $today
                    ->copy()
                    ->endOfMonth(),

                $today
                    ->copy()
                    ->subMonth()
                    ->startOfMonth(),

                $today
                    ->copy()
                    ->subMonth()
                    ->endOfMonth(),
            ],

            default => [
                $today
                    ->copy()
                    ->startOfDay(),

                $today
                    ->copy()
                    ->endOfDay(),

                $today
                    ->copy()
                    ->subDay()
                    ->startOfDay(),

                $today
                    ->copy()
                    ->subDay()
                    ->endOfDay(),
            ],
        };
    }

    /**
     * =========================================================
     * DELTA
     * =========================================================
     */
    private function calculateDelta(
        float|int $current,
        float|int $previous
    ): ?string {
        if ((float) $previous === 0.0) {
            return $current > 0
                ? '+100%'
                : null;
        }

        $delta =
            (
                ($current - $previous)
                / $previous
            ) * 100;

        return sprintf(
            '%+.1f%%',
            $delta
        );
    }
}