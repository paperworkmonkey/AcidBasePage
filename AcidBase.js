let img;
let debugging = false;
let ranges;
let ABGexamples;
let ABG;
let selectedABG = null;

let pHValue;
let PCO2Value;
let HCO3Value;
let NaValue;
let KValue;
let ClValue;
let CaTotValue;
let iCaValue;
let BE;
let MgValue;
let AlbuminValue;
let PhosphateValue;
let LactateValue;
let HbValue;
let MeasuredOsmValue;
let UreaValue;
let GlucoseValue;

function preload() {
  img = loadImage("Acid-base_nomogram.svg.png");
  //ranges = loadTable("ranges.csv", "csv", "header");
  ABGexamples = loadTable("ABGexamplesTable.csv", "csv", "header");
}

function setup() {

  //if this is running in a localhost browser add a 'save as example' button
  //console.log("Location port", location.port)
  if (location.port == 5500) {
    const ExButton = document.createElement("button")
    ExButton.innerText = "Save as example";
    ExButton.id = "ExampleSaveButton";
    ExButton.onclick = saveAsExample;
    document.getElementById("button-column88").appendChild(ExButton);
  }

  createCanvas(800, 800);
  debugg(ranges);

  ABG = new ABGclass();
  debugg(ABG);
  //console.table(ABGexamples);

  document.getElementById("myForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload
    let text = document.getElementById("ABGinput").value;
    parseABG(text);
  });

  // Get references to the input elements by their IDs
  // Ensure that your HTML has input elements with these exact IDs (e.g., <input id="pHValue">)
  pHValue = document.getElementById("pHValue");
  PCO2Value = document.getElementById("PCO2Value");
  HCO3Value = document.getElementById("HCO3Value");
  NaValue = document.getElementById("NaValue");
  KValue = document.getElementById("KValue");
  ClValue = document.getElementById("ClValue");
  CaTotValue = document.getElementById("CaTotValue");
  iCaValue = document.getElementById("iCaValue");
  MgValue = document.getElementById("MgValue");
  AlbuminValue = document.getElementById("AlbuminValue");
  PhosphateValue = document.getElementById("PhosphateValue");
  LactateValue = document.getElementById("LactateValue");
  HbValue = document.getElementById("HbValue");
  MeasuredOsmValue = document.getElementById("MeasOsmValue");
  UreaValue = document.getElementById("UreaValue");
  GlucoseValue = document.getElementById("GlucoseValue");
  console.log("pHValue: ", pHValue);
}

function updateResult() {
  ABG.pH = parseFloat(document.getElementById("pHValue").value || 0);
  ABG.PCO2 = parseFloat(document.getElementById("PCO2Value").value || 0);
  ABG.HCO3 = parseFloat(document.getElementById("HCO3Value").value || 0);
  ABG.Na = parseFloat(document.getElementById("NaValue").value || 0);
  ABG.K = parseFloat(document.getElementById("KValue").value || 0);
  ABG.Cl = parseFloat(document.getElementById("ClValue").value || 0);
  ABG.CaTot = parseFloat(document.getElementById("CaTotValue").value || 0);
  ABG.iCa = parseFloat(document.getElementById("iCaValue").value || 0);
  ABG.Mg = parseFloat(document.getElementById("MgValue").value || 0);
  ABG.albumin = parseFloat(document.getElementById("AlbuminValue").value || 0);
  ABG.phosphate = parseFloat(
    document.getElementById("PhosphateValue").value || 0,
  );
  ABG.lactate = parseFloat(document.getElementById("LactateValue").value || 0);
  ABG.Hb = parseFloat(document.getElementById("HbValue").value || 0);
  ABG.MeasuredOsm = parseFloat(
    document.getElementById("MeasOsmValue").value || 0,
  );
  ABG.Ur = parseFloat(document.getElementById("UreaValue").value || 0);
  ABG.Gluc = parseFloat(document.getElementById("GlucoseValue").value || 0);

  if (debugging) {
    console.log("pHValue element:", pHValue.value);
    console.log("PCO2Value element:", PCO2Value.value);
    console.log("HCO3Value element:", HCO3Value.value);
    console.log("NaValue element:", NaValue.value);
    console.log("KValue element:", KValue.value);
    console.log("ClValue element:", ClValue.value);
    console.log("CaTotValue element:", CaTotValue.value);
    console.log("MgValue element:", MgValue.value);
    console.log("AlbuminValue element:", AlbuminValue.value);
    console.log("PhosphateValue element:", PhosphateValue.value);
    console.log("LactateValue element:", LactateValue.value);
    console.log("HbValue element:", HbValue.value);
    console.log("MeasuredOsmValue element:", MeasuredOsmValue.value);
    console.log("UreaValue element:", UreaValue.value);
    console.log("GlucoseValue element:", GlucoseValue.value);
  }

  // Check if any of the elements are null before trying to access their 'value' property
  if (
    !pHValue ||
    !PCO2Value ||
    !HCO3Value ||
    !NaValue ||
    !KValue ||
    !ClValue ||
    !iCaValue ||
    !CaTotValue ||
    !MgValue ||
    !AlbuminValue ||
    !PhosphateValue ||
    !LactateValue ||
    !HbValue ||
    !MeasuredOsmValue ||
    !UreaValue ||
    !GlucoseValue
  ) {
    console.error("One or more required input elements not found in the DOM.");
    // Optionally, you might want to return or set a default value for myResult
    return;
  }

  // let CaEffect = -0.25 * (CaTot - 2.25);
  // let MgEffect = -0.15 * (Mg - 1);
  // CO2  as bicarb =0.23 * pCO2 * 10^(pH - 6.1)
  //phosphate (B12*(0.309*B9-0.469))

  ABG.calculate();
  ABG.display();
  ABG.updateInterpretation();
  ABG.plotSiggardAndersson();
  ABG.drawGamblegram();
}

function readABG() {
  const text = document.getElementById("ABGinput").value;
  debugg("text length: " + text.length);
  if (text.length > 20) {
    parseABG(text);
    debugg("read anyway!!!!");
  }
  else {
    console.log("Not enough in input box");
  }
}

function parseABG(inputABG) {
  function extractValue(label) {
    const regex = new RegExp(`^\\s*${label}\\s+([\\d.]+)`, "m");
    const match = inputABG.match(regex);
    return match ? Number(match[1]) : null;
  }

  ABG.pH = parseFloat(extractValue("pH") || 0);
  ABG.PCO2 = parseFloat(extractValue("PCO2") || 0);
  ABG.HCO3 = parseFloat(extractValue("Bic") || 0);
  ABG.Na = parseFloat(extractValue("Na") || 0);
  ABG.K = parseFloat(extractValue("K") || 0);
  ABG.Cl = parseFloat(extractValue("Cl") || 0);
  ABG.lactate = parseFloat(extractValue("Lac") || 0);
  ABG.Hb = parseFloat(extractValue("Hb\\(tot\\)") || 0);
  ABG.Gluc = parseFloat(extractValue("Gluc") || 0);
  ABG.albumin = parseFloat(extractValue("Alb") || 0);
  ABG.phosphate = parseFloat(extractValue("PO4") || 0);
  ABG.Mg = parseFloat(extractValue("Mg") || 0);
  ABG.Ur = parseFloat(extractValue("Ur") || 0);
  ABG.MeasuredOsm = parseFloat(extractValue("Measured Osm") || 0);
  ABG.iCa = parseFloat(extractValue("iCa") || 0);
  ABG.CaTot = parseFloat(extractValue("CaTotValue.value") || 0);
  // const baseExcess_mmolL = extractValue("BE");
  // const ionisedCalcium_mmolL = extractValue("iCa\\+\\+");

  ABG.loadABGintoInputFields();
  ABG.calculate();
  ABG.display();
  ABG.updateInterpretation();
  ABG.plotSiggardAndersson();
  ABG.drawGamblegram();
}

function saveABG() {
  if (location.port = 5500) {
    //add line to ABGexamplesTable.csv

  }
  else {
    debugg("Stored an ABG");
    localStorage.setItem("abg", JSON.stringify(ABG.toJSON()));
    console.log(localStorage.getItem("abg"));
  }
}

function loadABG() {
  let raw = localStorage.getItem("abg");
  if (!raw) return null;

  let data = JSON.parse(raw);
  ABG = ABGclass.fromJSON(data);
  console.log("loaded ABG: ", ABG);
  ABG.loadABGintoInputFields();
  ABG.calculate();
  ABG.display();
  ABG.updateInterpretation();
  ABG.plotSiggardAndersson();
  ABG.drawGamblegram();
}


function resetABG() {
  console.log("resetting ABG");

  ABG.pH = 7.40;
  ABG.PCO2 = 5.00;
  ABG.HCO3 = 25;
  ABG.Na = 138;
  ABG.K = 4.0;
  ABG.Cl = 102;
  ABG.CaTot = 2.4;
  ABG.iCa = 0.9
  ABG.Mg = 1.0;
  ABG.albumin = 40;
  ABG.phosphate = 1.0;
  ABG.lactate = 1.0;
  ABG.Hb = 120;
  ABG.MeasuredOsm = 310;
  ABG.Ur = 6;
  ABG.Gluc = 6;
  //document.getElementById("ABGinput").value = "";

  ABG.loadABGintoInputFields();
  ABG.calculate();
  ABG.display();
  ABG.updateInterpretation();
  ABG.plotSiggardAndersson();
  ABG.drawGamblegram();
}

function copyInterpretation() {
  var copyText = document.getElementById("interpretationBox").innerText;
  navigator.clipboard.writeText(copyText);
  debugg("Feed copied.");
}

function listABGtable() {
  debugg("drawing ABG example table");
  const old = document.getElementById("exampleTable");
  if (old) old.remove();

  const container = document.createElement("div");
  container.id = "exampleTable";

  // ---- CSS (only once) ----
  if (!document.getElementById("abgTableStyles")) {
    const style = document.createElement("style");
    style.id = "abgTableStyles";
    style.textContent = `
      #exampleTable{
        margin: 16px;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }

      .abg-table {
        border-collapse: collapse;
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        font-size: 14px;
      }

      .abg-table th, .abg-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
        white-space: nowrap;
        text-align: left;
      }

      .abg-table thead th {
        position: sticky;
        top: 0;
        background: #111827;
        color: white;
        text-align: left;
        font-weight: 700;
      }

      .abg-table tbody th {
        background: #f3f4f6;
        font-weight: 700;
        color: #111827;
        position: sticky;
        left: 0;
        z-index: 1;
      }

      .abg-table tbody tr:nth-child(even) td {
        background: #f9fafb;
      }

      .abg-col-header {
        cursor: pointer;
      }

      .abg-col-header:hover {
        background: #4f46e5;
      }

      .abg-col-header.selected {
        background: #3730a3 !important;
      }

      .abg-selected-label {
        margin: 10px 0 14px;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }

      /* Horizontal scroll if needed */
      .abg-scroll {
        overflow-x: auto;
        border-radius: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  // ---- label ----
  const label = document.createElement("div");
  label.className = "abg-selected-label";
  label.textContent = "Selected ABG: (none)";
  container.appendChild(label);

  // ---- data ----
  const rows = ABGexamples.getRows();
  const columns = ABGexamples.columns;

  // ABG IDs become the column headers
  const abgIDs = rows.map((r) => r.getString("ABG"));

  // Parameters become the left-side labels
  const parameters = columns.filter((c) => c !== "ABG");

  // ---- build table ----
  const scrollWrap = document.createElement("div");
  scrollWrap.className = "abg-scroll";

  const htmlTable = document.createElement("table");
  htmlTable.className = "abg-table";

  // ---- THEAD ----
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  // top-left corner cell
  const corner = document.createElement("th");
  corner.textContent = "Parameter";
  headRow.appendChild(corner);

  // ABG column headers
  abgIDs.forEach((abgId, abgIndex) => {
    const th = document.createElement("th");
    th.textContent = abgId;
    th.className = "abg-col-header";

    th.addEventListener("click", () => {
      // highlight selected header
      htmlTable
        .querySelectorAll(".abg-col-header")
        .forEach((h) => h.classList.remove("selected"));
      th.classList.add("selected");

      selectedABG = abgId;
      label.textContent = `Selected ABG: ${selectedABG}`;

      // copy to textarea
      const inputBox = document.getElementById("abgInputBox");
      if (!inputBox) return;

      // Make it "one parameter per line"
      const lines = [];
      parameters.forEach((param) => {
        lines.push(`${param}: ${rows[abgIndex].getString(param)}`);
      });

      inputBox.value = lines.join("\n");
    });

    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  htmlTable.appendChild(thead);

  // ---- TBODY ----
  const tbody = document.createElement("tbody");

  parameters.forEach((param) => {
    const tr = document.createElement("tr");

    // parameter name in first column
    const th = document.createElement("th");
    th.textContent = param;
    tr.appendChild(th);

    // each ABG value across
    rows.forEach((r) => {
      const td = document.createElement("td");
      td.textContent = r.getString(param);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  htmlTable.appendChild(tbody);

  scrollWrap.appendChild(htmlTable);
  container.appendChild(scrollWrap);
  document.body.appendChild(container);
}

function debugg(text) {
  if (debugging) {
    console.log(text);
  }
}

function saveAsExample() {
  //let myAlertText = toString(ABG.pH);
  alert(`Past this into ABG:\n${ABG.pH},${ABG.PCO2},${ABG.PO2},${ABG.Na},${ABG.K},${ABG.Cl},${ABG.HCO3}, BE,${ABG.Gluc}, ${ABG.lactate}, ${ABG.SaO2}, ${ABG.Hb},${ABG.iCa},${ABG.albumin}, ${ABG.phosphate}, ${ABG.Mg}, Context`);
}