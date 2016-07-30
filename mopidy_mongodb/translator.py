from __future__ import absolute_import, print_function, unicode_literals

import json
import os
import logging
from bson import json_util
from mopidy import models
from mopidy.models import (
    ModelJSONEncoder, model_json_decoder)
from mopidy.models.serialize import ModelJSONEncoder

from . import Extension

logger = logging.getLogger(__name__)

try:
    from urllib.parse import quote_from_bytes, unquote_to_bytes
except ImportError:
    import urllib

    def quote_from_bytes(bytes, safe=b'/'):
        # Python 3 returns Unicode string
        return urllib.quote(bytes, safe).decode('utf-8')

    def unquote_to_bytes(string):
        if isinstance(string, bytes):
            return urllib.unquote(string)
        else:
            return urllib.unquote(string.encode('utf-8'))

try:
    from urllib.parse import urlsplit, urlunsplit
except ImportError:
    from urlparse import urlsplit, urlunsplit


try:
    from os import fsencode, fsdecode
except ImportError:
    import sys

    # no 'surrogateescape' in Python 2; 'replace' for backward compatibility
    def fsencode(filename, encoding=sys.getfilesystemencoding()):
        return filename.encode(encoding, 'replace')

    def fsdecode(filename, encoding=sys.getfilesystemencoding()):
        return filename.decode(encoding, 'replace')


def path_from_name(name, scheme=Extension.ext_name):
    return fsencode(scheme + ':' + name)


def path_to_uri(path, scheme=Extension.ext_name):
    """Convert file path to URI."""
    return urlunsplit((scheme, None, path, None, None))


def name_from_path(path):
    """Extract name from file path."""
    name, _ = os.path.splitext(os.path.basename(path))
    try:
        return fsdecode(name)
    except UnicodeError:
        return None


def uri_to_path(uri):
    """Convert URI to file path."""
    # TODO: decide on Unicode vs. bytes for URIs
    return unquote_to_bytes(urlsplit(uri).path)


def db_to_ref(db):
    return models.Ref.playlist(
        uri=db['uri'],
        name=db['name']
    )


def track_db_to_ref(db):
    return models.Ref.track(
        uri=db['uri'],
        name=db['name']
    )


def playlist_to_db_object(playlist):
    return json.loads(json.dumps(playlist, cls=ModelJSONEncoder))


def playlist_from_db_object(dbObj):
    dbObj['_id'] = 1
    dbObj['lastModified'] = 1
    del dbObj['_id']
    del dbObj['lastModified']

    playlistJson = json.dumps(dbObj, default=json_util.default)
    playlistMopidy = json.loads(playlistJson, object_hook=model_json_decoder)
    return playlistMopidy


def playlist_from_name(name):
    return models.Playlist(
        uri=path_from_name(name.strip()),
        name=name
    )
