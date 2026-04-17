(function () {
  var ageInput = document.getElementById('calAge');
  var genderInput = document.getElementById('calGender');
  var heightInput = document.getElementById('calHeight');
  var weightInput = document.getElementById('calWeight');
  var activityInput = document.getElementById('calActivity');
  var calcBtn = document.getElementById('calculateCalBtn');
  var resetBtn = document.getElementById('resetCalBtn');
  var errorEl = document.getElementById('calError');
  var resultBox = document.getElementById('calResult');
  var calVal = document.getElementById('calValue');
  var calNoteEl = document.getElementById('calNote');
  var breakdown = document.getElementById('calBreakdown');
  var weightLossEl = document.getElementById('weightLoss');
  var maintainEl = document.getElementById('maintain');
  var weightGainEl = document.getElementById('weightGain');

  function validate() {
    var age = parseFloat(ageInput.value);
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    var gender = genderInput.value;
    var activity = activityInput.value;

    if (!ageInput.value || isNaN(age) || age < 1 || age > 120) {
      errorEl.textContent = 'Please enter a valid age (1-120).';
      return false;
    }
    if (!gender) {
      errorEl.textContent = 'Please select a gender.';
      return false;
    }
    if (!heightInput.value || isNaN(height) || height < 50 || height > 300) {
      errorEl.textContent = 'Please enter a valid height (50-300 cm).';
      return false;
    }
    if (!weightInput.value || isNaN(weight) || weight < 1 || weight > 500) {
      errorEl.textContent = 'Please enter a valid weight (1-500 kg).';
      return false;
    }
    if (!activity) {
      errorEl.textContent = 'Please select an activity level.';
      return false;
    }

    errorEl.textContent = '';
    return true;
  }

  function calculateCalories() {
    if (!validate()) return;

    var age = parseFloat(ageInput.value);
    var gender = genderInput.value;
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    var activity = parseFloat(activityInput.value);

    var bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    var tdee = bmr * activity;
    var rounded = Math.round(tdee);

    calVal.textContent = rounded;

    var note = '';
    if (rounded < 1500) note = 'Low calorie range - consult a professional.';
    else if (rounded < 2000) note = 'Moderate calorie range.';
    else if (rounded < 2800) note = 'Healthy active range.';
    else note = 'High activity calorie range.';

    calNoteEl.textContent = note;
    resultBox.style.display = 'flex';

    weightLossEl.textContent = Math.round(tdee - 500);
    maintainEl.textContent = rounded;
    weightGainEl.textContent = Math.round(tdee + 500);

    breakdown.style.display = 'block';
  }

  function resetCalories() {
    ageInput.value = '';
    genderInput.value = '';
    heightInput.value = '';
    weightInput.value = '';
    activityInput.value = '';
    errorEl.textContent = '';
    resultBox.style.display = 'none';
    breakdown.style.display = 'none';
  }

  calcBtn.addEventListener('click', calculateCalories);
  resetBtn.addEventListener('click', resetCalories);

  [ageInput, heightInput, weightInput].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculateCalories();
    });
  });
})();