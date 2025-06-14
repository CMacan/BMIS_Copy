<?php

namespace App\Exports;

use App\Models\ActivityLog;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ActivityLogsExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = ActivityLog::query();

        // Apply filters if provided
        if (!empty($this->filters['log_table'])) {
            $query->where('log_table', $this->filters['log_table']);
        }

        if (!empty($this->filters['log_action'])) {
            $query->where('log_action', $this->filters['log_action']);
        }

        if (!empty($this->filters['date_start']) && !empty($this->filters['date_end'])) {
            $query->whereBetween('created_at', [$this->filters['date_start'], $this->filters['date_end']]);
        }

        return $query->get(['id', 'log_action', 'log_table', 'created_at']);
    }

    public function headings(): array
    {
        return ['ID', 'Action', 'Table', 'Date'];
    }
}
