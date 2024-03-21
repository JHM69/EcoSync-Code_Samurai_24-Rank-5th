# Shuno Backend
![Login](/docs/screenshots/logo.png)


Shuno is a all an one audio streaming platform for musics, podcasts, audiobooks, poem resiting or any kind of audio.

Implementing Shuno-Backend with express js using Postgres Database and prisma.


## structure

<!-- A image from public/images folder  -->

![Shuno-Backend](./public/images/erd.png)


# Getting started

### Install the dependancies

```
npm install
```

 
### Connect the created server
create a _.env_ file at the root of the project  
populate it with the url of your database

```
DATABASE_URL = postgresql://postgres:jhm69@localhost:5432/Shuno
```


### Run the project locally

run `npm run dev`

### Prisma
```bash
npx prisma migrate dev
```

```bash
npx prisma generate
```

### Launch Prisma Studio
Entire Database on Prisma studio
```bash
npm run prisma:studio
```

# Api Documentation
To view the api documentation, simply run
```bash
cd docs
npx serve
```
Or you can import the Insomnia JSON to view explore the apis.
 
![](/docs/screenshots/1.png)
![](/docs/screenshots/2.png)
![](/docs/screenshots/3.png)
![](/docs/screenshots/4.png)
![](/docs/screenshots/5.png)




Extra 


rm -rf prisma/migrations
mkdir -p prisma/migrations/0_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init


 









