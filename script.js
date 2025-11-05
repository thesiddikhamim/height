function showHeightInput() {
  const unit = document.getElementById('unit').value;
  document.getElementById('heightCmDiv').style.display = (unit === 'cm') ? 'block' : 'none';
  document.getElementById('heightFtInDiv').style.display = (unit === 'ftin') ? 'flex' : 'none';
}

// Error function
function erf(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + p * x);
  return sign * (1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)));
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
  const explainDiv = document.getElementById('explain');

  if (!heightCm || heightCm <= 0) {
    resultDiv.innerHTML = `<p style="text-align:center; color: var(--danger-color);">Please enter a valid height.</p>`;
    explainDiv.style.display = 'none';
    resultsContainer.style.display = 'block';
    return;
  }

  const mean = gender === 'male' ? 167.7 : 151.6;
  const sd = gender === 'male' ? 7.33  : 7.96;
  const source = gender === 'male' 
    ? "Source: Khan, Murad Hossain (2014). 'Anthropometric Estimation of Bangladeshis living in three different areas'" 
    : "Source: Khan, Murad Hossain (2014). 'Anthropometric Estimation of Bangladeshis living in three different areas'";

  const z = (heightCm - mean) / sd;
  const percentile = (0.5 * (1 + erf(z / Math.sqrt(2)))) * 100;


  resultDiv.innerHTML = `
    <div class="result-primary">
      <div class="percentile-value">${percentile.toFixed(1)}<span>%</span></div>
      <div class="result-text">You are taller than ~${percentile.toFixed(1)}% of adult ${gender}s in Bangladesh.</div>
    </div>`;

  explainDiv.innerHTML =
    `<div class="explain-grid">
        <div><span class="label">Your Height:</span><span class="value">${heightCm.toFixed(1)} cm</span></div>
        <div><span class="label">Mean (${gender}):</span><span class="value">${mean} cm</span></div>
        <div><span class="label">Standard Deviation:</span><span class="value">${sd} cm</span></div>
        <div><span class="label">Z-Score:</span><span class="value">${z.toFixed(2)}</span></div>
     </div>
     <p style="font-size:0.8rem; text-align:center; margin-top:15px; color: var(--text-light);">${source}</p>`;

  explainDiv.style.display = 'block';
  resultsContainer.style.display = 'block';
}
