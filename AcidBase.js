let img;
let debugging = true;
let ranges;
let ABGexamples;
let ABG;

//let img1, img2;

function preload() {
  img = loadImage("/Acid-base_nomogram.svg.png");
  //let img1 = loadImage(
  //   "https://icuonline.co.uk/AcidBase/Acid-base_nomogram.svg.png",
  // );
  //let img2 = loadImage("/Acid-base_nomogram.svg.png");

  ranges = loadTable("ranges.csv", "csv", "header");
  ABGexamples = loadTable("/ABGexamplesTable.csv", "csv", "header");
}

function setup() {
  createCanvas(400, 400);
  debugg(ranges);

  ABG = new ABGclass();
  debugg(ABG);

  console.table(ABGexamples);
  // let rows = ABGexamples.getRows().map((row) => row.obj);
  // debugg(rows);

  document.getElementById("myForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload
    let text = document.getElementById("ABGinput").value;
    parseABG(text);
  });
}

function updateResult() {
  // Get references to the input elements by their IDs
  // Ensure that your HTML has input elements with these exact IDs (e.g., <input id="pHValue">)
  let pHValue = document.getElementById("pHValue");
  let PCO2Value = document.getElementById("PCO2Value");
  let HCO3Value = document.getElementById("HCO3Value");
  let NaValue = document.getElementById("NaValue");
  let KValue = document.getElementById("KValue");
  let ClValue = document.getElementById("ClValue");
  let CaTotValue = document.getElementById("CaTotValue");
  let MgValue = document.getElementById("MgValue");
  let AlbuminValue = document.getElementById("AlbuminValue");
  let PhosphateValue = document.getElementById("PhosphateValue");
  let LactateValue = document.getElementById("LactateValue");
  let HbValue = document.getElementById("HbValue");
  let MeasuredOsmValue = document.getElementById("MeasOsmValue");
  let UreaValue = document.getElementById("UreaValue");
  let GlucoseValue = document.getElementById("GlucoseValue");

  ABG.pH = parseFloat(document.getElementById("pHValue").value || 0);
  ABG.PCO2 = parseFloat(document.getElementById("PCO2Value").value || 0);
  ABG.HCO3 = parseFloat(document.getElementById("HCO3Value").value || 0);
  ABG.Na = parseFloat(document.getElementById("NaValue").value || 0);
  ABG.K = parseFloat(document.getElementById("KValue").value || 0);
  ABG.Cl = parseFloat(document.getElementById("ClValue").value || 0);
  ABG.CaTot = parseFloat(document.getElementById("CaTotValue").value || 0);
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

  // if (!Na) {
  //   NaEffect = NaN;
  // } else {
  //   NaEffect = 0.3 * (Na - 140);
  // }

  // if (!Cl) {
  //   ClEffect = NaN;
  // } else {
  //   ClEffect = 102 - (Cl * 140) / Na;
  // }

  // if (!NaEffect || !ClEffect) {
  //   NaClEffect = NaN;
  // } else {
  //   NaClEffect = Na - Cl - 38;
  // }

  // LactateEffect = 1.3 - Lactate;

  // let CaEffect = -0.25 * (CaTot - 2.25);
  // let MgEffect = -0.15 * (Mg - 1);
  // CO2  as bicarb =0.23 * pCO2 * 10^(pH - 6.1)
  //phosphate (B12*(0.309*B9-0.469))

  // if (CO2asBicarb == 0 || pH == 0) {
  //   sBEHb50 = NaN;
  //   sBEHbPt = NaN;
  // } else {
  //   sBEHb50 =
  //     (CO2asBicarb - 24.4 + (2.3 * (50 / 10) + 7.7) * (pH - 7.4)) *
  //     (1 - (0.023 * 50) / 10);
  //   sBEHbPt =
  //     (CO2asBicarb - 24.4 + (2.3 * (Hb / 10) + 7.7) * (pH - 7.4)) *
  //     (1 - (0.023 * Hb) / 10);
  // }

  // let DeltaGap = AnionGap - 12 - (HCO3 - 24);

  // DeltaRatio = DeltaGap / (24 - HCO3);

  // let OsmCalc = 2 * (Na + K) + Ur + Gluc;
  // if (MeasuredOsm > 100) {
  //   OsmGap = MeasuredOsm - OsmCalc;
  // } else {
  //   OsmGap = "";
  // }

  ABG.calculate();
  ABG.display();
  ABG.updateInterpretation();
  ABG.drawGamblegram();
  ABG.plotSiggardAndersson();
}

function submitForm(e) {
  e.preventDefault();
  const text = document.getElementById("ABGinput").value;
  debugg("text length: " + text.length);
  if (text.length > 20) {
    parseABG(text);
    debugg("read anyway!!!!");
  }
}

function parseABG(inputABG) {
  function extractValue(label) {
    const regex = new RegExp(`^\\s*${label}\\s+([\\d.]+)`, "m");
    const match = inputABG.match(regex);
    return match ? Number(match[1]) : null;
  }

  ABG.pH = parseFloat(extractValue("pH") || 0);
  document.getElementById("pHValue").value = pH;

  ABG.PCO2 = parseFloat(extractValue("PCO2") || 0);
  document.getElementById("PCO2Value").value = PCO2;

  ABG.HCO3 = parseFloat(extractValue("Bic") || 0);
  document.getElementById("HCO3Value").value = HCO3;

  ABG.Na = parseFloat(extractValue("Na") || 0);
  document.getElementById("NaValue").value = Na;

  ABG.K = parseFloat(extractValue("K") || 0);
  document.getElementById("KValue").value = K;

  ABG.Cl = parseFloat(extractValue("Cl-") || 0);
  document.getElementById("ClValue").value = Cl;

  ABG.lactate = parseFloat(extractValue("Lac") || 0);
  document.getElementById("LactateValue").value = Lactate;

  ABG.Hb = parseFloat(extractValue("Hb\\(tot\\)") || 0);
  document.getElementById("HbValue").value = Hb;

  ABG.Gluc = parseFloat(extractValue("Gluc") || 0);
  document.getElementById("GlucoseValue").value = Gluc;

  ABG.albumin = parseFloat(extractValue("Alb") || 0);
  document.getElementById("AlbuminValue").value = Albumin;

  ABG.PO4 = parseFloat(extractValue("PO4") || 0);
  document.getElementById("PhosphateValue").value = PO4;

  ABG.Mg = parseFloat(extractValue("Mg") || 0);
  document.getElementById("MgValue").value = Mg;

  ABG.Ur = parseFloat(extractValue("Ur") || 0);
  document.getElementById("UreaValue").value = Mg;

  ABG.MeasuredOsm = parseFloat(extractValue("Measured Osm") || 0);
  document.getElementById("MeasOsmValue").value = Mg;

  // CaTot = parseFloat(CaTotValue.value || 0);
  // let CaTotValue = document.getElementById("CaTotValue");

  // const paO2_kPa = extractValue("PaO2");
  // const baseExcess_mmolL = extractValue("BE");
  // const saO2_percent = extractValue("SaO2");
  // const ionisedCalcium_mmolL = extractValue("iCa\\+\\+");

  ABG.updateResult();
}

function saveABG() {
  debugg("Stored an ABG");
}

//returns colour for cell depending on value;
// function setBackgroundColour(parameter, value) {
//   return null;
// }

function debugg(text) {
  if (debugging) {
    console.log(text);
  }
}

function clearText() {
  //document.getElementById("ABGinput").value = "";
}

function copyInterpretation() {
  var copyText = document.getElementById("interpretationBox").innerText;
  navigator.clipboard.writeText(copyText);
  debugg("Feed copied.");
}
