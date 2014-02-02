#!/usr/bin/env ruby
require 'net/http'
require 'json'

# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/linux-od.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/linux-od.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/linux-ri-light.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/linux-ri-medium.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/linux-ri-heavy.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/mswin-od.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/mswin-ri-light.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/mswin-ri-medium.js
# http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2/mswin-ri-heavy.js

BASE_URL = 'http://aws-assets-pricing-prod.s3.amazonaws.com/pricing/ec2'

def pricing_table(os, type)
  type = type.to_s.gsub('_', '-')
  url = "#{BASE_URL}/#{os}-#{type}.js"
  url = URI.parse(url)
  body = Net::HTTP.start(url.host, url.port) {|http| http.get(url.path).body }
  JSON.parse(body.gsub(/\A\s*callback\s*\((.*)\)\s*;?\s*\Z/m) { $1 })
end

require 'pp'

def ondemand_sheets(os)
  buf = {}

  pricing_table(os, :od)['config']['regions'].each do |region_h|
    region = region_h['region']
    instance_types = region_h['instanceTypes']

    instance_types.each do |instance_type_h|
      instance_type_h['sizes'].each do |size_h|
        size = size_h['size']
        buf[region] ||= {}
        buf[region][size] = size_h['valueColumns'].first['prices']['USD'].to_f
      end
    end
  end

  return buf
end

def ondemand_sheets_js(varname, os)
  buf = ondemand_sheets(os)
  "var #{varname} = " + JSON.pretty_generate(buf).strip + ';'
end

def ri_sheets(os, weight)
  buf = {}

  pricing_table(:linux, "ri_#{weight}")['config']['regions'].each do |region_h|
    region = region_h['region']
    instance_types = region_h['instanceTypes']

    instance_types.each do |instance_type_h|
      instance_type_h['sizes'].each do |size_h|
        size = size_h['size']
        buf[region] ||= {}
        buf[region][size] = []

        size_h['valueColumns'].map do |value_columns_h|
          buf[region][size] << value_columns_h['prices']['USD'].to_f
        end

        buf[region][size] = "%" + buf[region][size].inspect + "%"
      end
    end
  end

  return buf
end

def ri_sheets_js(varname, os, weight)
  buf = ri_sheets(os, weight)
  buf = JSON.pretty_generate(buf).strip
  buf = buf.gsub(/"%(\[[^%]+\])%"/) { $1 }
  JSON.parse(buf)
  "var #{varname} = " + buf + ';'
end

puts <<-EOS
// On-Demand Instances
#{ondemand_sheets_js '__calcLinuxMonthlyAmount__rateSheets', :linux}

#{ondemand_sheets_js '__calcWindowsMonthlyAmount__rateSheets', :mswin}

EOS

%w(Light Medium Heavy).each do |weight|
  linux_varname = "__calc#{weight}RILinuxMonthlyAmount__rateSheets"
  mswin_varname = "__calc#{weight}RIWindowsMonthlyAmount__rateSheets"

  puts <<-EOS
// Reserved Instances (#{weight})
#{ri_sheets_js linux_varname, :linux, weight.downcase}

#{ri_sheets_js mswin_varname, :mswin, weight.downcase}

EOS
end
