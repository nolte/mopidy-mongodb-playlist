****************************
Mopidy-MongoDB-Playlist
****************************

.. image:: https://img.shields.io/pypi/v/Mopidy-MongoDB-Playlist.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-MongoDB-Playlist/
    :alt: Latest PyPI version

.. image:: https://img.shields.io/pypi/dm/Mopidy-MongoDB-Playlist.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-MongoDB-Playlist/
    :alt: Number of PyPI downloads

.. image:: https://img.shields.io/travis/nolte/mopidy-mongodb-playlist/master.svg?style=flat
    :target: https://travis-ci.org/nolte/mopidy-mongodb-playlist
    :alt: Travis CI build status

.. image:: https://img.shields.io/coveralls/nolte/mopidy-mongodb-playlist/master.svg?style=flat
   :target: https://coveralls.io/r/nolte/mopidy-mongodb-playlist
   :alt: Test coverage

Mopidy extension for central playlist mechanics


Installation
============

 --

Configuration
=============

Before starting Mopidy, you must add configuration for
Mopidy-MongoDB-Playlist to your Mopidy configuration file::

    [mongodb]
    enabled = true
    host=john
    port=27017


Project resources
=================

- `Source code <https://github.com/nolte/mopidy-mongodb-playlist>`_
- `Issue tracker <https://github.com/nolte/mopidy-mongodb-playlist/issues>`_


Usage
=============

The extensions are support the `Mopidy json-rpc <http://mopidy.readthedocs.io/en/latest/api/http/#json-rpc>`_
with the `playlists-provider <http://mopidy.readthedocs.io/en/latest/api/backend/#playlists-provider>`_  
for all requests you must use the ``"uri_scheme": "mongodb"``
 

By RestAPI
===============

First you must Create an new Playlist.
Mopidy HTTP Post JSon Content, to create a new playlist::

	{
	  "method": "core.playlists.create",
	  "jsonrpc": "2.0",
	  "params": {
	    "name": "weekend",
	    "uri_scheme": "mongodb"
	  },
	  "id": 1
	}

For updates use the ``core.playlists.save`` methode. 

Changelog
=========

v1.0.0 (PLANED)
----------------------------------------

- Frontend to Managed Playlists

v0.1.0 (UNRELEASED)
----------------------------------------

- Create, Update and Delete Playlists by RestAPI   
- Initial release.
