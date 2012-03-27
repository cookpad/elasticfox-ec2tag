#!/bin/sh
VERSION=0.3.6-1
rm -f Elasticfox_app/Contents/Resources/application.ini
git checkout Elasticfox_app/Contents/Resources/application.ini
rm -f *.xpi
cd ec2ui/
zip -qr ../elasticfox/chrome/ec2ui.jar .
cd ../elasticfox/
zip -qr ../elasticfox-ec2tag-${VERSION}.xpi .
rm -f chrome/ec2ui.jar
