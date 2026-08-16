const PLACEHOLDER_DIR_URL = 'images/placeholders/';
const PLACEHOLDER_IMG_URLS = ['ai-cyber-security.png', 'cupping.jpg', 'touch-grass.png'];

export function placeHolderImgUrl(index: number): string {
  return `${PLACEHOLDER_DIR_URL}${PLACEHOLDER_IMG_URLS[index % PLACEHOLDER_IMG_URLS.length]}`;
}
