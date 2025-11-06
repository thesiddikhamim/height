function showHeightInput() {
  const unit = document.getElementById('unit').value;
  document.getElementById('heightCmDiv').style.display = (unit === 'cm') ? 'block' : 'none';
  document.getElementById('heightFtInDiv').style.display = (unit === 'ftin') ? 'flex' : 'none';
}

function calculatePercentile() {
  const gender = document.getElementById('gender').value;
  const unit = document.getElementById('unit').value;
  let heightCm;

  if (unit === 'cm') {
    heightCm = parseFloat(document.getElementById('heightCm').value);
  } else {
    const feet = parseFloat(document.getElementById('heightFeet').value);
    const inches = parseFloat(document.getElementById('heightInches').value);
    if (!isNaN(feet) && !isNaN(inches)) {
      heightCm = feet * 30.48 + inches * 2.54;
    }
  }

  const resultsContainer = document.getElementById('results-container');
  const resultDiv = document.getElementById('result');

  if (!heightCm || heightCm <= 0) {
    resultDiv.innerHTML = `<p style="text-align:center; color: var(--danger-color);">Please enter a valid height.</p>`;
    resultsContainer.style.display = 'block';
    document.body.classList.remove('results-shown');
    return;
  }

  const mean = gender === 'male' ? 167.7 : 151.6;
  const sd = gender === 'male' ? 6.1  : 5.8;
  const source = "Source: Khan, Murad Hossain (2014). 'Anthropometric Estimation of Bangladeshis'";

  const z = (heightCm - mean) / sd;
  let percentile = (0.5 * (1 + erf(z / Math.sqrt(2)))) * 100;

  if (percentile >= 99.99) {
    percentile = 99.99;
  } else if (percentile <= 0.01) {
    percentile = 0.01;
  }

  resultDiv.innerHTML = `
    <div class="result-primary">
      <div class="percentile-value">${percentile.toFixed(2)}<span>%</span></div>
      <div class="result-text">You are taller than ~${percentile.toFixed(2)}% of adult ${gender}s in Bangladesh.</div>
    </div>
    <div class="explain-grid">
        <span class="label">Your Height:</span><span class="value">${heightCm.toFixed(1)} cm</span>
        <span class="label">Mean (${gender}):</span><span class="value">${mean} cm</span>
        <span class="label">Standard Deviation:</span><span class="value">${sd} cm</span>
        <span class="label">Z-Score:</span><span class="value">${z.toFixed(2)}</span>
     </div>
     <p style="font-size:0.8rem; text-align:center; margin-top:15px; color: var(--text-light);">${source}</p>`;

  resultsContainer.style.display = 'block';
  document.body.classList.add('results-shown');
}
