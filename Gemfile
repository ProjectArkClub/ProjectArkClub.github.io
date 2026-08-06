source "https://rubygems.org"
# GitHub Pages 官方推荐:使用 github-pages gem,与 Pages 构建环境保持一致
# (内含 jekyll 3.9.x / jekyll-sass-converter 1.5.x 等锁定版本)
gem "github-pages", group: :jekyll_plugins

# Windows 和 JRuby 不包含 zoneinfo 文件,需打包 tzinfo-data
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Windows 上目录监听的性能优化
gem 'wdm', '>= 0.1.0' if Gem.win_platform?

# Ruby 3.0+ 不再内置 webrick,本地 serve 需要
gem "webrick", "~> 1.7"
