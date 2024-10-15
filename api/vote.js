// vote.js
import { getKVData, setKVData, handleApiError, methodNotAllowed } from './utils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Received vote:', JSON.stringify(req.body));

      let votes = await getKVData('votes') || {};
      console.log('Current votes:', JSON.stringify(votes));

      const newVote = req.body;
      
      Object.entries(newVote).forEach(([category, rankedDishes]) => {
        if (!votes[category]) {
          votes[category] = {};
        }
        rankedDishes.forEach(({dish, rank}) => {
          if (!votes[category][dish]) {
            votes[category][dish] = {1: 0, 2: 0, 3: 0};
          }
          votes[category][dish][rank]++;
        });
      });
      
      console.log('Updated votes:', JSON.stringify(votes));

      await setKVData('votes', votes);
      console.log('Votes saved to KV store');

      res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
      handleApiError(res, error, 'Failed to save vote');
    }
  } else {
    methodNotAllowed(res, ['POST']);
  }
}
