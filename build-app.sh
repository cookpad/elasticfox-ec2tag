#!/bin/sh
rm -rf Elasticfox.app/
cp -pr Elasticfox_app Elasticfox.app
cp -pr ec2ui/ Elasticfox.app/Contents/Resources/chrome/ec2ui
mv Elasticfox.app/Contents/Resources/ec2ui_main_window.xul Elasticfox.app/Contents/Resources/chrome/ec2ui/content/ec2ui/
cd Elasticfox.app/Contents/Resources/chrome/ec2ui
zip -qr ec2ui.jar .
mv ec2ui.jar ..
cd ..
rm -rf ec2ui/
cd ../..
mkdir Frameworks
rsync -rl /Library/Frameworks/XUL.framework Frameworks/
