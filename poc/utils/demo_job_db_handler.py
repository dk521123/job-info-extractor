import sqlite3
from typing import Optional, Dict


class JobDbHandler:
    def __init__(self, db_path: str = "jobs.db"):
        self.db_path = db_path
        self._initialize_database()

    def _connect(self):
        return sqlite3.connect(self.db_path)

    def _initialize_database(self):
        """ テーブルがなければ作成 """
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS jobs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company TEXT,
                    position TEXT,
                    location TEXT,
                    salary TEXT
                )
            """)
            conn.commit()

    def save_job(self, job_data: Dict[str, Optional[str]]):
        """ 構造化された求人データを保存 """
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO jobs (company, position, location, salary)
                VALUES (?, ?, ?, ?)
            """, (
                job_data.get('company'),
                job_data.get('position'),
                job_data.get('location'),
                job_data.get('salary'),
            ))
            conn.commit()

    def fetch_all_jobs(self) -> list:
        """ 保存された全データを取得（デバッグ用）"""
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jobs")
            return cursor.fetchall()
