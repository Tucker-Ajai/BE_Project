When first attempting to use this app, you must set your own personal database to use it with. To direct the app to that database set your environment variable by using, process.env.PGDATABASE = "Personal Server", while running any commands on this code. For example

process.env.PGDATABASE = "Personal Server" npm run setup-dbs

The above command will first set the server to "Personal Server" and then setup 2 databases on that server as instructed in ./db/setup.sql

