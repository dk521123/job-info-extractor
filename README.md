# job-info-extractor

## Directory structure 
```
job-info-extractor/
├── .github/workflows/release-please.yml ... To manage for release
├── backend ... FastAPI
│   ├── app
│   ├── app
│   │   ├── main.py
│   │   └── utils
│   │       ├── db_handler.py
│   │       ├── extractor.py
│   │       └── job_parse.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend ... React + Material-UI (MUI)
│   ├── Dockerfile
│   └── index.html
├── .env ... Enviroment variables
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

## .env
### Sample
```
ENV=dev

# UI configuration
VITE_API_BASE_URL=http://localhost:8000

# Database configuration
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=demo_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

# pgAdmin configuration
PGADMIN_DEFAULT_EMAIL=demo@sample.com
PGADMIN_DEFAULT_PASSWORD=password
PGADMIN_CONFIG_SERVER_MODE="False"
PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED="False"

# wait settings (e.g., for database at backend startup)
WAIT_RETRIES=60
WAIT_SLEEP=1
```
