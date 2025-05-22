# Techer
## A New Way To Manage Online Classes

### This is a simple platform using google classroom's idea for manageing classes
*This a practice Website.*

### Technology Used
This website is using ejs, html, css, bootstrap, font-awsome and js to display a good looking frontend which can be dinamicaly changed.
The backend uses node.js with express for easy set up, mongoose for connection with mongoDB database, multer for easy file uploading, nodemailer for emailing, socket.io for real time communication between backend and frontend, helmet for security, uniquid for unique code generation and compression for making the website faster. 

### Info About The Website

__Acount Types__
1. Admin 
2. Teacher 
3. Student

__Admin Account Allowances__
1. Admins can change/create/delete teacher, student and admin account.
2. Admins can create classes.
3. Admins can added teachers and students to classes.
4. Admins can add assignments to classes, they can upload files, notes and meet codes.
5. Admins search for accounts and classes.
6. Admins can view people already added in a class.
7. Admins can view classes they are teaching in.

__Teacher Account Allowances__
1. Teachers can change/create/delete student account.
2. Teachers can create classes.
3. Teachers can added teachers and students to classes.
4. Teachers can add assignments to classes, can upload files, notes and meet codes.
5. Teachers search for accounts and classes.
6. Teachers can view people already added in a class.
7. Teachers can view classes they are teaching in.

__Student Account Allowances__
1. Students can view the classes thay are in.
1. Students can view people already added in a class.
1. Students can view assignments.

__Genral Guidlines__
1. The only way to delete/edit any type of account or classes is through the search box.
2. On the creation of a student account, an email with the students account details will be spent to the provided email address.
3. Assignments can not be edited or deleted
4. Title is needed in every assignments

## Setup
1. Download Code
2. Run command npm install
3. Make ```techer``` folder in mongoDB with collection ```teachers```
4. Add an admin account in the collection, use the syntax :
```
{
    Admin : true,
    t_Id : "8g086bdkkpjtwyb9",
    Name : // enter admin name,
    Email : "info@coderunner.in",
    Username : // enter admin username,
    Password : // enter admin password
}
```
5. Run command npm start

## Aditional Data

### Dependencies
* compression
* ejs
* express
* helmet
* mongoose
* multer
* nodemailer
* socket.io
* uniqid



Language | Lines Of Code | Total
-------- | ------------- | -----
EJS | 120 + 18 + 50 + 20 + 108 + 84 + 76 + 95 + 112 + 31 + 48 + 21 + 2 | 785
Backend JavaScript | 171 + 75 + 59 + 27 + 154 + 60 + 135 + 11 + 173 + 65 + 208 + 40 | 1178
Frontend JavaScript |  5 + 123 + 128 + 49 + 21 + 109 | 435
HTML | 45 | 45
CSS | 6 + 71 + 72 + 34 + 34 + 106 | 323
MarkDown | 88 | 88
Grand Total | 785 + 1178 + 435 + 45 + 323 + 88 | 2854

*This table excludes the module/auto generated code*