class RegistroBateria:
    def __init__( self, timestamp, percent, plugged, running_time ):
        self.timestamp = timestamp
        self.percent = percent
        self.plugged = plugged
        self.running_time = running_time