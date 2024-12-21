import backendUrls from '../config/backend-urls';
console.log({ backendUrls });
console.log('Filtered backend URLs:', backendUrls.length);
if (backendUrls.length === 0) {
  // throw new Error('No backend URLs are configured in the environment variables.');
  
}

let currentIndex = 0;

/**
 * Selects the next backend URL using a round-robin approach.
 * @returns The selected backend URL.
 */
export function selectBackendUrl(): string {
  const url = backendUrls[currentIndex];
  currentIndex = (currentIndex + 1) % backendUrls.length;
  if (typeof url !== 'string') {
    throw new Error('Invalid backend URL configuration.');
  }
  return url;
}
