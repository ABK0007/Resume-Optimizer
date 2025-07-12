pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';


// Load animation
lottie.loadAnimation({
  container: document.getElementById('animation-container'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'animations/office.json' // Replace with actual office animation JSON
});

function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function() {
      const typedArray = new Uint8Array(reader.result);
      pdfjsLib.getDocument(typedArray).promise.then(pdf => {
        let textContent = '';
        const numPages = pdf.numPages;

        // Iterate through each page
        const pagePromises = [];
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          pagePromises.push(pdf.getPage(pageNum).then(page => {
            return page.getTextContent().then(text => {
              textContent += text.items.map(item => item.str).join(' ') + '\n';
            });
          }));
        }

        Promise.all(pagePromises).then(() => {
          resolve(textContent);
        }).catch(reject);
      }).catch(reject);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Handle form submission
document.getElementById('resumeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const resumeFile = document.getElementById('resumeFile').files[0];
  const jobFile = document.getElementById('jobFile').files[0];

  if (!resumeFile || !jobFile) {
    alert('Please upload both PDF files');
    return;
  }

  Promise.all([extractTextFromPDF(resumeFile), extractTextFromPDF(jobFile)]).then(([resumeText, jobText]) => {
    // Save extracted texts to localStorage
    localStorage.setItem('resume', resumeText);
    localStorage.setItem('job', jobText);

    window.location.href = 'result.html'; // Redirect to results page
  }).catch(error => {
    alert('Failed to extract text from PDFs');
    console.error(error);
  });
});
