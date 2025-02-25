# Project Overview

This is an evnet managmnent app used to help you manage events at your organization It provides you with 2 main users
- Admin used to create,update and delete events 
- User used to view created events and join live ones 
This gives you the ability to know who and how many are attending you event and your users an easy way of knowing more about events organized by you.

# Tech Stack
- Laravel
- MySql
- Nova
- React 

# Installation & Setup
## Prerequisites 
- PHP >= 8.2
- composer
- Node 
- MySql
- Nova License
## Steps to set up locally
1. Run following commands
```bash 
    git clone https://github.com/Abdallah2358/event-app.git
    cd event-app
    composer config http-basic.nova.laravel.com <your-nova-account-email@your-domain.com> <your-license-key>
    composer install
    npm install 
    cp .env.example .env
    php artisan key:generate
```
2. update `.env` file with your database credentials and nova license key
```

 NOVA_LICENSE_KEY=

 DB_CONNECTION=mysql
 DB_HOST=127.0.0.1
 DB_PORT=3306
 DB_DATABASE=event_app
 DB_USERNAME=root
 DB_PASSWORD=
```
3. run following commands
```bash
    npm run build
    php artisan migrate --seed
    php artisan serve
```
## Note
> For Development you may want to run `npm run dev` at another shell

# Features
## User Roles
- Admin : Can Manage Events ( CRUD )
- User : Can register and join live events.
## Event Management
- Create, update, delete events via Laravel Nova
## User Registration & Event Participation
- [x] Users able to register on the platform.
- [x] Users can join one or more events.
- [x] Users receives a confirmation email upon successful event registration.
- [x] Send a reminder notification to users on the day of the event.
- [x] Users cant not join the same event twice.
- [x] Users cant not to join two events that overlap on the same day based on the event duration.
- [x] Implement capacity handling (users should not be able to join if the event is full). 
  - [x] Implement using Middleware (Not Done)
- [x] Implement waitlist functionality if an event is full.

## Event Display for Users
- [x] Admins see all events draft and published.
- [x] Users should see only published events.
  - [x] in a calendar view.
- [x] Events that the user has joined should be highlighted in a certain way.


