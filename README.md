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

On Windows install [Git for Windows](https://git-scm.com/download/win) as well

## Setting `path.repo` in elasticsearch

On Windows the path is:
```
C:\ProgramData\chocolatey\lib\elasticsearch\tools\elasticsearch-6.3.0\config\elasticsearch.yml
```

On Mac the path is:
```
/usr/local/etc/elasticsearch/elasticsearch.yml
```

Open this file with a text editor and add the following line to the configuration

On Windows it will take the form:
```
path.repo: ["C:\\path\\to\\data"]
```

On Mac it will take the form:
```
path.repo: ["/path/to/data"]
```

Once you update the file, restart elasticsearch

## Running Elasticsearch

On Windows open either command prompt or powershell with **admin** privileges and run
```
elasticsearch
```

On mac open Terminal and run
```
elasticsearch
```

## Loading a Snapshot

Make sure the `path.repo` environment is set first!

First open the `load_snapshots.sh` script in the scripts folder of this repo and edit the
`SNAPSHOT` variable to to the path to the snapshot folder (e.g. `/path/to/2017.07.21`).

The format of the path is similar to `path.repo` path added earlier.

Finally run the script within a bash environment (either Terminal for Mac or Git Bash for Windows). Git Bash was installed with the Git for Windows package.

Run the script using `./load_snapshots.sh`
