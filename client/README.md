# 💰 Smart Expense & Budget Tracker

A full-stack web app to track daily expenses, categorize spending, and visualize monthly budgets with interactive charts.

## Live Demo

- Frontend: [link after deployment]
- Backend API: [link after deployment]

## Features

- User authentication (signup/login) with hashed passwords
- Add, view, and delete expenses
- Filter expenses by category and date range
- Monthly spending breakdown visualized as a pie chart
- Responsive, styled UI

## Tech Stack

**Frontend:** React.js, Chart.js, Axios
**Backend:** Python, Flask, Flask-CORS
**Database:** MySQL
**Security:** Password hashing with Werkzeug

## Project Structure

## API Endpoints

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| POST   | `/signup`                     | Register a new user          |
| POST   | `/login`                      | Authenticate user            |
| POST   | `/expenses`                   | Add an expense               |
| GET    | `/expenses/<user_id>`         | Get all expenses for a user  |
| DELETE | `/expenses/<id>`              | Delete an expense            |
| GET    | `/expenses/monthly/<user_id>` | Get monthly spending summary |

## Setup Instructions

### Backend

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env with your MySQL credentials (see .env.example)
python app.py
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Future Improvements

- JWT-based session persistence
- Edit expense functionality
- Bar chart for spending trends over months
- Export expenses as CSV/PDF

## Author

Arpitha V Itagi
