// clear-votes.js
import { setKVData, handleApiError, methodNotAllowed } from './utils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await setKVData('votes', {});
      res.status(200).json({ message: 'Votes cleared successfully' });
    } catch (error) {
      handleApiError(res, error, 'Failed to clear votes');
    }
  } else {
    methodNotAllowed(res, ['POST']);
  }
}
