# frozen_string_literal: true

source 'https://rubygems.org'
gem 'algolia', '~> 3.8', '>= 3.8.1'
gem 'jekyll', '~> 4.3', '>= 4.3.4'
gem 'jekyll_bootstrap5_tabs', '~> 1.1', '>= 1.1.2'
gem 'jekyll-github-metadata', '~> 2.16', '>= 2.16.1'
gem 'jekyll-paginate', '~> 1.1'
gem 'jekyll-theme-chirpy', '~> 7.1', '>= 7.1.1'
gem 'jekyll-ultraviolet', '~> 0.0.3'
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
group :jekyll_plugins do
  gem 'jekyll-algolia', '~> 1.0'
end
