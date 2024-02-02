#!/bin/bash

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 105662420702.dkr.ecr.us-east-2.amazonaws.com

docker build -t movehealth .

docker tag movehealth:latest 105662420702.dkr.ecr.us-east-2.amazonaws.com/movehealth:latest

docker push 105662420702.dkr.ecr.us-east-2.amazonaws.com/movehealth:latest
