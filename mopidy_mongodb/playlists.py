from __future__ import absolute_import, unicode_literals

import contextlib
import io
import locale
import logging
import json
import time
from mopidy.models import (
    ModelJSONEncoder, model_json_decoder)

from mopidy import backend
from pymongo import MongoClient
from mopidy.models.serialize import ModelJSONEncoder
from . import Extension, translator

logger = logging.getLogger(__name__)


def log_environment_error(message, error):
    if isinstance(error.strerror, bytes):
        strerror = error.strerror.decode(locale.getpreferredencoding())
    else:
        strerror = error.strerror
    logger.error('%s: %s', message, strerror)


@contextlib.contextmanager
def replace(path, mode='w+b', encoding=None, errors=None):
    logger.debug("dummy")


class MongoDBPlaylistsProvider(backend.PlaylistsProvider):

    def __init__(self, backend, config):
        super(MongoDBPlaylistsProvider, self).__init__(backend)
        ext_config = config[Extension.ext_name]
        client = MongoClient(ext_config['host'], ext_config['port'])
        self.db = client.mopidy

    def as_list(self):

        count = self.db.playlist.count()
        logger.info("playlist Count: %s ", count)
        result = []

        # todo implements find by group latest manage by uri

        for dbPlaylist in self.db.playlist.find():
            logger.info("dbPlaylist")
            result.append(translator.db_to_ref(dbPlaylist))

        return result

    def save(self, playlist):
        playlistDbObj = self._findPlaylistByUri(playlist.uri)
        if playlistDbObj:
            playlistToSave = translator.playlist_to_db_object(playlist)
            playlistToSave['_id'] = playlistDbObj['_id']
            millis = int(round(time.time() * 1000))
            self.db.playlist.update_one({"_id": playlistToSave['_id']}, {
                "$set": {
                    "tracks": translator.playlist_to_db_object(playlist.tracks),
                    "last_modified": millis

                }})
            logger.info("save json: " +
                        json.dumps(playlist, cls=ModelJSONEncoder))
            playlistObj = translator.playlist_from_db_object(playlistToSave)
            return playlist
        else:
            return None

    def _findPlaylistByUri(self, uri):
        playlist = self.db.playlist.find_one({'uri': uri})
        return playlist

    def lookup(self, uri):
        playlistDbObj = self._findPlaylistByUri(uri)
        if playlistDbObj:
            playlistObj = translator.playlist_from_db_object(playlistDbObj)
            return playlistObj
        else:
            return None

    def delete(self, uri):
        self.db.playlist.delete_many({"uri": uri})
        return uri

    def get_items(self, uri):
        playlistDbObj = self._findPlaylistByUri(uri)
        result = []
        for track in playlistDbObj['tracks']:
            result.append(translator.track_db_to_ref(track))

        return result

    def create(self, name):
        logger.debug("create playlist with name: " + name)
        playlist = translator.playlist_from_name(name)
        logger.info("json: " + json.dumps(playlist, cls=ModelJSONEncoder))
        playListDB = translator.playlist_to_db_object(playlist)
        playlistId = self.db.playlist.insert_one(playListDB).inserted_id
        playlistDbObj = self._findPlaylistByUri(playlist.uri)
        playlistObj = translator.playlist_from_db_object(playlistDbObj)
        logger.info("playlistId: ")
        return playlistObj
