// update-settings.js
import { setKVData, handleApiError, methodNotAllowed } from './utils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dishesPerCategory } = req.body;
      if (typeof dishesPerCategory !== 'object') {
        return res.status(400).json({ error: 'Invalid dish count settings' });
      }
      
      for (const [category, count] of Object.entries(dishesPerCategory)) {
        if (typeof count !== 'number' || count < 1 || count > 10) {
          return res.status(400).json({ error: `Invalid dish count for ${category}` });
        }
      }
      
      await setKVData('settings', { dishesPerCategory });
      res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
      handleApiError(res, error, 'Failed to update settings');
    }
  } else {
    methodNotAllowed(res, ['POST']);
  }
}
