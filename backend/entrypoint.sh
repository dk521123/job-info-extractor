#!/bin/sh
set -e

: "${DB_HOST:=db}"
: "${DB_PORT:=5432}"
: "${POSTGRES_USER:=postgres}"
: "${WAIT_RETRIES:=60}"
: "${WAIT_SLEEP:=1}"

i=0
echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT}..."
while [ $i -lt "$WAIT_RETRIES" ]; do
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1; then
    echo "Postgres is ready"
    break
  fi
  i=$((i+1))
  echo "Postgres unavailable - sleeping ${WAIT_SLEEP}s ($i/$WAIT_RETRIES)"
  sleep "$WAIT_SLEEP"
done

if [ $i -ge "$WAIT_RETRIES" ]; then
  echo "Timed out waiting for Postgres" >&2
  exit 1
fi

exec uvicorn app.main:app --host 0.0.0.0 --port 8000
