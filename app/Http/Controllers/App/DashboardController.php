<?php

namespace App\Http\Controllers\App;

use App\Services\DashboardService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request): Response
    {
        $range = $request->string('range', 'today')->toString();

        return Inertia::render(
            'dashboard/index',
            $this->dashboardService->getDashboard($range)
        );
    }
}