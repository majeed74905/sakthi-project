import mixerImg from '../assets/images/products/mixer.jpg';
import tvImg from '../assets/images/products/tv.jpg';
import wetGrinderImg from '../assets/images/products/wet-grinder.jpg';
import waterPurifierImg from '../assets/images/products/water-purifier.jpg';
import cookerImg from '../assets/images/products/cooker.jpg';

/**
 * Helper utility to get high-quality, bundled local product images
 * for home appliances, entertainment devices, and utilities.
 */
export function getProductImage(productName = '', categoryName = '', images = []) {
  // If valid local or data URL image is provided in images array, use it
  if (images && images.length > 0 && images[0]?.imageUrl && images[0].imageUrl.startsWith('data:')) {
    return images[0].imageUrl;
  }

  const name = String(productName).toLowerCase();
  const cat = String(categoryName).toLowerCase();

  if (name.includes('tv') || name.includes('vision') || name.includes('led') || name.includes('screen') || cat.includes('entertainment')) {
    return tvImg;
  }
  if (name.includes('water') || name.includes('purifier') || name.includes('ro') || name.includes('aqua') || cat.includes('utility')) {
    return waterPurifierImg;
  }
  if (name.includes('wet grinder') || name.includes('chef')) {
    return wetGrinderImg;
  }
  if (name.includes('cooker') || name.includes('anodized') || name.includes('pot') || name.includes('pressure')) {
    return cookerImg;
  }
  if (name.includes('mixer') || name.includes('grind') || name.includes('juicer') || cat.includes('kitchen')) {
    return mixerImg;
  }

  return mixerImg;
}
