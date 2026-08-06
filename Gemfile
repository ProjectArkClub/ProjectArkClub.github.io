source "https://rubygems.org"
# GitHub Pages 官方推荐:使用 github-pages gem,与 Pages 构建环境保持一致
# (内含 jekyll 3.10.0 / jekyll-sass-converter 1.5.x 等锁定版本)
gem "github-pages", group: :jekyll_plugins

# Ruby 3.4 起 bigdecimal 不再是 default gem,而 liquid 4.0.4 依赖它,需显式声明
gem "bigdecimal"

# Windows 和 JRuby 不包含 zoneinfo 文件,需打包 tzinfo-data
platforms :windows, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Windows 上目录监听的性能优化
gem 'wdm', '>= 0.1.0' if Gem.win_platform?

# Ruby 3.0+ 不再内置 webrick,本地 serve 需要
gem "webrick", "~> 1.7"
