function calculateScore(resume, job) {
  const resumeWords = resume.toLowerCase().match(/\w+/g) || [];
  const jobWords = job.toLowerCase().match(/\w+/g) || [];
  const jobKeywords = [...new Set(jobWords.filter(w => w.length > 2))];


  let matched = 0;
  jobKeywords.forEach(word => {
    if (resumeWords.includes(word)) matched++;
  });

  return (matched / jobKeywords.length) * 100;
}

document.addEventListener('DOMContentLoaded', function () {
  const resume = localStorage.getItem('resume');
  const job = localStorage.getItem('job');

  const scoreText = document.getElementById('score-text');
  const advice = document.getElementById('advice');
  const resultImage = document.getElementById('result-image');

  if (!resume || !job) {
    scoreText.innerText = "Oops! No data found.";
    advice.innerText = "Please go back and upload your resume and job description.";
    resultImage.src = "imgs/bad.jpg"; // fallback
    return;
  }

  const score = calculateScore(resume, job);

  if (score > 80) {
    resultImage.src = "imgs/thumbs-up.jpg";
    resultImage.alt = "Excellent Match";
    scoreText.innerText = `Excellent Match! (${score.toFixed(1)}%)`;
    advice.innerText = "Your resume is highly optimized. Great job!";
  } else if (score > 50) {
    resultImage.src = "imgs/good.jpg";
    resultImage.alt = "Good Match";
    scoreText.innerText = `Good Match! (${score.toFixed(1)}%)`;
    advice.innerText = "You're on the right track. Add more role-specific keywords.";
  } else {
    resultImage.src = "imgs/bad.jpg";
    resultImage.alt = "Needs Improvement";
    scoreText.innerText = `Needs Improvement (${score.toFixed(1)}%)`;
    advice.innerText = "Try to match more keywords and improve formatting.";
  }
});
