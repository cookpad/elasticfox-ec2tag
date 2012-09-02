#!/bin/sh
rm -f Elasticfox_app/Contents/Resources/application.ini
git checkout Elasticfox_app/Contents/Resources/application.ini
rm -rf elasticfox-win *setup.exe
cp -pr Elasticfox_app/Contents/Resources elasticfox-win
cp -pr ec2ui/ elasticfox-win/chrome/ec2ui
mv elasticfox-win/ec2ui_main_window.xul elasticfox-win/chrome/ec2ui/content/ec2ui/
cd elasticfox-win/chrome/ec2ui
zip -qr ec2ui.jar .
mv ec2ui.jar ..
cd ..
rm -rf ec2ui/
cd ..
rsync -rl /usr/local/xulrunner ./
cp /usr/local/xulrunner/xulrunner-stub.exe ./elasticfox.exe
cd ../
cygstart -w elasticfox.ci
mv setup.exe Elasticfox-ec2tag-0.4.0-setup.exe
