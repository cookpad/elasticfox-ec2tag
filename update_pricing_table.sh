#!/bin/bash
TABLE_SRC=ec2ui/content/ec2ui/utils.js

echo '// __BEGINNING_OF_PRICING_TABLE__' > ${TABLE_SRC}.new
ruby pricing_table.rb >> ${TABLE_SRC}.new
echo '// __END_OF_PRICING_TABLE__' >> ${TABLE_SRC}.new
sed '/__BEGINNING_OF_PRICING_TABLE__/,/__END_OF_PRICING_TABLE__/d' $TABLE_SRC >> ${TABLE_SRC}.new
mv ${TABLE_SRC}.new $TABLE_SRC
