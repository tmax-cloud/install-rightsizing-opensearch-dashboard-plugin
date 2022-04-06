# Rightsizing 설치 가이드

## Prerequisites
- TimescaleDB

## 설치

> 현재 사용중인 ingress에서는 `ExternalName` service를 못 찾는 이슈가 있어서 rightsizing api-server만을 opensearch dasboard와 같은 namespace (opensearch)에 설치한다.
> 만약 opensearch dashboard namespace가 변경되었다면 api-server 관련 설정의 namespace만 변경해주면 된다.
> 
> 관련 이슈: [ingress에서 endpoint를 못 찾는 이슈](https://stackoverflow.com/questions/67164032/k8s-externalname-endpoint-not-found-but-working), [Support for Type ExternalName Services](https://github.com/nginxinc/kubernetes-ingress/tree/main/examples/externalname-services)

- [manifest](https://github.com/tmax-cloud/install-rightsizing-opensearch-dashboard-plugin/blob/main/rightsizing/install_with_opensearch.yaml)를 통해 설치