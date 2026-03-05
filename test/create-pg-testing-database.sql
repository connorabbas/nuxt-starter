-- create a PostgreSQL testing db for integration and e2e tests
SELECT 'CREATE DATABASE nuxt_auth_starter_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nuxt_auth_starter_test')\gexec
