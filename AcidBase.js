let pHValue;
let PCO2Value;
let HCO3Value;
let NaValue;
let KValue;
let ClValue;
let CaTotValue;
let MgValue;
let AlbuminValue;
let PhosphateValue;
let LactateValue;
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

  noCanvas();
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
    !LactateValue
  ) {
    console.error("One or more required input elements not found in the DOM.");
    // Optionally, you might want to return or set a default value for myResult
    return;
  }

  let pH = parseFloat(pHValue.value || 0);
  let PCO2 = parseFloat(PCO2Value.value || 0);
  let HCO3 = parseFloat(HCO3Value.value || 0);
  let Na = parseFloat(NaValue.value || 0);
  let K = parseFloat(KValue.value || 0);
  let Cl = parseFloat(ClValue.value || 0);
  let CaTot = parseFloat(CaTotValue.value || 0);
  let Mg = parseFloat(MgValue.value || 0);
  let Phosphate = parseFloat(PhosphateValue.value || 0);
  let Lactate = parseFloat(LactateValue.value || 0);
  let albumin = parseFloat(AlbuminValue.value || 0);

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

  drawGamblegram();
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
