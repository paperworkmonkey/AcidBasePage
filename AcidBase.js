let pH;
let PCO2;
let HCO3;
let Na;
let K;
let Cl;
let CaTot;
let Mg;
let Albumin;
let Phosphate;
let Lactate;
let Hb;
let MeasuredOsm;
let Urea;
let Glucose;
let sBEHb50;
let sBEHbPt;
let debugging = false;

function setup() {
  // pHValue = document.getElementById("pHInput");
  // PCO2Value = document.getElementById("PCO2Input");
  // HCO3Value = document.getElementById("HCO3Input");
  // NaValue = document.getElementById("NaInput");
  // KValue = document.getElementById("KInput");
  // ClValue = document.getElementById("ClInput");
  // CaValue = document.getElementById("CaInput");
  // MgValue = document.getElementById("MgInput");
  // AlbuminValue = document.getElementById("AlbuminInput");
  // PhosphateValue = document.getElementById("PhosphateInput");
  // LactateValue = document.getElementById("LactateInput");
  // MeasuredOsm = document.getElementById("MeasuredOsmInput");
  // UreaValue = document.getElementById("UreaInput");
  // GlucoseValue = document.getElementById("GlucoseInput");

  noCanvas();
  updateResult();
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

  if (debugging) {
    // console.log("pHValue element:", pHValue.value);
    // console.log("PCO2Value element:", PCO2Value.value);
    // console.log("HCO3Value element:", HCO3Value.value);
    // console.log("NaValue element:", NaValue.value);
    // console.log("KValue element:", KValue.value);
    // console.log("ClValue element:", ClValue.value);
    // console.log("CaTotValue element:", CaTotValue.value);
    // console.log("MgValue element:", MgValue.value);
    // console.log("AlbuminValue element:", AlbuminValue.value);
    // console.log("PhosphateValue element:", PhosphateValue.value);
    // console.log("LactateValue element:", LactateValue.value);
    // console.log("HbValue element:", HbValue.value);
    // console.log("MeasuredOsmValue element:", MeasuredOsmValue.value);
    // console.log("UreaValue element:", UreaValue.value);
    // console.log("GlucoseValue element:", GlucoseValue.value);
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

  pH = parseFloat(pHValue.value || 0);
  PCO2 = parseFloat(PCO2Value.value || 0);
  HCO3 = parseFloat(HCO3Value.value || 0);
  Na = parseFloat(NaValue.value || 0);
  K = parseFloat(KValue.value || 0);
  Cl = parseFloat(ClValue.value || 0);
  CaTot = parseFloat(CaTotValue.value || 0);
  Mg = parseFloat(MgValue.value || 0);
  Phosphate = parseFloat(PhosphateValue.value || 0);
  Lactate = parseFloat(LactateValue.value || 0);
  albumin = parseFloat(AlbuminValue.value || 0);
  Hb = parseFloat(HbValue.value || 0);
  MeasuredOsm = parseFloat(MeasuredOsmValue.value || 0);
  Ur = parseFloat(UreaValue.value || 0);
  Gluc = parseFloat(GlucoseValue.value || 0);

  let AnionGap = Na + K - (Cl + HCO3);
  let CorrAnionGap = Na - (Cl + HCO3) + 0.25 * (albumin - 40);
  let NormalAG = 0.2 * albumin + 1.5 * Phosphate + Lactate; // in mmol/L
  let SIDa = Na + K + CaTot + Mg - Cl - Lactate - Phosphate;

  let AlbuminEffect = (0.123 * pH - 0.631) * albumin;
  let CO2asBicarb = 0.23 * PCO2 * Math.pow(10, pH - 6.1);
  let PhosphateEffect = Phosphate * (0.309 * pH - 0.469);
  let SIDe = CO2asBicarb + AlbuminEffect + PhosphateEffect;
  let SIG = SIDa - SIDe;

  let NaEffect = 0.3 * (Na - 140);
  let ClEffect = 102 - (Cl * 140) / Na;
  let NaClEffect = 0.3 * (Na - 14) + 102 - (Cl * 140) / Na;
  let LactateEffect = -1 * Lactate;
  // let CaEffect = -0.25 * (CaTot - 2.25);
  // let MgEffect = -0.15 * (Mg - 1);
  // CO2  as bicarb =0.23 * pCO2 * 10^(pH - 6.1)
  //phosphate (B12*(0.309*B9-0.469))

  sBEHb50 =
    (CO2asBicarb - 24.4 + (2.3 * (50 / 10) + 7.7) * (pH - 7.4)) *
    (1 - (0.023 * 50) / 10);
  sBEHbPt =
    (CO2asBicarb - 24.4 + (2.3 * (Hb / 10) + 7.7) * (pH - 7.4)) *
    (1 - (0.023 * Hb) / 10);

  let OsmCalc = 2 * (Na + K) + Ur + Gluc;
  let OsmGap = MeasuredOsm - OsmCalc;

  document.getElementById("AnionGapBox").innerText =
    Number(AnionGap).toFixed(1);
  document.getElementById("CorrAnionGapBox").innerText =
    Number(CorrAnionGap).toFixed(1);
  document.getElementById("SIDaBox").innerText = Number(SIDa).toFixed(1);
  document.getElementById("SIDeBox").innerText = Number(SIDe).toFixed(1);
  document.getElementById("SIGBox").innerText = Number(SIG).toFixed(1);
  document.getElementById("AlbuminEffectBox").innerText =
    Number(AlbuminEffect).toFixed(1);
  document.getElementById("NaClEffectBox").innerText =
    Number(NaClEffect).toFixed(1);
  document.getElementById("LactateEffectBox").innerText =
    Number(LactateEffect).toFixed(1);
  document.getElementById("PhosphateEffectBox").innerText =
    Number(PhosphateEffect).toFixed(1);
  document.getElementById("CO2asBicarbBox").innerText =
    Number(CO2asBicarb).toFixed(1);
  document.getElementById("sBEHb50Box").innerText = Number(sBEHb50).toFixed(1);
  document.getElementById("sBEHbPtBox").innerText = Number(sBEHbPt).toFixed(1);
  document.getElementById("OsmGapBox").innerText = Number(OsmGap).toFixed(1);

  drawGamblegram();
  updateInterpretation();
}

function drawGamblegram() {
  // Placeholder function for drawing the Gamblegram
  console.log("Drawing Gamblegram...");

  // function draw() {
  //   background(220);

  //draw Na
  //draw K
  //draw Ca
  //draw Mg

  //draw Cl
  //draw HCO3
  //draw Albumin
  //draw Lactate
  //draw Phosphate
}

function updateInterpretation() {
  //console.log("Updating Interpretation...");
  console.log(pH);
  let aemia;
  if (pH < 7.35) {
    aemia = "acidaemia";
    if (PCO2 < 4.0) {
      aemia += " with respiratory compensation";
    } else if (PCO2 > 6.0) {
      aemia += " with respiratory acidosis";
    }
  } else if (pH > 7.45) {
    aemia = "alkalaemia";
    if (sBEHbPt < -2) {
      aemia += " with metabolic compensation";
    } else if (sBEHbPt > 2) {
      aemia += " with metabolic alkalosis";
    }
  } else {
    aemia = "normal pH";
  }

  let interpretationText = `The patient has ${aemia}. `;

  document.getElementById("interpretationBox").innerText = interpretationText;
}
