# Rightsizing opensearch dashboard plugin 설치 가이드

## 구성 요소 및 버전
- Opensearch dashboard ([Opensearch-Dashboards:v1.2.0](https://github.com/opensearch-project/OpenSearch-Dashboards/tree/1.2.0))

## Prerequisites
- [rightsizing](https://github.com/tmax-cloud/install-rightsizing-opensearch-dashboard-plugin/blob/main/rightsizing) 관련 요소들

## Build
> 여기서는 plugin 디렉토리들을 Opensearch-Dashboards 디렉토리에 옮겨서 진행한다고 가정한다.
> 
> 만약 Dockerfile 내에서 빌드를 하고 싶으면 opensearch-dashboards image를 base image로 삼아서 빌드를 진행하면 된다.

- 각 plugin 디렉토리를 ([Opensearch-Dashboards/plugins](https://github.com/opensearch-project/OpenSearch-Dashboards/tree/main/plugins))로 옮긴다.

```bash
$ ls OpenSearch-Dashboards/plugins --tree --level 1
OpenSearch-Dashboards/plugins
├── rightsizing
├── rigthsizing_pod_detail
```

- 각 plugin 디렉토리 내에서 `yarn plugin-helpers build` 또는 `--opensearch-dashboards-version ${OPENSEARCH_DASHBOARDS_VERSION}`를 통해서 빌드
- 각 plugin 디렉토리 내에서 build 폴더에 저장된 zip 파일을 [Dockerfile](https://github.com/tmax-cloud/install-rightsizing-opensearch-dashboard-plugin/blob/main/Dockerfile) 디렉토리로 옮긴다.

```bash
$ ls */build/*.zip | xargs -I '{}' mv '{}' ${Dockerfile 디렉토리}
```

- 그리고 Dockerfile을 통해서 빌드 진행
