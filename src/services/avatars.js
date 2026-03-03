// Generate a list of 100 unique DiceBear pixel-art avatar URLs
// Using 'pixel-art' style with sequential seeds

const SEEDS = Array.from({ length: 100 }, (_, i) => `boss_${i + 1}`);

export function getAvatarUrl(seed) {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&backgroundColor=transparent`;
}

export const AVATAR_URLS = SEEDS.map(getAvatarUrl);

// Pre-fetch all avatar images
export async function preloadAvatars() {
  const promises = AVATAR_URLS.map(
    (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Don't block on error
        img.src = url;
      })
  );
  await Promise.all(promises);
}

export function getAvatarForQuestion(index) {
  return AVATAR_URLS[index % AVATAR_URLS.length];
}
