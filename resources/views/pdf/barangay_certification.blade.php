<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{ $document->document_type }} Certificate</title>
  <style>
    body { font-family: sans-serif; margin: 40px; }
    .header, .footer { text-align: center; }
    .header img { max-width: 100px; }
    .content { margin-top: 20px; }
    .text-center { text-align: center; }
    .flex { display: flex; justify-content: space-between; align-items: center; }
    .border { border: 1px solid #000; padding: 10px; }
    .officials-section {
      width: 30%;
      float: left;
      border-right: 1px solid #ccc;
      padding-right: 15px;
    }
    .main-content {
      width: 65%;
      float: right;
      padding-left: 15px;
    }
    .official-item {
      margin-bottom: 10px;
    }
    .official-photo {
      width: 60px;
      height: 60px;
      background-color: #fef9c3;
      border: 1px solid #ccc;
      float: left;
      margin-right: 10px;
    }
    .official-info {
      margin-left: 70px;
    }
    .official-indent {
      margin-left: 70px;
    }
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
    .text-justify {
      text-align: justify;
    }
    .text-xs {
      font-size: 12px;
    }
    .text-sm {
      font-size: 14px;
    }
    .font-bold {
      font-weight: bold;
    }
    .italic {
      font-style: italic;
    }
    .mt-8 {
      margin-top: 32px;
    }
    .checkbox-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin: 15px 0;
    }
    .checkbox-item {
      display: flex;
      align-items: center;
    }
    .checkbox {
      width: 15px;
      height: 15px;
      border: 1px solid black;
      margin-right: 5px;
      display: inline-block;
      text-align: center;
      line-height: 15px;
    }
    .info-row {
      display: flex;
      margin-bottom: 5px;
    }
    .info-label {
      width: 100px;
      font-weight: bold;
    }
    .gothic-title {
      font-family: "Old English Text MT", "Times New Roman", serif;
      font-size: 24px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header flex">
    <div>
      <img src="{{ public_path('images/barangay-logo.png') }}" alt="Barangay Logo">
    </div>
    <div class="text-center">
      <p>Republic of the Philippines</p>
      <p style="font-weight: bold; font-size: 20px;">CITY OF CEBU</p>
      <p style="font-weight: bold;">BARANGAY SAWANG CALERO</p>
      <p style="font-size: 12px;">Tupas St., Sawang Calero, Cebu City • Tel No. 032 342-0532</p>
      <p style="font-weight: bold; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    </div>
    <div>
      <img src="{{ public_path('images/officialseal.png') }}" alt="Official Seal">
    </div>
  </div>

  <div class="gothic-title">
    Certification
  </div>

  <div class="clearfix" style="margin-top: 30px;">
    <div class="officials-section">
      <h3 class="text-center text-sm font-bold" style="margin-bottom: 15px;">THE BARANGAY OFFICIALS</h3>

      <div class="official-item clearfix">
        <div class="official-photo"></div>
        <div class="official-info">
          <p class="text-xs font-bold">HON. SERGIO S. OCAÑA</p>
          <p class="text-xs italic">Punong Barangay</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. JONAS B. ABELLAR</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. MARVIN B. CUYNO</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. VENANCIO A. ABAYAN</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. IMELDA CORAZON L. BILUD</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. RAMON V. DIAMANTE</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. ARISTEIDZA A. JAVINES</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. RENATO L. CABANES</p>
          <p class="text-xs italic">Barangay Councilor</p>
        </div>
      </div>

      <div class="official-item">
        <div class="official-indent">
          <p class="text-xs font-bold">HON. PAIGE IANAH I. SILUD</p>
          <p class="text-xs italic">SK Chairperson</p>
        </div>
      </div>

      <div class="mt-8 text-xs">
        <p>Not Valid Without</p>
        <p>Official Seal</p>
      </div>
    </div>

    <div class="main-content">
      <h3 class="text-sm font-bold" style="margin-bottom: 15px;">TO WHOM IT MAY CONCERN:</h3>

      <p class="text-sm text-justify" style="margin-bottom: 15px;">
        This is to certify that the person whose name, signature or right thumb print appears herein:
      </p>

      <div class="info-row">
        <div class="info-label">Full Name:</div>
        <div>{{ $document->full_name ?? 'RALPH JOHN VILLAHERMOSA' }}</div>
      </div>

      <div class="info-row">
        <div class="info-label">Birth Date:</div>
        <div>{{ $document->birth_date ?? 'MAY 9, 2002' }}</div>
      </div>

      <div class="info-row">
        <div class="info-label">Status:</div>
        <div>{{ $document->status ?? 'SINGLE' }}</div>
      </div>

      <div class="info-row">
        <div class="info-label">Address:</div>
        <div>{{ $document->address ?? 'GENERAL GINES ST., BLK 7A SAWANG CALERO, CEBU CITY' }}</div>
      </div>

      <p class="text-sm text-justify" style="margin: 15px 0;">
        Certify further that as per records filed in this office, subject person, has NO derogatory records as of this date of issue.
      </p>

      <p class="text-sm text-justify" style="margin-bottom: 10px;">
        This certification is hereby issued upon the request of the claimant in connection with his/her application for:
      </p>

      <div class="checkbox-container">
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'School Requirement' ? '✓' : '' }}</div>
          <span>School Requirement</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'MCWD' ? '✓' : '' }}</div>
          <span>MCWD</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Local Employment' ? '✓' : '' }}</div>
          <span>Local Employment</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Postal ID' ? '✓' : '' }}</div>
          <span>Postal ID</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Proper Identification' ? '✓' : '' }}</div>
          <span>Proper Identification</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Police Clearance' ? '✓' : '' }}</div>
          <span>Police Clearance</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Residency' ? 'XX' : '' }}</div>
          <span>Residency</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'NBI Clearance' ? '✓' : '' }}</div>
          <span>NBI Clearance</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Good Moral Character' ? '✓' : '' }}</div>
          <span>Good Moral Character</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'License Renewal' ? '✓' : '' }}</div>
          <span>License Renewal (Firearms/Driver's)</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Open an Account' ? '✓' : '' }}</div>
          <span>Open an Account</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Others' ? '✓' : '' }}</div>
          <span>Others (Specify Below)</span>
        </div>
        <div class="checkbox-item">
          <div class="checkbox">{{ $document->purpose == 'Electrification' ? '✓' : '' }}</div>
          <span>Electrification (VECO)</span>
        </div>
      </div>

      <p class="text-sm" style="margin: 15px 0;">
        Issued on {{ \Carbon\Carbon::parse($document->created_at)->format('F d, Y') ?? 'February 15, 2024' }} at Barangay Sawang Calero, Cebu City.
      </p>

      <div style="margin-top: 30px; display: flex; justify-content: space-between;">
        <div style="text-align: center;">
          <div style="border: 1px solid black; width: 150px; height: 80px;"></div>
          <p class="text-xs" style="margin-top: 5px;">Signature</p>
          <p class="text-xs">Right Thumb Print</p>
        </div>

        <div style="text-align: center;">
          <p class="text-sm" style="margin-bottom: 5px;">Prepared by:</p>
          <div style="height: 80px;"></div>
          <p class="text-sm font-bold">CINDERELLA I. MONTERMOSO</p>
          <p class="text-xs">Barangay Secretary</p>
        </div>
      </div>
    </div>
  </div>

  <div style="position: absolute; bottom: 20px; width: 100%; text-align: center; font-style: italic; font-size: 12px;">
    <p>Itaguyod ang Transparyente, Mabilis at Responsableng Barangay Sawang Calero</p>
  </div>
</body>
</html>
