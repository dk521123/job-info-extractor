import re
from typing import Optional, Dict


class JobParser:
    def __init__(self, lines: list[str]):
        self.lines = lines
        self.result = {}

    def parse(self) -> Dict[str, Optional[str]]:
        self.result['company'] = self._extract_company()
        self.result['position'] = self._extract_position()
        self.result['location'] = self._extract_location()
        self.result['salary'] = self._extract_salary()
        return self.result

    def _extract_company(self) -> Optional[str]:
        for line in self.lines:
            if '会社名' in line:
                return self._clean_value(line)
        return None

    def _extract_position(self) -> Optional[str]:
        for line in self.lines:
            if '職種' in line:
                return self._clean_value(line)
        return None

    def _extract_location(self) -> Optional[str]:
        for line in self.lines:
            if '勤務地' in line:
                return self._clean_value(line)
        return None

    def _extract_salary(self) -> Optional[str]:
        for line in self.lines:
            if '給与' in line:
                salary = self._clean_value(line)
                # 文字認識ミス補正：て → 〜（波ダッシュ）
                salary = re.sub(r"て", "〜", salary)
                return salary
        return None

    def _clean_value(self, line: str) -> str:
        parts = re.split(r'[:：]', line, maxsplit=1)
        return parts[1].strip() if len(parts) > 1 else line.strip()
