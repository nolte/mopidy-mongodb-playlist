curl -X POST -H Content-Type:application/json -d '{
  "method": "core.playlists.create",
  "jsonrpc": "2.0",
  "params": {
    "name": "myTest",
    "uri_scheme": "mongodb:firstplaylist"
  },
  "id": 1
}' http://localhost:6680/mopidy/rpc
