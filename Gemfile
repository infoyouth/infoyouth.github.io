# frozen_string_literal: true

source 'https://rubygems.org'

gem 'jekyll-theme-chirpy', '~> 7.1', '>= 7.1.1'

group :test do
  gem 'html-proofer', '~> 5.0'
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem 'tzinfo', '>= 1', '< 3'
  gem 'tzinfo-data'
end

gem 'wdm', '~> 0.1.1', platforms: %i[mingw x64_mingw mswin]

group :development do
  gem 'rubocop', '~> 1.34', require: false
end
