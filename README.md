# CS-418-web-programming-fall-2020
CS 418 at ODU, professor Wu

## Notes
- the MySQL password is "monarchs"



## Clone the code
`git clone https://github.com/carson-stone/CS-418-web-programming-fall-2020.git`

`git clone git@github.com:carson-stone/CS-418-web-programming-fall-2020.git`


## Setting up the backend
`cd CS-418-web-programming-fall-2020/backend`

### Setting up MySQL
` mysql -u admin -p`

`> CREATE DATABASE figure_search_engine_db;`

`mysql -u admin -p --force --verbose figure_search_engine_db < figure_search_engine_db.sql`

### Setting up Django
`python -m venv venv`

`source venv/bin/activate`

`pip install -r requirements.txt`



## Setting up the frontend
`cd CS-418-web-programming-fall-2020/frontend`

`yarn instal`

`yarn start`
