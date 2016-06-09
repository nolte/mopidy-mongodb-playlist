from __future__ import unicode_literals

import re

from setuptools import find_packages, setup


def get_version(filename):
    with open(filename) as fh:
        metadata = dict(re.findall("__([a-z]+)__ = '([^']+)'", fh.read()))
        return metadata['version']


setup(
    name='Mopidy-MongoDB-Playlist',
    version=get_version('mopidy_mongodb/__init__.py'),
    url='https://github.com//mopidy-mongodb-playlist',
    license='Apache License, Version 2.0',
    author='malte',
    author_email='',
    description='Mopidy extension for Foobar mechanics',
    long_description=open('README.rst').read(),
    packages=find_packages(exclude=['tests', 'tests.*']),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
        'setuptools',
        'Mopidy >= 1.0',
        'Pykka >= 1.1',
        'pymongo >= 3.2.2'
    ],
    entry_points={
        'mopidy.ext': [
            'mongodb = mopidy_mongodb:Extension',
        ],
    },
    classifiers=[
        'Environment :: No Input/Output (Daemon)',
        'Intended Audience :: End Users/Desktop',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 2',
        'Topic :: Multimedia :: Sound/Audio :: Players',
    ],
)
