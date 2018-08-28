# COMS4200 Project

## Requirements

- Elasticsearch
- Python 3
- jq

On Windows install through [Choco](https://chocolatey.org/docs/installation) by
running the following command:

```bash
choco install -y python3 elasticsearch jq kibana
```

On Mac install through [Homebrew](https://brew.sh/) by running the following
commands:

```bash
brew install python3 elasticsearch jq kibana
```

On Windows install Git for Windows as well

## Setting `path.repo` in elasticsearch

On Windows the path is:
```
C:\ProgramData\chocolatey\lib\elasticsearch\tools\elasticsearch-6.3.0\config\elasticsearch.yml
```

On Mac the path is:
```
/usr/local/etc/elasticsearch/elasticsearch.yml
```
