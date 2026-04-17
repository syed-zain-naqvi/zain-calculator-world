(function () {
  var gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  var courseCount = 0;
  var container = document.getElementById('coursesContainer');
  var addBtn = document.getElementById('addCourseBtn');
  var calcBtn = document.getElementById('calculateGpaBtn');
  var resetBtn = document.getElementById('resetGpaBtn');
  var resultBox = document.getElementById('gpaResult');
  var gpaVal = document.getElementById('gpaValue');
  var gpaNoteEl = document.getElementById('gpaNote');

  function addCourse(data) {
    courseCount++;
    var id = 'course-' + courseCount;

    if (courseCount === 1) {
      var header = document.createElement('div');
      header.className = 'courses-header';
      header.id = 'coursesHeader';
      header.innerHTML =
        '<span>Course Name</span>' +
        '<span>Credits</span>' +
        '<span>Grade</span>' +
        '<span></span>';
      container.appendChild(header);
    }

    var row = document.createElement('div');
    row.className = 'course-row';
    row.id = id;

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Course name (optional)';
    nameInput.value = (data && data.name) ? data.name : '';

    var credInput = document.createElement('input');
    credInput.type = 'number';
    credInput.placeholder = 'Credits';
    credInput.min = '0.5';
    credInput.step = '0.5';
    credInput.value = (data && data.credits) ? data.credits : '';
    credInput.className = 'cred-input';

    var gradeSelect = document.createElement('select');
    gradeSelect.className = 'grade-select';
    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Grade';
    gradeSelect.appendChild(defaultOpt);

    Object.keys(gradePoints).forEach(function (g) {
      var opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      if (data && data.grade === g) opt.selected = true;
      gradeSelect.appendChild(opt);
    });

    var removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove-course';
    removeBtn.title = 'Remove course';
    removeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">' +
      '<polyline points="3 6 5 6 21 6"/>' +
      '<path d="M19 6l-1 14H6L5 6"/>' +
      '<path d="M10 11v6M14 11v6"/>' +
      '<path d="M9 6V4h6v2"/>' +
      '</svg>';

    removeBtn.addEventListener('click', function () {
      row.remove();
      if (container.querySelectorAll('.course-row').length === 0) {
        var h = document.getElementById('coursesHeader');
        if (h) h.remove();
      }
    });

    row.appendChild(nameInput);
    row.appendChild(credInput);
    row.appendChild(gradeSelect);
    row.appendChild(removeBtn);
    container.appendChild(row);
  }

  function getCoursesData() {
    var rows = container.querySelectorAll('.course-row');
    var courses = [];
    rows.forEach(function (row) {
      var inputs = row.querySelectorAll('input');
      var select = row.querySelector('select');
      courses.push({
        name: inputs[0].value.trim(),
        credits: inputs[1].value,
        grade: select.value
      });
    });
    return courses;
  }

  function calculateGPA() {
    var courses = getCoursesData();
    var errors = [];

    if (courses.length === 0) {
      errors.push('Please add at least one course.');
    }

    var validCourses = [];
    courses.forEach(function (c, i) {
      var cred = parseFloat(c.credits);
      if (!c.credits || isNaN(cred) || cred <= 0) {
        errors.push('Course ' + (i + 1) + ': Invalid credits.');
        return;
      }
      if (!c.grade) {
        errors.push('Course ' + (i + 1) + ': Please select a grade.');
        return;
      }
      validCourses.push({ credits: cred, grade: c.grade });
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    var totalPoints = 0;
    var totalCredits = 0;

    validCourses.forEach(function (c) {
      totalPoints += gradePoints[c.grade] * c.credits;
      totalCredits += c.credits;
    });

    var gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    var rounded = gpa.toFixed(2);

    var note = '';
    if (gpa >= 3.7) note = 'Excellent - Dean\'s List';
    else if (gpa >= 3.3) note = 'Very Good';
    else if (gpa >= 3.0) note = 'Good Standing';
    else if (gpa >= 2.0) note = 'Satisfactory';
    else note = 'Below Average - Improvement Needed';

    gpaVal.textContent = rounded;
    gpaNoteEl.textContent = note;
    resultBox.style.display = 'flex';

    localStorage.setItem('gpa_courses', JSON.stringify(getCoursesData()));
    localStorage.setItem('gpa_result', rounded);
  }

  function resetGPA() {
    container.innerHTML = '';
    courseCount = 0;
    resultBox.style.display = 'none';
    localStorage.removeItem('gpa_courses');
    localStorage.removeItem('gpa_result');
    addCourse();
  }

  function loadSaved() {
    var saved = localStorage.getItem('gpa_courses');
    if (saved) {
      try {
        var courses = JSON.parse(saved);
        if (courses.length > 0) {
          courses.forEach(function (c) { addCourse(c); });
          var savedResult = localStorage.getItem('gpa_result');
          if (savedResult) {
            gpaVal.textContent = savedResult;
            resultBox.style.display = 'flex';
          }
          return;
        }
      } catch (e) {}
    }
    addCourse();
  }

  addBtn.addEventListener('click', function () { addCourse(); });
  calcBtn.addEventListener('click', calculateGPA);
  resetBtn.addEventListener('click', resetGPA);

  loadSaved();
})();