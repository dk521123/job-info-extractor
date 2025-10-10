# job-info-extractor

## Directory structure 
```
job-info-extractor/
├── .github/workflows/release-please.yml ... To manage for release
├── backend
│   ├── app
│   │   ├── database.py
│   │   ├── main.py
│   │   └── models.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   └── index.html
└── docker-compose.yml
```

## How to run
1. `docker compose up --build`
2. Go to `http://localhost:8000`
3. Go to `http://localhost:3000`
