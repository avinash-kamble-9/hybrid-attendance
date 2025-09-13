from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector, datetime, os

app = FastAPI()

# CORS (so frontend can talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection (Railway credentials via env vars)
db = mysql.connector.connect(
    host=os.getenv("MYSQLHOST", "localhost"),
    user=os.getenv("MYSQLUSER", "root"),
    password=os.getenv("MYSQLPASSWORD", ""),
    database=os.getenv("MYSQLDATABASE", "attendance_db"),
    port=int(os.getenv("MYSQLPORT", 3306))
)
cursor = db.cursor()

@app.post("/mark_attendance/")
def mark_attendance(student_id: str = Form(...), method: str = Form(...)):
    time_now = datetime.datetime.now()
    cursor.execute("INSERT INTO attendance (student_id, method, time) VALUES (%s, %s, %s)",
                   (student_id, method, time_now))
    db.commit()
    return {"status": "success", "student_id": student_id, "method": method}

@app.get("/attendance_records/")
def get_records():
    cursor.execute("SELECT student_id, method, time FROM attendance ORDER BY time DESC")
    rows = cursor.fetchall()
    return [{"student_id": r[0], "method": r[1], "time": str(r[2])} for r in rows]
