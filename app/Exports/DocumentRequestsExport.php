<?php

namespace App\Exports;

use App\Models\DocumentRequest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DocumentRequestsExport implements FromCollection, WithHeadings, WithColumnWidths, WithStyles, WithMapping
{
    public function collection()
    {
        return DocumentRequest::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'User ID',
            'Name',
            'Address',
            'Age',
            'Block',
            'Civil Status',
            'Number of Copies',
            'Purpose',
            'Document Status',
            'Document Type',
            'Staff ID Number',
            'Created At',
            'Updated At',
            'Requester Name',
            'Requester Email',
            'Requester Contact',
            'Decline Reason',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 10,
            'B' => 10,
            'C' => 20,
            'D' => 25,
            'E' => 10,
            'F' => 10,
            'G' => 20,
            'H' => 20,
            'I' => 20,
            'J' => 20,
            'K' => 25,
            'L' => 20,
            'M' => 25,
            'N' => 25,
            'O' => 30,
            'P' => 30,
            'Q' => 30,
            'R' => 50,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],

            'A' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'B' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'C' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'D' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'E' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'F' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'G' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'H' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'I' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'J' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'K' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'L' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'M' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'N' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'O' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'P' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'Q' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'R' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
        ];
    }

    public function map($documentRequest): array
    {
        return [
            $documentRequest->id,
            $documentRequest->user_id,
            Str::title(strtolower($documentRequest->name)),
            Str::title(strtolower($documentRequest->address)),
            $documentRequest->age,
            Str::title(strtolower($documentRequest->block)),
            Str::title(strtolower($documentRequest->civil_status)),
            $documentRequest->copies,
            Str::title(strtolower($documentRequest->purpose)),
            Str::title(strtolower($documentRequest->status)),
            Str::title(strtolower($documentRequest->document_type)),
            $documentRequest->staff_id,
            Carbon::parse($documentRequest->created_at)->format('m/d/Y'),
            Carbon::parse($documentRequest->updated_at)->format('m/d/Y'),
            Str::title(strtolower($documentRequest->requester_name)),
            strtolower($documentRequest->requester_email),
            $documentRequest->requester_contact,
            Str::title(strtolower($documentRequest->decline_reason)),
        ];
    }
}
