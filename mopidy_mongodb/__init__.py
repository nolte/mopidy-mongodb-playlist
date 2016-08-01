from __future__ import unicode_literals

import logging
import os

from mopidy import config, ext


__version__ = '0.1.0'

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)


class Extension(ext.Extension):

    dist_name = 'Mopidy-MongoDB-Playlist'
    ext_name = 'mongodb'
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def get_config_schema(self):
        schema = super(Extension, self).get_config_schema()
        schema['host'] = config.String()
        schema['port'] = config.Integer()
        return schema

    def setup(self, registry):
        # You will typically only implement one of the following things
        logger.debug("init the mopdiy extention")
        from .backend import MongoDBBackend
        registry.add('backend', MongoDBBackend)
        registry.add('http:static', {
            'name': self.ext_name,
            'path': os.path.join(os.path.dirname(__file__), 'public'),
        })
