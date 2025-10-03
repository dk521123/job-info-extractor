from fastapi import FastAPI
import os
import sqlalchemy

app = FastAPI()

# 環境変数からDB接続情報取得
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_NAME = os.getenv("POSTGRES_DB")
DB_HOST = "db"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}"
engine = sqlalchemy.create_engine(DATABASE_URL)

@app.get("/")
def read_root():
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text("SELECT 'Hello from PostgreSQL!'"))
        return {"message": result.scalar()}
