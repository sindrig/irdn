TAG=sindrigudmundsson/irdn:`git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD`
CONTAINER_NAME=irdn.is
SNAPSHOT_NAME=snapshot.irdn
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(dir $(mkfile_path))

build:
	docker build -t ${TAG} .

push: build
	docker push ${TAG}

dev: clean build
	echo ${current_dir}
	docker run \
		--name ${CONTAINER_NAME} \
		-p 4736:80 \
		-v ${current_dir}/irdn:/code \
		${TAG}
	# --mount source=irdn,target=/code/irdn \

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