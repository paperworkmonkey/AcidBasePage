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
  let SIDa = Na + K + CaTot + Mg - Cl - Lactate - Phosphate;
  let SIDe = HCO3 + 0.38 * albumin + 1.5 * Phosphate;
  let SIG = SIDa - SIDe;
  let AlbuminEffect = (0.123 * pH - 0.631) * albumin;
  let NaEffect = 0.3 * (Na - 140);
  let ClEffect = 102 - (Cl * 140) / Na;
  let NaClEffect = 0.3 * (Na - 14) + 102 - (Cl * 140) / Na;
  // let LactateEffect = -1 * Lactate;
  // let PhosphateEffect = -0.5 * Phosphate;
  // let CaEffect = -0.25 * (CaTot - 2.25);
  // let MgEffect = -0.15 * (Mg - 1);

  document.getElementById("AnionGapBox").innerText = AnionGap;
  document.getElementById("CorrAnionGapBox").innerText = CorrAnionGap;
  document.getElementById("SIDaBox").innerText = SIDa;
  document.getElementById("SIDeBox").innerText = SIDe;
  document.getElementById("SIGBox").innerText = SIG;
  document.getElementById("AlbuminEffectBox").innerText = AlbuminEffect;
  document.getElementById("NaEffectBox").innerText = NaEffect;
  document.getElementById("ClEffectBox").innerText = ClEffect;
  document.getElementById("NaClEffectBox").innerText = NaClEffect;
}

function draw() {
  background(220);
}
