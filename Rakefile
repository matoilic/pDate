require 'rake'
require 'rake/packagetask'
require 'vendor/pdoc/lib/pdoc'
require 'vendor/sprockets/lib/sprockets'
require 'yaml'

module PDate
  ROOT_DIR = File.expand_path(File.dirname(__FILE__))
  DOC_DIR = File.join(ROOT_DIR, "doc")
  TEMPLATES_DIR = File.join(ROOT_DIR, "templates", "html")
  SRC_DIR = File.join(ROOT_DIR, "src")
  PKG_DIR = File.join(ROOT_DIR, "pkg")
  DIST_DIR = File.join(ROOT_DIR, "dist")
  DIST_FILE = File.join(DIST_DIR, "pdate.js")
  DIST_FILE_COMPRESSED = File.join(DIST_DIR, "pdate.compressed.js")
  VERSION = YAML.load(IO.read(File.join(SRC_DIR, 'constants.yml')))['PDATE_VERSION']
  
  def self.prepare_dist
    recreate_dirs(DIST_DIR)
    sprocketize('pdate.js', true)
    sprocketize('copyright.js', false)
    copyright = File.join(DIST_DIR, 'copyright.js')
    compressed = `java -jar /Utils/yuicompressor.jar --charset 'utf-8' --type js --line-break 300 #{DIST_FILE}`

    File.open(DIST_FILE_COMPRESSED, 'w') do |f|
      f.write(IO.read(copyright))
      f.write(compressed)
    end
    
    rm copyright
    
    `cd vendor/prototype && rake dist && cp dist/prototype.js .`
  end

  def self.recreate_dirs(*dirs)
    dirs.each do |dir|
      rm_rf dir if File.exists?(dir)
      mkdir_p dir
    end
  end
  
  def self.build_doc
    recreate_dirs(DOC_DIR)
    
    sprocketize('pdate.js', false)
    PDoc::Runner.new(DIST_FILE, {
      :output => DOC_DIR,
      :templates => TEMPLATES_DIR,
      :index_page => 'README.markdown'
    }).run
  end
  
  def self.sprocketize(file, strip_comments)
    Sprockets::Secretary.new(
      :root           => File.join(SRC_DIR),
      :load_path      => [SRC_DIR],
      :source_files   => [file],
      :strip_comments => strip_comments
    ).concatenation.save_to(File.join(DIST_DIR, file))
  end
end

desc "Builds the distribution files"
task :dist => [:prepare_dist, :package, :cleanup]

task :cleanup do
  rm_rf File.join(PDate::PKG_DIR, "pdate-#{PDate::VERSION}")
  rm 'vendor/prototype/prototype.js'
end

desc "Builds the documentation"
task :doc do
  PDate.build_doc
end

task :prepare_dist do
  PDate.prepare_dist
  Rake::PackageTask.new('pdate', PDate::VERSION) do |package|
    package.need_tar_gz = true
    package.need_zip = true
    package.package_dir = PDate::PKG_DIR
    package.package_files.include(
      'README.markdown',
      'LICENCE',
      'dist/*.js',
      'vendor/prototype/prototype.js',
      'vendor/prototype/LICENSE'
    )
  end
end