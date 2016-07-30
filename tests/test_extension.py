from __future__ import unicode_literals

import unittest

from mopidy_mongodb import Extension

class ExtensionTest(unittest.TestCase):

    def test_get_default_config():
        ext = Extension()
    
        config = ext.get_default_config()

        self.assertIn('[mongodb]', config)
        self.assertIn('enabled = true', config)
        self.assertIn('host = john', config)    
        self.assertIn('port = 27017', config)            
    
    
    def test_get_config_schema():
        ext = Extension()
    
        schema = ext.get_config_schema()
    
        # Test the content of your config schema
        self.assertIn('host', schema)
        self.assertIn('port', schema)


