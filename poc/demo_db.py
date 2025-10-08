from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql://user:password@localhost:5433/demo_db"

engine = create_engine(DATABASE_URL, echo=True)

# Connection test
try:
    with engine.connect() as conn:
        print("Success to connect from SQLAlchemy")
except Exception as e:
    print("Failed to connect:", e)

# Connect DB for SQLite
print("DATABASE_URL:", DATABASE_URL)

engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

# Define table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)

# Create table
Base.metadata.create_all(engine)

# Generate Session
Session = sessionmaker(bind=engine)
session = Session()

# Insert data
new_user = User(name="Mike", age=30)
session.add(new_user)
session.commit()

# Select
users = session.query(User).all()
for user in users:
    print(user.name, user.age)
