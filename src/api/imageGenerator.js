// DeepAI Image Generation API
// Converted from Python to JavaScript

/**
 * Generate an image using DeepAI's text2img API
 * @param {string} prompt - The text prompt for image generation
 * @returns {Promise<string|null>} - The image URL or null if generation failed
 */
export async function generateImage(prompt) {
  const apiKey = import.meta.env.VITE_DEEP_API_KEY;
  
  if (!apiKey) {
    console.error('DeepAI API key not found. Please set VITE_DEEP_API_KEY in your .env file');
    throw new Error('API key not configured');
  }

  const url = 'https://api.deepai.org/api/text2img';
  const headers = {
    'Api-Key': apiKey,
  };
  const data = {
    text: prompt,
  };

  try {
    // Convert data to FormData format (DeepAI expects form data)
    const formData = new FormData();
    formData.append('text', prompt);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      const imageUrl = result.output_url;
      console.log(`Image generated: ${imageUrl}`);
      return imageUrl;
    } else {
      const errorText = await response.text();
      console.error(`Error generating image: ${errorText}`);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
}

/**
 * Save/download an image from a URL
 * @param {string} imageUrl - The URL of the image to save
 * @param {string} fileName - The filename to save as
 * @returns {Promise<string|null>} - The saved file path or null if failed
 */
export async function saveImage(imageUrl, fileName = 'generated_image.jpg') {
  if (!imageUrl) {
    console.error('No image URL found to save.');
    return null;
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log(`Image saved as ${fileName}`);
    return fileName;
  } catch (error) {
    console.error(`Error saving image: ${error.message}`);
    return null;
  }
}

