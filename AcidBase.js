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
let DeltaRatio;

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
  debugg(ranges);

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

  AlbuminEffect = (0.123 * pH - 0.631) * (42 - albumin);
  CO2asBicarb = 0.23 * PCO2 * Math.pow(10, pH - 6.1);
  PhosphateEffect = (1.1 - Phosphate) * (0.309 * pH - 0.469);
  SIDe = CO2asBicarb + AlbuminEffect + PhosphateEffect;
  SIG = SIDa - SIDe;

  if (!Na) {
    NaEffect = NaN;
  } else {
    NaEffect = 0.3 * (Na - 140);
  }

  if (!Cl) {
    ClEffect = NaN;
  } else {
    ClEffect = 102 - (Cl * 140) / Na;
  }

  if (!NaEffect || !ClEffect) {
    NaClEffect = NaN;
  } else {
    NaClEffect = Na - Cl - 38;
  }

  LactateEffect = 1.3 - Lactate;
  // let CaEffect = -0.25 * (CaTot - 2.25);
  // let MgEffect = -0.15 * (Mg - 1);
  // CO2  as bicarb =0.23 * pCO2 * 10^(pH - 6.1)
  //phosphate (B12*(0.309*B9-0.469))

  if (CO2asBicarb == 0 || pH == 0) {
    sBEHb50 = NaN;
    sBEHbPt = NaN;
  } else {
    sBEHb50 =
      (CO2asBicarb - 24.4 + (2.3 * (50 / 10) + 7.7) * (pH - 7.4)) *
      (1 - (0.023 * 50) / 10);
    sBEHbPt =
      (CO2asBicarb - 24.4 + (2.3 * (Hb / 10) + 7.7) * (pH - 7.4)) *
      (1 - (0.023 * Hb) / 10);
  }

  let DeltaGap = AnionGap - 12 - (HCO3 - 24);

  DeltaRatio = DeltaGap / (24 - HCO3);

  let OsmCalc = 2 * (Na + K) + Ur + Gluc;
  if (MeasuredOsm > 100) {
    OsmGap = MeasuredOsm - OsmCalc;
  } else {
    OsmGap = "";
  }

  document.getElementById("AnionGapBox").innerText =
    Number(AnionGap).toFixed(1);
  document.getElementById("CorrAnionGapBox").innerText =
    Number(CorrAnionGap).toFixed(1);
  document.getElementById("SIDaBox").innerText = Number(SIDa).toFixed(1);
  document.getElementById("SIDeBox").innerText = Number(SIDe).toFixed(1);
  document.getElementById("SIGBox").innerText = Number(SIG).toFixed(1);
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
  document.getElementById("AlbuminEffectBox").innerText =
    Number(AlbuminEffect).toFixed(1);

  if (MeasuredOsm < OsmCalc) {
    document.getElementById("OsmGapBox").innerText = "";
  } else {
    document.getElementById("OsmGapBox").innerText = Number(OsmGap).toFixed(1);
  }
  //avoid displaying BE if absent values
  if (!sBEHb50) {
    document.getElementById("sBEHb50Box").innerText = "";
  } else {
    document.getElementById("sBEHb50Box").innerText =
      Number(sBEHb50).toFixed(1);
  }
  if (!sBEHbPt) {
    document.getElementById("sBEHbPtBox").innerText = "";
  } else {
    document.getElementById("sBEHbPtBox").innerText =
      Number(sBEHb50).toFixed(1);
  }

  //avoid displaying NaCl
  if (!NaClEffect) {
  } else {
  }

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

  let albuminEffectColour;
  if (AlbuminEffect < -2.0) {
    albuminEffectColour =
      "rgb(255," +
      map(AlbuminEffectEffect, -2.1, -15, 230, 0) +
      "," +
      map(AlbuminEffect, -2.1, -15, 230, 0) +
      ")";
  } else if (AlbuminEffect >= 2.0) {
    albuminEffectColour =
      "rgb(" +
      map(AlbuminEffect, 2.1, 30, 230, 0) +
      "," +
      map(AlbuminEffect, 2.1, 30, 236, 60) +
      ",255)";
  } else {
    albuminEffectColour = "lightblue";
  }
  document.getElementById("AlbuminEffectBox").style.background =
    albuminEffectColour;

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
    debugg("Drawing Gamblegram...");
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
  debugg("Updating Interpretation...");
  debugg(pH);

  const abgPatterns = [
    {
      //done
      pH: "low",
      CO2: "high",
      HCO3: "normal",
      meaning: "Uncompensated respiratory acidosis",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "low",
      CO2: "normal",
      HCO3: "low",
      meaning: "Uncompensated metabolic acidosis",
      metabolicAcidosis: true,
    },

    {
      //done
      pH: "high",
      CO2: "low",
      HCO3: "normal",
      meaning: "Uncompensated respiratory alkalosis",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "high",
      CO2: "normal",
      HCO3: "high",
      meaning: "Uncompensated metabolic alkalosis",
      metabolicAcidosis: false,
    },

    {
      //done
      pH: "low",
      CO2: "high",
      HCO3: "high",
      meaning: "Partially compensated respiratory acidosis",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "low",
      CO2: "low",
      HCO3: "low",
      meaning: "Partially compensated metabolic acidosis",
      metabolicAcidosis: true,
    },

    {
      //done
      pH: "high",
      CO2: "low",
      HCO3: "low",
      meaning: "Partially compensated respiratory alkalosis",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "high",
      CO2: "high",
      HCO3: "high",
      meaning: "Partially compensated metabolic alkalosis",
      metabolicAcidosis: false,
    },

    {
      //done
      pH: "low normal",
      CO2: "high",
      HCO3: "high",
      meaning: "Compensated respiratory acidosis",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "high normal",
      CO2: "high",
      HCO3: "high",
      meaning: "Compensated metabolic alkalosis",
      metabolicAcidosis: false,
    },

    {
      //done
      pH: "low normal",
      CO2: "low",
      HCO3: "low",
      meaning: "Compensated metabolic acidosis",
      metabolicAcidosis: true,
    },
    {
      //done
      pH: "high normal",
      CO2: "low",
      HCO3: "low",
      meaning: "Compensated respiratory alkalosis",
      metabolicAcidosis: false,
    },

    {
      //done
      pH: "low",
      CO2: "high",
      HCO3: "low",
      meaning: "Mixed metabolic and respiratory acidosis",
      metabolicAcidosis: true,
    },

    {
      //done
      pH: "high",
      CO2: "low",
      HCO3: "high",
      meaning: "Mixed metabolic and respiratory alkalosis",
      metabolicAcidosis: true,
    },

    {
      //done
      pH: "low normal",
      CO2: "normal",
      HCO3: "normal",
      meaning: "Normal ABG",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "high normal",
      CO2: "normal",
      HCO3: "normal",
      meaning: "Normal ABG",
      metabolicAcidosis: false,
    },
    {
      //done
      pH: "normal",
      CO2: "normal",
      HCO3: "normal",
      meaning: "Normal ABG",
      metabolicAcidosis: false,
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
  } else if (pH < 7.4) {
    pHdisturbance = "low normal";
  } else {
    pHdisturbance = "high normal";
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
    "\n(pH " +
    pHdisturbance +
    ", PCO2 " +
    PCO2disturbance +
    ", bicarb " +
    HCO3disturbance +
    ")";

  debugg("int txt: " + interpretationText);

  if (interpretationText.includes("metabolic acidosis")) {
    debugg("Metabolic acidosis detected. Aniong gap is " + AnionGap);

    if (LactateEffect < -2) {
      interpretationText += "\nLactic acidosis.";
    }

    if (AnionGap > 16) {
      debugg("well AG is high ");
      interpretationText += "\nHAGMA";

      //Delta ratios
      if (DeltaRatio >= 2) {
        interpretationText +=
          "\nDelta Ratio > 2: Suggests a concurrent metabolic alkalosis or pre-existing high bicarbonate.";
      }
      // else if (DeltaRatio > 1 && DeltaRatio < 2) {
      //   interpretationText += "\nDelta ratio indeterminate."
      // }
      if (DeltaRatio < 1) {
        interpretationText += "\nPure NAGMA";
      }

      //osmolar gap
      if (OsmGap >= 16) {
        interpretationText +=
          " Raised osmolar gap — consider toxic alcohol ingestion.";
      }
    } else if (AnionGap <= 16) {
      debugg("well AG is LOW!! ");
      interpretationText += "\nNormal anion gap.";
    }
  }

  if (NaClEffect <= -4) {
    interpretationText += "\nHyperchaloraemic acidosis";
  }

  if (AlbuminEffect > 2) {
    interpretationText += "\nHypoalbuminaemic alkalosis";
  }

  debugg(interpretationText);
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

function clearText() {
  document.getElementById("ABGinput").value = "";
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

function parseABG(ABG) {
  function extractValue(label) {
    const regex = new RegExp(`^\\s*${label}\\s+([\\d.]+)`, "m");
    const match = ABG.match(regex);
    return match ? Number(match[1]) : null;
  }

  pH = parseFloat(extractValue("pH") || 0);
  document.getElementById("pHValue").value = pH;

  PCO2 = parseFloat(extractValue("PCO2") || 0);
  document.getElementById("PCO2Value").value = PCO2;

  HCO3 = parseFloat(extractValue("Bic") || 0);
  document.getElementById("HCO3Value").value = HCO3;

  Na = parseFloat(extractValue("Na") || 0);
  document.getElementById("NaValue").value = Na;

  K = parseFloat(extractValue("K") || 0);
  document.getElementById("KValue").value = K;

  Cl = parseFloat(extractValue("Cl-") || 0);
  document.getElementById("ClValue").value = Cl;

  Lactate = parseFloat(extractValue("Lac") || 0);
  document.getElementById("LactateValue").value = Lactate;

  Hb = parseFloat(extractValue("Hb\\(tot\\)") || 0);
  document.getElementById("HbValue").value = Hb;

  Gluc = parseFloat(extractValue("Gluc") || 0);
  document.getElementById("GlucoseValue").value = Gluc;

  Albumin = parseFloat(extractValue("Alb") || 0);
  document.getElementById("AlbuminValue").value = Albumin;

  PO4 = parseFloat(extractValue("PO4") || 0);
  document.getElementById("PhosphateValue").value = PO4;

  Mg = parseFloat(extractValue("Mg") || 0);
  document.getElementById("MgValue").value = Mg;

  // CaTot = parseFloat(CaTotValue.value || 0);
  // let CaTotValue = document.getElementById("CaTotValue");
  // let MeasuredOsmValue = document.getElementById("MeasOsmValue");
  // let UreaValue = document.getElementById("UreaValue");
  // MeasuredOsm = parseFloat(MeasuredOsmValue.value || 0);
  // Ur = parseFloat(UreaValue.value || 0);

  // const paO2_kPa = extractValue("PaO2");
  // const baseExcess_mmolL = extractValue("BE");
  // const saO2_percent = extractValue("SaO2");
  // const ionisedCalcium_mmolL = extractValue("iCa\\+\\+");
  // albumin = parseFloat(AlbuminValue.value || 0);

  updateResult();
}

function saveABG() {
  console.log("Stored an ABG!");
}

//returns colour for cell depending on value;
function setBackgroundColour(parameter, value) {
  return null;
}

function debugg(text) {
  if (debugging) {
    console.log(text);
  }
}
