#!/bin/sh
rm -rf elasticfox-win *setup.exe
cp -pr Elasticfox_app/Contents/Resources elasticfox-win
cp -pr ec2ui/ elasticfox-win/chrome/ec2ui
mv elasticfox-win/ec2ui_main_window.xul elasticfox-win/chrome/ec2ui/content/ec2ui/
cd elasticfox-win/chrome/ec2ui
zip -r ec2ui.jar .
mv ec2ui.jar ..
cd ..
rm -rf ec2ui/
cd ..
rsync -rl "/cygdrive/c/Program Files/xulrunner" ./
cd ../
cygstart -w elasticfox.ci
mv setup.exe Elasticfox-ec2tag-0.2.4-setup.exe
