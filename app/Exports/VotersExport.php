<?php

namespace App\Exports;

use App\Models\Voter;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class VotersExport implements FromCollection, WithHeadings
{
    protected $precinctId;

    public function __construct($precinctId = null)
    {
        $this->precinctId = $precinctId;
    }

    public function collection()
    {
        $query = Voter::select('id', 'vote_fname', 'vote_lname', 'precinct_id')
            ->with('precinct');
        
        // Apply precinct filter if provided
        if ($this->precinctId) {
            $query->where('precinct_id', $this->precinctId);
        }
        
        return $query->get()
            ->map(function ($voter, $index) {
                return [
                    'No.' => $index + 1,
                    'Name' => $voter-> vote_lname. ' ' . $voter->vote_fname,
                    'Precinct Number' => $voter->precinct ? $voter->precinct->precinct_number : 'N/A',
                ];
            });
    }

    public function headings(): array
    {
        return ['No.', 'Name', 'Precinct Number'];
    }
}
?>