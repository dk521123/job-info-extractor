import fitz
import pytesseract
from PIL import Image
from abc import ABC, abstractmethod


class DocumentExtractor(ABC):
    @staticmethod
    @abstractmethod
    def extract(path: str) -> list[str]:
        pass

class PDFExtractor(DocumentExtractor):
    @staticmethod
    def extract(path: str) -> list[str]:
        text_list = list[str]()
        with fitz.open(path) as doc:
            for page in doc:
                lines = page.get_text().splitlines()
                text_list.extend([line for line in lines if line.strip()])
        return text_list

class ImageExtractor(DocumentExtractor):
    @staticmethod
    def extract(path: str) -> list[str]:
        img = Image.open(path)
        text = pytesseract.image_to_string(
            img, config=r'--psm 6 -l jpn --oem 3 -c preserve_interword_spaces=1'
        )
        return [line for line in text.splitlines() if line.strip()]
