import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

def get_db_connection():
    return pymysql.connect(
        host=app.config["MYSQL_HOST"],
        user=app.config["MYSQL_USER"],
        password=app.config["MYSQL_PASSWORD"],
        database=app.config["MYSQL_DB"],
        cursorclass=pymysql.cursors.Cursor
    )

@app.route("/")
def home():
    return {"message": "Expense Tracker API running"}

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "Missing fields"}), 400

        hashed_password = generate_password_hash(password)

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO Users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hashed_password)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, password FROM Users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id, name, hashed_password = user

        if check_password_hash(hashed_password, password):
            return jsonify({"message": "Login successful", "user_id": user_id, "name": name}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.get_json()
    user_id = data.get("user_id")
    amount = data.get("amount")
    category = data.get("category")
    date = data.get("date")

    if not user_id or not amount or not category or not date:
        return jsonify({"error": "Missing fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO Expenses (user_id, amount, category, date) VALUES (%s, %s, %s, %s)",
        (user_id, amount, category, date)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Expense added successfully"}), 201


@app.route("/expenses/<int:user_id>", methods=["GET"])
def get_expenses(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, amount, category, date FROM Expenses WHERE user_id = %s ORDER BY date DESC",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    expenses = []
    for row in rows:
        expenses.append({
            "id": row[0],
            "amount": float(row[1]),
            "category": row[2],
            "date": str(row[3])
        })

    return jsonify(expenses), 200


@app.route("/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM Expenses WHERE id = %s", (expense_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Expense deleted successfully"}), 200


@app.route("/expenses/monthly/<int:user_id>", methods=["GET"])
def monthly_total(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT category, SUM(amount) FROM Expenses 
           WHERE user_id = %s AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
           GROUP BY category""",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    summary = {row[0]: float(row[1]) for row in rows}
    return jsonify(summary), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)