#!/bin/sh
VERSION=0.3.0
rm -f *.xpi
cd ec2ui/
zip -r ../elasticfox/chrome/ec2ui.jar .
cd ../elasticfox/
zip -r ../elasticfox-ec2tag-${VERSION}.xpi .
rm -f chrome/ec2ui.jar
