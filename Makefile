TAG=sindrigudmundsson/irdn:`git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD`
CONTAINER_NAME=irdn.is
SNAPSHOT_NAME=snapshot.irdn

build:
	docker build -t ${TAG} .

push: build
	docker push ${TAG}

dev: clean build
	docker run \
		--name ${CONTAINER_NAME} \
		-p 4736:80 \
		--mount source=irdn,target=/code/irdn \
		${TAG}

rmsnapshot:
	docker rm -f ${SNAPSHOT_NAME} > /dev/null 2>&1 || true

clean: rmsnapshot
	docker rm -f ${CONTAINER_NAME} > /dev/null 2>&1 || true
	docker volume rm irdn > /dev/null 2>&1 || true

snapshotinspect: rmsnapshot
	docker commit `docker ps -aqf "name=${CONTAINER_NAME}"` ${SNAPSHOT_NAME}
	docker run --name ${SNAPSHOT_NAME} -t -i ${SNAPSHOT_NAME} bash

inspect:
	docker exec -ti `docker ps -aqf "name=${CONTAINER_NAME}"` bash