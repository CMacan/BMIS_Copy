<?php

namespace App\Imports;

use App\Models\Voter;
use App\Models\PrecinctNumber;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class VotersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Validate required fields
        if (empty($row['last_name']) || empty($row['first_name']) || empty($row['precinct_number'])) {
            throw new \Exception("Missing required fields in row");
        }

        // Check if precinct exists
        $precinct = PrecinctNumber::where('precinct_number', $row['precinct_number'])->first();
        if (!$precinct) {
            throw new \Exception("Undefined precinct number: " . $row['precinct_number']);
        }

        return new Voter([
            'vote_lname' => $row['last_name'],
            'vote_fname' => $row['first_name'],
            'precinct_id' => $precinct->id,
            'bar_id' => 1 // Default barangay
        ]);
    }

    public function headingRow(): int
    {
        return 1; // First row is header
    }
}