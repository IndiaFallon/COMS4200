#!/usr/bin/env bash

#
# Loads the snapshot
# Make sure to add the path of the snapshot to 'path.repos' in the elasticsearch.yml
#

# The snapshot to load
SNAPSHOT=/Volumes/Elements/2017.07.21/

# Set the directory for the snapshots
curl -X PUT "localhost:9200/_snapshot/backup" -H "Content-Type: application/json" -d"
{
  \"type\": \"fs\",
  \"settings\": {
    \"location\": \"$SNAPSHOT\"
  }
}
" | jq .

# Load up the snapshot
curl -X POST "localhost:9200/_snapshot/backup/snapshot_1/_restore" | jq .
