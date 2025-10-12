# job-info-extractor

## Directory structure 
```
job-info-extractor/
├── .github/workflows/release-please.yml ... To manage for release
├── backend
│   ├── app
│   ├── app
│   │   ├── main.py
│   │   └── utils
│   │       ├── db_handler.py
│   │       ├── extractor.py
│   │       └── job_parse.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   └── index.html
└── docker-compose.yml
```

## For development
### Pre-condition
1. Install docker

### How to run
1. `docker compose up --build`
2. Go to `http://localhost:8000`
3. Go to `http://localhost:3000`

### Show PgAdmin for debug
1. Go to `http://localhost:18080`
