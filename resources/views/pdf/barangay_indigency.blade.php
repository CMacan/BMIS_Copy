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

  <div class="content text-center" style="margin-top: 30px;">
    <h2 style="font-style: italic; font-weight: bold; font-size: 24px;">Certificate of Indigency</h2>
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
        This is to certify that <strong>{{ $document->name }}</strong> is a bonafide resident and
        a registered voter at <strong>{{ $document->address }}</strong>.
      </p>

      <p class="text-sm text-justify" style="margin-bottom: 15px;">
        Certify further that <strong>{{ $document->name }}</strong> is one of the many
        constituents who have no fixed monthly income and is considered as one of
        the many underprivileged individuals in our barangay. This is also to certify
        further that the said person has no record in the barangay.
      </p>

      <p class="text-sm text-justify" style="margin-bottom: 15px;">
        This certification is hereby issued upon the request of <strong>{{ $document->name }}</strong>
        for <strong>{{ $document->purpose }}</strong> for whatever legal purpose it may
        serve.
      </p>

      <p class="text-sm text-justify" style="margin-bottom: 15px;">
        Issued on <strong>{{ \Carbon\Carbon::parse($document->created_at)->format('F d, Y') }}</strong> at Barangay Sawang Calero, City of Cebu.
      </p>

      <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div style="text-align: center;">
          <div style="border: 1px solid black; width: 150px; height: 80px;"></div>
          <p class="text-xs" style="margin-top: 5px;">Signature</p>
          <p class="text-xs">Right Thumb Print</p>
        </div>

        <div style="text-align: center;">
          <p class="text-sm" style="margin-bottom: 5px;">Prepared by:</p>
          <div style="height: 80px;"></div>
          <p class="text-sm font-bold">NHOVIE JEAN C. DE OCAMPO</p>
          <p class="text-xs">Barangay Secretary</p>
        </div>
      </div>

      <div class="mt-8 text-center text-xs italic">
        <p>Itaguyod ang Transparyente, Mabilis at Responsableng Barangay Sawang Calero</p>
      </div>
    </div>
  </div>
</body>
</html>
