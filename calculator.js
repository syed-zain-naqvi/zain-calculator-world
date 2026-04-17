(function () {
  var display = document.getElementById('calcDisplay');
  var expression = document.getElementById('calcExpression');
  var btnClear = document.getElementById('btnClear');
  var btnBackspace = document.getElementById('btnBackspace');
  var btnEquals = document.getElementById('btnEquals');

  var currentInput = '0';
  var expressionStr = '';
  var justCalculated = false;

  function updateDisplay() {
    display.textContent = currentInput;
  }

  function updateExpression(str) {
    expression.textContent = str
      .replace(/\*/g, ' x ')
      .replace(/\//g, ' / ')
      .replace(/\+/g, ' + ')
      .replace(/-/g, ' - ');
  }

  function handleNumber(val) {
    if (justCalculated) {
      if (val === '.') {
        currentInput = '0.';
      } else {
        currentInput = val;
      }
      expressionStr = '';
      justCalculated = false;
    } else {
      if (val === '.') {
        var parts = currentInput.split(/[\+\-\*\/]/);
        var lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
        currentInput += '.';
      } else if (currentInput === '0') {
        currentInput = val;
      } else {
        currentInput += val;
      }
    }
    updateDisplay();
  }

  function handleOperator(op) {
    justCalculated = false;
    var last = currentInput.slice(-1);
    var operators = ['+', '-', '*', '/'];

    if (operators.includes(last)) {
      currentInput = currentInput.slice(0, -1) + op;
    } else {
      currentInput += op;
    }
    updateDisplay();
  }

  function handleEquals() {
    if (justCalculated) return;

    var expr = currentInput;
    var lastChar = expr.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      expr = expr.slice(0, -1);
    }

    try {
      var result = Function('"use strict"; return (' + expr + ')')();
      if (!isFinite(result)) {
        expressionStr = expr + ' =';
        currentInput = 'Error';
        updateDisplay();
        updateExpression(expressionStr);
        justCalculated = true;
        return;
      }
      var rounded = parseFloat(result.toFixed(10)).toString();
      expressionStr = expr + ' =';
      updateExpression(expressionStr);
      currentInput = rounded;
      updateDisplay();
      justCalculated = true;
    } catch (e) {
      currentInput = 'Error';
      updateDisplay();
      justCalculated = true;
    }
  }

  function handleClear() {
    currentInput = '0';
    expressionStr = '';
    justCalculated = false;
    updateDisplay();
    updateExpression('');
  }

  function handleBackspace() {
    if (justCalculated) {
      handleClear();
      return;
    }
    if (currentInput.length <= 1 || currentInput === 'Error') {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }

  document.querySelectorAll('.btn-number').forEach(function (btn) {
    btn.addEventListener('click', function () {
      handleNumber(this.getAttribute('data-value'));
    });
  });

  document.querySelectorAll('.btn-operator').forEach(function (btn) {
    btn.addEventListener('click', function () {
      handleOperator(this.getAttribute('data-value'));
    });
  });

  btnEquals.addEventListener('click', handleEquals);
  btnClear.addEventListener('click', handleClear);
  btnBackspace.addEventListener('click', handleBackspace);

  document.addEventListener('keydown', function (e) {
    var key = e.key;
    if (key >= '0' && key <= '9') { handleNumber(key); return; }
    if (key === '.') { handleNumber('.'); return; }
    if (key === '+') { handleOperator('+'); return; }
    if (key === '-') { handleOperator('-'); return; }
    if (key === '*') { handleOperator('*'); return; }
    if (key === '/') { e.preventDefault(); handleOperator('/'); return; }
    if (key === 'Enter' || key === '=') { handleEquals(); return; }
    if (key === 'Backspace') { handleBackspace(); return; }
    if (key === 'Escape' || key === 'c' || key === 'C') { handleClear(); return; }
  });

  updateDisplay();
})();