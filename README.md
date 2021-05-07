# metrodocu-web-app
An school project related to web technologies.

## Server setup
1. Clone this repository or download it as a zip file and unzip the files.
2. Install Node.js and MariaDB.
3. `cd path/to/project/folder && cd sql`.
4. Edit the `metrodocu.sql` file and replace the password `changeme` with a desired one.
5. In the same folder, connect to MariaDB `mysql -u root -p`. Specifiy the the host, if MariaDB is running in the remote server.
6. Type `source metrodocu.sql;`. The database is now deployed.
7. Create the following folders in the project's root folder: `mkdir -p uploads/covers && mkdir -p uploads/documents && mkdir secrets`.
8. Go to `secrets` folder. Create self-signed certificates: `openssl req -newkey rsa:2048 -keyout server.key -nodes -new -x509 -days 99999 -out server.crt` and `openssl req -newkey rsa:2048 -keyout jwt.key -nodes -new -x509 -days 99999 -out jwt.crt`. These are used to encrypt the the connection and to create JWT tokens issued to users.
9. Create `.env` file in the project's root folder and paste the following content: 
```
HTTP_PORT=8080
HTTPS_PORT=8443

DB_HOST=localhost
DB_NAME=metrodocu
DB_USER=metrodocu
DB_PASSWORD=changeme

CAPTCHA_SECRET=
```
Edit the information. You can setup and obtain reCAPTCHA secret key from https://www.google.com/recaptcha/about/.

9. Open `register.js` from project's `public/js/` folder. Edit the `siteKey` variable to correspond your reCAPTCHA site key.
10. Install the necessary dependencies: `npm install --production`.
11. Start the server: `nohup node app.js &> server.log &`. The node process will be running in the background and it will not stop when you exit the server. Logs related to the server process can be found from the project's root folder `server.log` file.
