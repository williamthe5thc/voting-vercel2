// get-settings.js
import { getKVData, setKVData, handleApiError, methodNotAllowed } from './utils';

const DEFAULT_DISH_COUNT = 5;
const CATEGORIES = [
    'Hearty Soups & Stews',
    'Autumn Pies & Desserts',
    'Harvest Casseroles',
    'Festive Breads & Rolls',
    'Spicy Chili Varieties'
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let settings = await getKVData('settings');
      if (!settings || !settings.dishesPerCategory) {
        settings = {
          dishesPerCategory: CATEGORIES.reduce((acc, category) => {
            acc[category] = DEFAULT_DISH_COUNT;
            return acc;
          }, {})
        };
        await setKVData('settings', settings);
      }
      res.status(200).json(settings);
    } catch (error) {
      handleApiError(res, error, 'Failed to fetch settings');
    }
  } else {
    methodNotAllowed(res, ['GET']);
  }
}
