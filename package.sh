#!/bin/sh
VERSION=0.3.2-2
rm -f *.xpi
cd ec2ui/
zip -qr ../elasticfox/chrome/ec2ui.jar .
cd ../elasticfox/
zip -qr ../elasticfox-ec2tag-${VERSION}.xpi .
rm -f chrome/ec2ui.jar
