FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app

COPY . /app

CMD ["python3", "-m", "http.server", "3000"]
