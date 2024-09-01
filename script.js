        const form = document.getElementById('logo-form');
        const logoContainer = document.getElementById('logo-container');
        const loadingElement = document.getElementById('loading');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prompt = document.getElementById('prompt').value;
            const aspectRatio = document.getElementById('aspect-ratio').value;
            const style = document.getElementById('style').value;

            logoContainer.innerHTML = '';
            loadingElement.style.display = 'block';

            try {
                const logos = await generateLogos(prompt, aspectRatio, style);
                displayLogos(logos, aspectRatio);
            } catch (error) {
                logoContainer.innerHTML = 'Error generating logos. Please try again.';
            } finally {
                loadingElement.style.display = 'none';
            }
        });

        async function generateLogos(prompt, aspectRatio, style) {
            // This is a mock function. In a real application, you would make an API call to a generative AI platform.
            return new Promise((resolve) => {
                setTimeout(() => {
                    const [width, height] = getAspectRatioDimensions(aspectRatio);
                    const logos = Array(5).fill().map((_, i) => ({
                        id: i + 1,
                        url: `https://picsum.photos/${width}/${height}?random=${i}`,
                        alt: `Generated logo ${i + 1} based on prompt: ${prompt}, style: ${style}, aspect ratio: ${aspectRatio}`
                    }));
                    resolve(logos);
                }, 2000);
            });
        }

        function displayLogos(logos, aspectRatio) {
            logoContainer.innerHTML = '';
            const [width, height] = getAspectRatioDimensions(aspectRatio);
            logos.forEach(logo => {
                const logoItem = document.createElement('div');
                logoItem.className = 'logo-item';
                logoItem.innerHTML = `
                    <img src="${logo.url}" alt="${logo.alt}" width="${width}" height="${height}">
                    <button class="download-btn" onclick="downloadLogo('${logo.url}', ${logo.id})">Download PNG</button>
                `;
                logoContainer.appendChild(logoItem);
            });
        }

        function downloadLogo(url, id) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const fileName = `generated_logo_${id}.png`;
                    saveAs(blob, fileName);
                })
                .catch(error => {
                    console.error('Error downloading logo:', error);
                    alert('Error downloading logo. Please try again.');
                });
        }

        function getAspectRatioDimensions(aspectRatio) {
            const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
            const maxDimension = 300;
            let width, height;

            if (widthRatio > heightRatio) {
                width = maxDimension;
                height = Math.round((maxDimension / widthRatio) * heightRatio);
            } else {
                height = maxDimension;
                width = Math.round((maxDimension / heightRatio) * widthRatio);
            }

            return [width, height];
        }