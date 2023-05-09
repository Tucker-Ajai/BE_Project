When first attempting to use this app, you must set your own personal database to use it with. To direct the app to that database set your environment variable by using by creating 2 files. One should be named ".env.test" and in this file put PGDATABASE=nc_games_test.

The second is ".env.delopment" and this should contain PGDATABASE=nc_games

This will enable you to run the commands npm run setup-dbs and npm run seed to provide your database with some starting information. 
