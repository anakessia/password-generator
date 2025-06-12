document.addEventListener('DOMContentLoaded', function () {
  const passwordDisplay = document.getElementById('passwordDisplay');
  const lengthSlider = document.getElementById('passwordLength');
  const lengthValue = document.getElementById('lengthValue');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const historySection = document.getElementById('historySection');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  let passwordHistory = [];

  const savedHistory = localStorage.getItem('passwordHistory');
  if (savedHistory) {
    passwordHistory = JSON.parse(savedHistory);
    updateHistoryDisplay();
  }

  lengthSlider.addEventListener('input', function () {
    lengthValue.textContent = lengthSlider.value;
  });

  generateBtn.addEventListener('click', function () {
    const length = lengthSlider.value;
    const hasUpper = uppercaseCheckbox.checked;
    const hasLower = lowercaseCheckbox.checked;
    const hasNumbers = numbersCheckbox.checked;
    const hasSymbols = symbolsCheckbox.checked;

    if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
      alert('Please select at least one character type');
      return;
    }

    const password = generatePassword(length, hasUpper, hasLower, hasNumbers, hasSymbols);
    passwordDisplay.textContent = password;

    addToHistory(password);
  });

  copyBtn.addEventListener('click', function () {
    const password = passwordDisplay.textContent;

    if (password && password !== 'Click generate to create password') {
      navigator.clipboard.writeText(password)
        .then(() => {
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
          }, 1500);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  });

  clearHistoryBtn.addEventListener('click', function () {
    passwordHistory = [];
    updateHistoryDisplay();
  });

  function generatePassword(length, hasUpper, hasLower, hasNumbers, hasSymbols) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (hasUpper) chars += uppercaseChars;
    if (hasLower) chars += lowercaseChars;
    if (hasNumbers) chars += numberChars;
    if (hasSymbols) chars += symbolChars;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    return password;
  }

  function addToHistory(password) {
    passwordHistory.unshift(password);

    if (passwordHistory.length > 10) {
      passwordHistory.pop();
    }
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));

    updateHistoryDisplay();
  }

  function updateHistoryDisplay() {
    if (passwordHistory.length === 0) {
      historySection.innerHTML = '<div class="text-gray-500 text-center py-6">No history yet</div>';
      return;
    }

    historySection.innerHTML = '';

    passwordHistory.forEach((password, index) => {
      const historyEntry = document.createElement('div');
      historyEntry.className = 'history-entry flex justify-between items-center py-3 px-2';

      const passwordText = document.createElement('div');
      passwordText.className = 'password-text text-white overflow-hidden overflow-ellipsis whitespace-nowrap';
      passwordText.textContent = password;
      passwordText.style.maxWidth = '80%';

      const copyHistoryBtn = document.createElement('button');
      copyHistoryBtn.className = 'btn-copy h-8 w-8 rounded-full flex items-center justify-center';
      copyHistoryBtn.innerHTML = '<i class="far fa-copy text-sm"></i>';
      copyHistoryBtn.title = 'Copy to clipboard';

      copyHistoryBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(password)
          .then(() => {
            copyHistoryBtn.innerHTML = '<i class="fas fa-check text-sm"></i>';
            setTimeout(() => {
              copyHistoryBtn.innerHTML = '<i class="far fa-copy text-sm"></i>';
            }, 1500);
          });
      });

      historyEntry.appendChild(passwordText);
      historyEntry.appendChild(copyHistoryBtn);
      historySection.appendChild(historyEntry);
    });
  }
});