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
let AnionGap;
let CorrAnionGap;
let SIDa;
let SIDe;
let SIG;
let Ur;
let Gluc;
let albumin;
let OsmGap;

let img;
let debugging = false;
let ranges;
//let img1, img2;

function preload() {
  img = loadImage("/Acid-base_nomogram.svg.png");
  //let img1 = loadImage(
  //   "https://icuonline.co.uk/AcidBase/Acid-base_nomogram.svg.png",
  // );
  //let img2 = loadImage("/Acid-base_nomogram.svg.png");

  ranges = loadTable("ranges.csv", "csv", "header");
}

function setup() {
  createCanvas(400, 400);
  updateResult();
  console.log(ranges);
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

  AnionGap = Na + K - (Cl + HCO3);
  CorrAnionGap = Na - (Cl + HCO3) + 0.25 * (albumin - 40);
  let NormalAG = 0.2 * albumin + 1.5 * Phosphate + Lactate; // in mmol/L
  SIDa = Na + K + CaTot + Mg - Cl - Lactate;

  AlbuminEffect = (0.123 * pH - 0.631) * albumin;
  CO2asBicarb = 0.23 * PCO2 * Math.pow(10, pH - 6.1);
  PhosphateEffect = Phosphate * (0.309 * pH - 0.469);
  SIDe = CO2asBicarb + AlbuminEffect + PhosphateEffect;
  SIG = SIDa - SIDe;

  NaEffect = 0.3 * (Na - 140);
  ClEffect = 102 - (Cl * 140) / Na;
  NaClEffect = Na - Cl - 38;
  LactateEffect = -1 * Lactate;
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

  let DeltaGap = AnionGap - 12 - (HCO3 - 24);

  let DeltaRatio = DeltaGap / (24 - HCO3);

  let OsmCalc = 2 * (Na + K) + Ur + Gluc;
  OsmGap = MeasuredOsm - OsmCalc;

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

  //avoid displaying delta values if HCO3 is normal
  if (HCO3 > 20 && HCO3 <= 28) {
    document.getElementById("DeltaGapBox").innerText = "";
    document.getElementById("DeltaRatioBox").innerText = "";
  } else {
    document.getElementById("DeltaGapBox").innerText =
      Number(DeltaGap).toFixed(1);
    document.getElementById("DeltaRatioBox").innerText =
      Number(DeltaRatio).toFixed(2);
  }

  if (AnionGap > 16) {
    let anionGapColour =
      "rgb(255," +
      map(AnionGap, 16, 40, 230, 0) +
      "," +
      map(AnionGap, 16, 40, 230, 0) +
      ")";
    document.getElementById("AnionGapBox").style.background = anionGapColour;
  } else {
    document.getElementById("AnionGapBox").style.background = "lightblue";
  }

  if (LactateEffect < -2.0) {
    let LactateEffectColour =
      "rgb(255," +
      map(LactateEffect, -2.1, -15, 230, 0) +
      "," +
      map(LactateEffect, -2.1, -15, 230, 0) +
      ")";
    document.getElementById("LactateEffectBox").style.background =
      LactateEffectColour;
  } else {
    document.getElementById("LactateEffectBox").style.background = "lightblue";
  }

  let NaClEffectColour;
  if (NaClEffect < -2.0) {
    NaClEffectColour =
      "rgb(255," +
      map(NaClEffect, -2.1, -30, 230, 0) +
      "," +
      map(NaClEffect, -2.1, -30, 230, 0) +
      ")";
  } else if (NaClEffect >= 2.0) {
    NaClEffectColour =
      "rgb(" +
      map(NaClEffect, 2.1, 30, 230, 0) +
      "," +
      map(NaClEffect, 2.1, 30, 236, 60) +
      ",255)";
  } else {
    NaClEffectColour = "lightblue";
  }
  document.getElementById("NaClEffectBox").style.background = NaClEffectColour;

  let SIDaBoxColour;
  if (SIDa < 40) {
    SIDaBoxColour =
      "rgb(255," +
      map(SIDa, 40, 10, 230, 0) +
      "," +
      map(SIDa, 40, 10, 230, 0) +
      ")";
  } else if (SIDa > 44) {
    SIDaBoxColour =
      "rgb(" +
      map(SIDa, 44, 70, 230, 0) +
      "," +
      map(SIDa, 44, 70, 236, 60) +
      ",255)";
  } else {
    SIDaBoxColour = "lightblue";
  }
  document.getElementById("SIDaBox").style.background = SIDaBoxColour;
  //console.log(SIDaBoxColour);

  drawGamblegram();
  updateInterpretation();
  plotSiggardAndersson(pH, HCO3);
}

function drawGamblegram() {
  // Placeholder function for drawing the Gamblegram
  if (debugging) {
    console.log("Drawing Gamblegram...");
  }

  // function draw() {
  // background(220);

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
  if (debugging) {
    console.log("Updating Interpretation...");
    console.log(pH);
  }

  const abgPatterns = [
    {
      pH: "low",
      CO2: "high",
      HCO3: "normal",
      meaning: "Uncompensated respiratory acidosis",
      metabolicAcidosis: true,
    },
    {
      pH: "low",
      CO2: "normal",
      HCO3: "low",
      meaning: "Uncompensated metabolic acidosis",
      metabolicAcidosis: true,
    },
    {
      pH: "low",
      CO2: "high",
      HCO3: "high",
      meaning: "Partially compensated respiratory acidosis",
    },
    {
      pH: "low",
      CO2: "low",
      HCO3: "low",
      meaning: "Partially compensated metabolic acidosis",
    },
    {
      pH: "normal",
      CO2: "high",
      HCO3: "high",
      meaning: "Fully compensated respiratory acidosis",
    },
    {
      pH: "normal",
      CO2: "low",
      HCO3: "low",
      meaning: "Fully compensated respiratory alkalosis",
    },
    {
      pH: "normal",
      CO2: "normal",
      HCO3: "normal",
      meaning: "Normal ABG",
    },
  ];

  if (debugging) {
    console.log(abgPatterns);
  }

  let pHdisturbance, PCO2disturbance, HCO3disturbance;
  let metabolicAcidosis = false;

  if (pH < 7.35) {
    pHdisturbance = "low";
  } else if (pH > 7.45) {
    pHdisturbance = "high";
  } else {
    pHdisturbance = "normal";
  }

  if (PCO2 < 4.0) {
    PCO2disturbance = "low";
  } else if (PCO2 > 6.0) {
    PCO2disturbance = "high";
  } else {
    PCO2disturbance = "normal";
  }

  if (HCO3 < 22) {
    HCO3disturbance = "low";
  } else if (HCO3 > 26) {
    HCO3disturbance = "high";
  } else {
    HCO3disturbance = "normal";
  }

  let interpretationText =
    abgPatterns.find(
      (row) =>
        row.pH === pHdisturbance &&
        row.CO2 === PCO2disturbance &&
        row.HCO3 === HCO3disturbance,
    )?.meaning || "Pattern not found — consider mixed disorder";

  interpretationText +=
    "\npH: " +
    pHdisturbance +
    ", CO2: " +
    PCO2disturbance +
    ", HCO3: " +
    HCO3disturbance;

  console.log("int txt: " + interpretationText);

  if (interpretationText.includes("metabolic acidosis")) {
    console.log("Metabolic acidosis detected. Aniong gap is " + AnionGap);
    if (AnionGap > 16) {
      console.log("well AG is high ");
      interpretationText += "\nHigh anion gap metabolic acidosis.";
      if (OsmGap >= 16) {
        interpretationText +=
          " Raised osmolar gap — consider toxic alcohol ingestion.";
      }
    } else if (AnionGap <= 16) {
      console.log("well AG is LOW!! ");
      interpretationText += "\nNormal anion gap.";
    }
  }
  console.log(interpretationText);
  document.getElementById("interpretationBox").innerText = interpretationText;
}

function plotSiggardAndersson(pH, HCO3) {
  if (debugging) {
    console.log("Plotting Siggard-Andersson nomogram...");
    console.log(img);
    console.log(canvas);
  }

  // let img;

  // if (!img1) {
  //   console.error("Image not loaded yet.");
  //   img = img2;
  // } else {
  //   img = img1;
  // }

  clear();

  // Draw border and image
  stroke(0); // Black color
  strokeWeight(2); // Border thickness
  noFill(); // Do not fill the rectangle
  rect(0, 0, width, height);
  image(img, 0, 0, width, height);

  // Plot the point based on pH and HCO3
  let plotXstart = (38 / 400) * width;
  let plotYstart = (30 / 400) * height;

  let plotWidth = ((400 - 10) / 400) * width;
  let plotHeight = ((400 - 25) / 400) * height;

  let x = map(pH, 7.0, 7.8, plotXstart, plotWidth);
  let y = map(HCO3, 0, 60, plotHeight, plotYstart);

  x = constrain(x, plotXstart, plotWidth);
  y = constrain(y, plotYstart, plotHeight);

  if (debugging) {
    console.log(`Mapped coordinates: x=${x}, y=${y}`);
  }

  noFill();
  stroke(255, 0, 0);
  ellipse(x, y, 10, 10);
}

//returns colour for cell depending on value;
function setBackgroundColour(parameter, value) {
  return null;
}
