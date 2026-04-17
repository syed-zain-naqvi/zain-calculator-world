(function () {
  var ageInput = document.getElementById('bmiAge');
  var genderInput = document.getElementById('bmiGender');
  var heightInput = document.getElementById('bmiHeight');
  var weightInput = document.getElementById('bmiWeight');
  var calcBtn = document.getElementById('calculateBmiBtn');
  var resetBtn = document.getElementById('resetBmiBtn');
  var errorEl = document.getElementById('bmiError');
  var resultBox = document.getElementById('bmiResult');
  var bmiVal = document.getElementById('bmiValue');
  var bmiCatEl = document.getElementById('bmiCategory');
  var bmiScale = document.getElementById('bmiScale');

  function loadSaved() {
    var data = localStorage.getItem('bmi_inputs');
    if (data) {
      try {
        var d = JSON.parse(data);
        if (d.age) ageInput.value = d.age;
        if (d.gender) genderInput.value = d.gender;
        if (d.height) heightInput.value = d.height;
        if (d.weight) weightInput.value = d.weight;
      } catch (e) {}
    }
  }

  function validate() {
    var age = parseFloat(ageInput.value);
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    var gender = genderInput.value;

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

    errorEl.textContent = '';
    return true;
  }

  function getBMICategory(bmi) {
    if (bmi < 18.5) return { text: 'Underweight', color: '#60a5fa' };
    if (bmi < 25) return { text: 'Normal Weight', color: '#34d399' };
    if (bmi < 30) return { text: 'Overweight', color: '#fbbf24' };
    return { text: 'Obese', color: '#f87171' };
  }

  function calculateBMI() {
    if (!validate()) return;

    var height = parseFloat(heightInput.value) / 100;
    var weight = parseFloat(weightInput.value);
    var bmi = weight / (height * height);
    var rounded = bmi.toFixed(1);
    var cat = getBMICategory(bmi);

    bmiVal.textContent = rounded;
    bmiCatEl.textContent = cat.text;
    bmiCatEl.style.color = cat.color;
    bmiVal.style.color = cat.color;

    resultBox.style.display = 'flex';
    bmiScale.style.display = 'flex';

    localStorage.setItem('bmi_inputs', JSON.stringify({
      age: ageInput.value,
      gender: genderInput.value,
      height: heightInput.value,
      weight: weightInput.value
    }));
  }

  function resetBMI() {
    ageInput.value = '';
    genderInput.value = '';
    heightInput.value = '';
    weightInput.value = '';
    errorEl.textContent = '';
    resultBox.style.display = 'none';
    bmiScale.style.display = 'none';
    localStorage.removeItem('bmi_inputs');
  }

  calcBtn.addEventListener('click', calculateBMI);
  resetBtn.addEventListener('click', resetBMI);

  [ageInput, genderInput, heightInput, weightInput].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') calculateBMI();
    });
  });

  loadSaved();
})();