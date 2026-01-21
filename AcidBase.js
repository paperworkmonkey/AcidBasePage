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

  let myResult =
    parseFloat(pHValue.value || 0) + // Use parseFloat to ensure numeric addition
    parseFloat(PCO2Value.value || 0) +
    parseFloat(HCO3Value.value || 0) +
    parseFloat(NaValue.value || 0) +
    parseFloat(KValue.value || 0) +
    parseFloat(ClValue.value || 0) +
    parseFloat(CaTotValue.value || 0) +
    parseFloat(MgValue.value || 0) +
    parseFloat(AlbuminValue.value || 0) +
    parseFloat(PhosphateValue.value || 0) +
    parseFloat(LactateValue.value || 0);

  let AnionGap = NaValue.value - (ClValue.value + HCO3Value.value);
  let SID = NaValue.value + KValue.value - (ClValue.value + LactateValue.value);

  document.getElementById("result").innerText = myResult;
  document.getElementById("AnionGapBox").innerText = AnionGap;
  document.getElementById("SIDBox").innerText = SID;
}

function draw() {
  background(220);
}
