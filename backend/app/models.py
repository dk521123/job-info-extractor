from sqlalchemy import Column, Integer, Text
from backend.app.database import Base

class OCRResult(Base):
    __tablename__ = "ocr_results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(Text)
    content = Column(Text)
