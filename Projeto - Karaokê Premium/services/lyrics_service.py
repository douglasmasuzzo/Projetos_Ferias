import re
class LyricsService:
    def _parse_timestamp(self, lrc_timestamp):
        match = re.search(r'\[(\d+):(\d+(?:[\.\:]\d+)?)\]', lrc_timestamp)
        if match:
            minutos = int(match.group(1))
            segundos_str = match.group(2).replace(':', '.')
            return minutos * 60 + float(segundos_str)
        return None