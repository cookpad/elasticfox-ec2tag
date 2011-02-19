#!/bin/sh
rm -f elasticfox.xpi
cd ec2ui/
zip -r ../elasticfox/chrome/ec2ui.jar .
cd ../elasticfox/
zip -r ../elasticfox.xpi .
rm -f elasticfox/chrome/ec2ui.jar
