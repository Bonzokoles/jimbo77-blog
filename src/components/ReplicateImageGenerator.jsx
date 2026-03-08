/**
 * ReplicateImageGenerator Component (React)
 * Komponent do generowania grafik dla postów jimbo77-blog za pomocą Replicate API
 *
 * Użycie:
 * import ReplicateImageGenerator from '@/components/ReplicateImageGenerator';
 *
 * <ReplicateImageGenerator
 *   prompt="A futuristic cyberpunk cityscape"
 *   postId="my-blog-post"
 *   model="flux-schnell"
 * />
 */

import { useState, useEffect } from 'react';

const GATEWAY_URL = import.meta.env.VITE_REPLICATE_GATEWAY_URL ||
                   'https://zen-replicate-gateway.stolarnia-ams.workers.dev';

const MODELS = {
  'flux-schnell': 'FLUX Schnell (najszybszy, darmowy)',
  'sdxl': 'Stable Diffusion XL (wysoka jakość)',
  'playground-v2.5': 'Playground v2.5 (estetyczny)'
};

export default function ReplicateImageGenerator({
  prompt,
  postId,
  model = 'flux-schnell',
  width = 1024,
  height = 768,
  alt = 'AI Generated Image',
  className = ''
}) {
  const [status, setStatus] = useState('idle');
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [predictionId, setPredictionId] = useState(null);
  const [progress, setProgress] = useState('');

  useEffect(() => {
    if (prompt) {
      generateImage();
    }
  }, [prompt]);

  const generateImage = async () => {
    try {
      setStatus('generating');
      setError(null);
      setProgress('Wysyłanie zapytania do Replicate...');

      // Krok 1: Rozpocznij generowanie
      const generateResponse = await fetch(`${GATEWAY_URL}/replicate/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model,
          width,
          height,
          num_outputs: 1,
          post_id: postId,
        })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const { id } = await generateResponse.json();
      setPredictionId(id);
      setProgress(`Generowanie... (ID: ${id.substring(0, 8)})`);

      // Krok 2: Polling
      await pollForCompletion(id);

    } catch (err) {
      console.error('[Replicate] Error:', err);
      setStatus('error');
      setError(err.message);
    }
  };

  const pollForCompletion = async (id) => {
    const maxAttempts = 60; // 2 minuty

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`${GATEWAY_URL}/replicate/status/${id}`);

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const prediction = await response.json();
        setProgress(`${prediction.status} (${attempt + 1}/${maxAttempts})`);

        if (prediction.status === 'succeeded') {
          setImageUrl(prediction.output?.[0]);
          setStatus('success');
          return;
        }

        if (prediction.status === 'failed' || prediction.status === 'canceled') {
          throw new Error(prediction.error || 'Generation failed');
        }

        // Czekaj 2 sekundy
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error(`Polling attempt ${attempt + 1} failed:`, err);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    throw new Error('Timeout - generowanie trwa zbyt długo (>2 min)');
  };

  const retryGeneration = () => {
    setStatus('idle');
    setError(null);
    setImageUrl(null);
    setPredictionId(null);
    setProgress('');
    generateImage();
  };

  if (status === 'error') {
    return (
      <div className={`replicate-image-error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-red-800 font-semibold text-lg">Błąd generowania obrazu</h3>
          </div>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={retryGeneration}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            🔄 Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div className={`replicate-image-loading ${className}`}>
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-8 text-white min-h-[400px] flex flex-col items-center justify-center">
          {/* Animated spinner */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>

          <h3 className="text-xl font-semibold mb-2">🎨 Generowanie obrazu AI...</h3>
          <p className="text-white/80 text-sm mb-4">{progress}</p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <p className="text-xs text-white/70 mb-2">Prompt:</p>
            <p className="text-sm font-mono">{prompt}</p>
            <p className="text-xs text-white/50 mt-2">Model: {MODELS[model]}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success' && imageUrl) {
    return (
      <div className={`replicate-image-success ${className}`}>
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-auto"
            style={{ maxWidth: `${width}px` }}
            loading="lazy"
          />
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>✨ Wygenerowano przez Replicate</span>
              <span className="font-mono">{model}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Predefiniowane prompty dla różnych tematów
export const PROMPT_TEMPLATES = {
  tech: (topic) => `A modern, minimalist illustration of ${topic}, clean lines, vibrant colors, professional tech blog aesthetic, high quality`,

  ai: (topic) => `An abstract visualization of artificial intelligence and ${topic}, neural networks, glowing nodes, futuristic cyberpunk style, neon colors`,

  tutorial: (topic) => `A step-by-step diagram showing ${topic}, clear labels, educational infographic style, bright colors, easy to understand`,

  news: (topic) => `A dramatic news-style image representing ${topic}, professional journalism aesthetic, dynamic composition, photorealistic`,

  cyberpunk: (topic) => `A cyberpunk-themed illustration of ${topic}, neon lights, dark atmosphere, high contrast, blade runner style, rainy night`,

  minimal: (topic) => `A minimalist geometric representation of ${topic}, simple shapes, limited color palette, modern design, clean and professional`,

  cloud: (topic) => `A cloud computing visualization of ${topic}, floating servers, data streams, modern tech aesthetic, blue and white colors`,

  devops: (topic) => `A DevOps pipeline illustration showing ${topic}, CI/CD workflow, modern tech diagram, professional style`
};
