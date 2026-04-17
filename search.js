(function () {
  const calculators = [
    { name: 'BMI Calculator', url: 'bmi.html', category: 'Fitness & Health' },
    { name: 'Calorie Calculator', url: 'calorie.html', category: 'Fitness & Health' },
    { name: 'GPA Calculator', url: 'gpa.html', category: 'Academics' },
    { name: 'Simple Calculator', url: 'calculator.html', category: 'Math' }
  ];

  function initSearch() {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');

    if (!input || !dropdown) return;

    input.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      dropdown.innerHTML = '';

      if (!query) {
        dropdown.classList.remove('visible');
        return;
      }

      const matches = calculators.filter(function (calc) {
        return (
          calc.name.toLowerCase().includes(query) ||
          calc.category.toLowerCase().includes(query) ||
          calc.url.replace('.html', '').toLowerCase().includes(query)
        );
      });

      if (matches.length === 0) {
        dropdown.classList.remove('visible');
        return;
      }

      matches.forEach(function (calc) {
        const item = document.createElement('div');
        item.className = 'search-item';

        const name = document.createElement('span');
        name.textContent = calc.name;

        const tag = document.createElement('span');
        tag.className = 'search-item-tag';
        tag.textContent = calc.category;

        item.appendChild(name);
        item.appendChild(tag);

        item.addEventListener('click', function () {
          window.location.href = calc.url;
        });

        dropdown.appendChild(item);
      });

      dropdown.classList.add('visible');
    });

    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('visible');
        input.value = '';
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('visible');
        input.value = '';
        input.blur();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();