import re
import logging
from typing import Optional

import syncedlyrics

from core.models import LyricLine
from config.settings import (
    LRC_MIN_LENGTH,
    LRC_SEARCH_TERMS_TEMPLATE,
)

logger = logging.getLogger(__name__)


class LyricsService:
    def search(self, artist: str, title: str) -> Optional[str]:
        for template in LRC_SEARCH_TERMS_TEMPLATE:
            term = template.format(artist=artist, title=title)
            logger.debug("Buscando letra: '%s'", term)

            try:
                lrc = syncedlyrics.search(term)
                if self._is_valid_lrc(lrc):
                    logger.info("Letra encontrada com termo: '%s'", term)
                    return lrc
            except Exception as e:
                logger.warning("Erro ao buscar '%s': %s", term, e)
                continue

        logger.warning("Nenhuma letra sincronizada encontrada para '%s - %s'.", artist, title)
        return None

    def parse_lrc(self, lrc_content: str) -> list[LyricLine]:
        lines: list[LyricLine] = []

        for raw_line in lrc_content.split('\n'):
            timestamp = self._parse_timestamp(raw_line)
            if timestamp is None:
                continue

            text = raw_line.split(']', 1)[-1].strip()
            if not text:
                continue

            lines.append(LyricLine(timestamp=timestamp, text=text))

        lines.sort(key=lambda l: l.timestamp)
        return lines

    def extract_plain_text(self, lrc_content: str) -> str:
        if not lrc_content:
            return ""

        text = re.sub(r'\[.*?\]', '', lrc_content)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        return "\n".join(lines)

    def get_preview(self, lrc_content: str, max_lines: int = 3) -> list[str]:
        plain = self.extract_plain_text(lrc_content)
        return plain.split('\n')[:max_lines]

    def _is_valid_lrc(self, lrc: Optional[str]) -> bool:
        if not lrc:
            return False
        if len(lrc) < LRC_MIN_LENGTH:
            return False
        if '[' not in lrc:
            return False
        return True

    @staticmethod
    def _parse_timestamp(lrc_line: str) -> Optional[float]:
        match = re.search(r'\[(\d+):(\d+(?:[\.\:]\d+)?)\]', lrc_line)
        if not match:
            return None

        minutes = int(match.group(1))
        seconds_str = match.group(2).replace(':', '.')

        try:
            return minutes * 60 + float(seconds_str)
        except ValueError:
            return None
