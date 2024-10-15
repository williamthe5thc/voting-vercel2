# Edgemont 1st Ward Voting Tool

A web-based voting system for the Edgemont 1st Ward _____ Cooking Competition, allowing participants to vote for their favorite dishes across multiple categories.

## Features

- Dynamic loading of competition categories and dishes
- User-friendly voting interface
- Local storage for temporary vote persistence
- Admin panel for managing competition settings
- Results page displaying top-ranked dishes
- Responsive design with a Halloween/harvest theme

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Vercel Serverless Functions
- Database: Vercel KV (Key-Value storage)

## Project Structure

```
harvest-feast-competition/
│
├── index.html
├── admin.html
├── results.html
├── styles.css
├── script.js
├── admin.js
├── results-display.js
├── client-utils.js
├── toast.js
│
└── api/
    ├── vote.js
    ├── results.js
    ├── clear-votes.js
    ├── get-settings.js
    └── update-settings.js
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/harvest-feast-competition.git
   ```

2. Navigate to the project directory:
   ```
   cd harvest-feast-competition
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up Vercel KV:
   - Create a Vercel account if you haven't already
   - Set up a new KV database in your Vercel project
   - Configure the KV connection string in your Vercel project settings

5. Deploy to Vercel:
   ```
   vercel
   ```

## Usage

### Voting Page (index.html)
- Users can select their top 3 favorite dishes for each category
- Votes are temporarily saved in local storage
- Submitted votes are sent to the server

### Admin Panel (admin.html)
- Clear all votes
- Update the number of dishes per category
- View current competition settings

### Results Page (results.html)
- Displays the top 3 dishes for each category based on votes

## Development

To run the project locally:

1. Install the Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Run the development server:
   ```
   vercel dev
   ```

3. Open `http://localhost:3000` in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
