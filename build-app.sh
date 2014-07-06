#!/bin/sh
rm -f Elasticfox_app/Contents/Resources/application.ini
git checkout Elasticfox_app/Contents/Resources/application.ini
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
mkdir MacOS
cp -p /Library/Frameworks/XUL.framework/Versions/Current/xulrunner MacOS/
cd ../..
rm *.dmg
hdiutil create -ov -srcfolder ./Elasticfox.app -fs HFS+ -format UDZO -imagekey zlib-level=6 -volname "Elasticfox-e2tag" Elasticfox-ec2tag_app-0.4.13.dmg
