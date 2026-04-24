from services.lyrics_service import LyricsService

def test_parse_timestamp_lrc() :
    svc = LyricsService()
    segundos = svc._parse_timestamp( "[01:02.50]" )
    assert segundos == 62.5