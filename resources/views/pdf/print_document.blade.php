<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document Certificate</title>
  <style>
    body { font-family: sans-serif; margin: 40px; }
    .header, .footer { text-align: center; }
    .header img { max-width: 100px; }
    .content { margin-top: 20px; text-align: center; }
    .flex { display: flex; justify-content: space-between; align-items: center; }
    .border { border: 1px solid #000; padding: 10px; }
  </style>
</head>
<body>
  <div class="header flex">
    <div>
      <img src="{{ public_path('images/barangay-logo.png') }}" alt="Barangay Logo">
    </div>
    <div>
      <h2>Document Certificate</h2>
      <p>Republic of the Philippines</p>
      <p style="font-weight:bold;">CITY OF CEBU</p>
      <p style="font-weight:bold;">BARANGAY SAWANG CALERO</p>
    </div>
    <div>
      <img src="{{ public_path('images/officialseal.png') }}" alt="Official Seal">
    </div>
  </div>
  <div class="content">
    <h3>This is a default certificate for</h3>
    <h3><strong>{{ $document->name }}</strong></h3>
    <p>Address: {{ $document->address }}</p>
    <p>Purpose: {{ $document->purpose }}</p>
    <p>Issued on {{ \Carbon\Carbon::parse($document->created_at)->format('F d, Y') }}</p>
  </div>
  <div class="footer" style="margin-top: 50px;">
    <p>Itaguyod ang Transparyente, Mabilis at Responsableng Barangay Sawang Calero</p>
  </div>
</body>
</html>
