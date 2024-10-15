// results.js
import { getKVData, handleApiError, methodNotAllowed } from './utils';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const votes = await getKVData('votes');
      console.log('Retrieved votes:', JSON.stringify(votes));

      if (!votes) {
        console.log('No votes found in KV store');
        res.status(200).json({ message: 'No votes recorded yet' });
        return;
      }

      const results = calculateResults(votes);
      console.log('Calculated results:', JSON.stringify(results));

      res.status(200).json(results);
    } catch (error) {
      handleApiError(res, error, 'Failed to fetch results');
    }
  } else {
    methodNotAllowed(res, ['GET']);
  }
}

function calculateResults(votes) {
  const results = {};
  Object.entries(votes).forEach(([category, dishes]) => {
    results[category] = Object.entries(dishes)
      .map(([dish, ranks]) => ({
        dish,
        score: ranks[1] * 3 + ranks[2] * 2 + ranks[3] * 1
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  });
  return results;
}
