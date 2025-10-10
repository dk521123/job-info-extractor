from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, DeclarativeBase


# Define table
class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)

DATABASE_URL = "postgresql://user:password@localhost:5432/demo_db"
engine = create_engine(DATABASE_URL, echo=True)
print("DATABASE_URL:", DATABASE_URL)
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

filter_by_user = session.query(User).filter_by(name="Mike").first()

session.close()
