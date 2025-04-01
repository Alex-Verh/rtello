# Rtello - Trello Duplicate in Ruby on Rails

## Rails commands used:

### Start project

`./bin/dev` or `rails server`

### Generate controller with views and subsequent helpers

`rails generate controller [name] [method]`

### Generate controller only for API purposes

`rails generate controller Api::[Model] --no-helper --no-assets --no-template-engine`

### Generate Devise model for authentication

`rails generate devise [Name e.g. User]`

### Generate default Devise views

`rails generate devise:views`

### Convert HTML Erb files into HAML

`html2haml app/views/[directory]/**/\*.erb app/views/[directory]/**/\*.haml`

### Initialize database and apply migrations

`rails db:create - initialize db`
`rails db:migrate - apply migrations`

### Generate model with attributes and their types

`rails generate model ModelName [attribute_name]:[type] [attribute_name]:[type]`

### Generate CarrierWave file uploader

`rails generate uploader [Name]`

### Generate worker for Sidekiq/Redis for background processing

`rails generate job [Name]`

### Start Redis server

`redis-server`

### Run Sidekiq on the Redis server for the config file sidekiq.yml

`bundle exec sidekiq -C config/sidekiq.yml`

## Other Notes:

### Functional Requirements as well as Dependencies and DB Schema diagram can be found in the report PDF file.
