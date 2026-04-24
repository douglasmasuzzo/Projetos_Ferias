from dataclasses import dataclass

@dataclass
class LyricLine:
    timestamp: float
    text: str
    
@dataclass
class PlayerState:
    position: float

@dataclass
class SyncState:
    offset: float