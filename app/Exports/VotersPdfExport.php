<?php

namespace App\Exports;

use App\Models\Voter;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Log;

class VotersPdfExport
{
    protected $precinctId;
    protected $config;

    public function __construct($precinctId = null, $config = [])
    {
        $this->precinctId = $precinctId;
        $this->config = array_merge([
            'title' => 'Voter Report',
            'orientation' => 'P', // Portrait
            'format' => 'A4',
            'headerText' => 'Voter Management Report',
            'footerText' => 'Generated on ' . date('Y-m-d H:i:s'),
        ], $config);
    }

    public function export()
    {
        try {
            // Fetch voters data
            $query = Voter::select('id', 'vote_fname', 'vote_lname', 'precinct_id')
                ->with('precinct');

            // Apply precinct filter if provided
            if ($this->precinctId) {
                $query->where('precinct_id', $this->precinctId);
            }

            $voters = $query->get();

            // Initialize Mpdf
            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => $this->config['format'],
                'orientation' => $this->config['orientation'],
            ]);

            // Generate PDF content
            $html = $this->generatePdfContent($voters);
            $mpdf->WriteHTML($html);

            // Add header and footer
            $mpdf->SetHeader($this->config['headerText']);
            $mpdf->SetFooter($this->config['footerText']);

            // Output PDF
            return response($mpdf->Output($this->config['title'] . '.pdf', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $this->config['title'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error('PDF Export Error: ' . $e->getMessage());
            throw $e;
        }
    }

    protected function generatePdfContent($voters)
    {
        $html = "<h1>{$this->config['headerText']}</h1>";
        $html .= "<table border='1' style='width:100%; border-collapse: collapse;'>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Precinct Number</th>
                        </tr>
                    </thead>
                    <tbody>";

        foreach ($voters as $index => $voter) {
            $html .= "<tr>
                        <td>" . ($index + 1) . "</td>
                        <td>{$voter->vote_lname}, {$voter->vote_fname}</td>
                        <td>" . ($voter->precinct ? $voter->precinct->precinct_number : 'N/A') . "</td>
                      </tr>";
        }

        $html .= "</tbody></table>";

        return $html;
    }
}