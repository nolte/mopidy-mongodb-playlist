from __future__ import absolute_import, unicode_literals

from mopidy import backend

import pykka

from . import playlists


class MongoDBBackend(pykka.ThreadingActor, backend.Backend):
    uri_schemes = ['mongodb']

    def __init__(self, config, audio):
        super(MongoDBBackend, self).__init__()
        self.playlists = playlists.MongoDBPlaylistsProvider(self, config)
