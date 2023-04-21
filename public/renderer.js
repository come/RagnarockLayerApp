console.log('renderer js')

var currentHits = 0;
var currentHitStreak = 0;
var currentMissed = 0;
var currentPerfect = 0;
var currentPerfectStreak = 0;
var bestPerfectStreak = 0;

var comboMin = 15;
var comboMaxMultiplier = 2;
var comboMax = comboMin*comboMaxMultiplier;
var comboTriggeredIncrement = 10;
var currentComboValue = 0;
var comboTriggered = 0;


var resetData = function () {
  currentHits = 0;
  currentHitStreak = 0;
  currentMissed = 0;
  currentPerfect = 0;
  currentPerfectStreak = 0;
  currentComboValue = 0;
  bestPerfectStreak = 0;
  comboTriggered = 0;
  comboMin = 15;
  comboMax = comboMin*comboMaxMultiplier;
}

var getComboMax = function() {
  return getComboMin()*comboMaxMultiplier;
}

var getComboMin = function() {
  return comboMin + comboTriggeredIncrement * comboTriggered;
}

var updateComboGauge = function(data) {
  var percent = Math.round(currentComboValue / getComboMax()*100);
  var gaugeElt =  document.getElementById("perfectGaugeValue");
  var color = "#b9edfeff";
  if (currentComboValue > getComboMin()) {
    color = "#fecb17FF";
  }

  gaugeElt.style.background = "linear-gradient(-10deg, "+color+" "+percent+"%, #FFFFFF00 "+percent+"%, #FFFFFF00 100%) left repeat";

  
  document.getElementById("nbCombosValue").innerHTML = comboTriggered;
}

var updateHitStreak = function() {
  document.getElementById("currentHitValue").innerHTML = currentHitStreak;
}

var updateHits = function() {
  document.getElementById("totalHitValue").innerHTML = currentHits;
}

var updateMissed = function() {
  document.getElementById("totalMissValue").innerHTML = currentMissed;
}

var updateCurrentPerfectStreak = function() {
  
  if (bestPerfectStreak > 0) {
    document.getElementById("currentPerfectValue").innerHTML = bestPerfectStreak;
    document.getElementById("currentPerfectLabel").innerHTML = "Perfects Streak ("+currentPerfectStreak+")";
  } else {
    document.getElementById("currentPerfectValue").innerHTML = currentPerfectStreak;
    document.getElementById("currentPerfectLabel").innerHTML = "Perfects Streak";
  }
}

var updateCurrentPerfectMedian = function() {
  var percent = Math.round(currentPerfect / (currentHits+currentMissed) * 100);
  if (isNaN(percent)) {
    percent = 0;
  }
  document.getElementById("perfectPercent").innerHTML = percent+"%";
  var rot = -90 + percent/100 * 180;
  document.getElementById("perfectGauge").style.transform = "rotate("+rot+"deg)";
}

var updateValues = function() {
  updateHitStreak();
  updateHits();
  updateMissed();
  updateCurrentPerfectStreak();
  updateCurrentPerfectMedian();
  updateComboGauge();
}

updateValues();
window.ragnarockApi.onMessage((_event, value) => {
    var message = value;
    console.log('message', message);
    var data = message.data;
    if (message.event == "HammerHit") {
      
      if (data.hand == 0) {
        var nc = "l"+ data.drum;
        var elt = document.getElementById("lefthammer");
        elt.classList.remove("l0", "l1", "l2");
        elt.classList.add(nc);
        setTimeout(function(){
          elt.classList.remove(nc);
        },100);
      }

      if (data.hand == 1) {
        var nc = "r"+ data.drum;
        var elt = document.getElementById("righthammer");
        elt.classList.remove("r1", "r2", "r3");
        elt.classList.add(nc);

        setTimeout(function(){
          elt.classList.remove(nc);
        },100);
      }
    }

    if (message.event == "BeatMiss") {
      currentHitStreak = 0;
      currentMissed ++;
      currentPerfectStreak = 0;
      currentComboValue = 0;
      updateValues();
    }

    if (message.event == "ComboTriggered") {
      comboTriggered ++;
      comboMin = getComboMin();
      comboMax = getComboMax();
      currentComboValue = 0;
      updateValues();
    }
    
    if (message.event == "StartSong") {
      resetData();
      updateValues();

    }

     if (message.event == "StartSong" || message.event == "ragnarockInitConnection") {
      resetData();
      updateValues();
      
    }

    if (message.event == "BeatHit") {
      currentHitStreak ++;
      currentHits ++;
      if (Math.abs(data.delta)*1000 < 15) {
        currentPerfect ++;
        currentPerfectStreak ++;
        if (currentPerfectStreak > bestPerfectStreak) {
          bestPerfectStreak = currentPerfectStreak;
        }
        currentComboValue += 1;
      } else {
        currentPerfectStreak = 0;
        currentComboValue += 0.5;
      }
      updateValues();
    }
})