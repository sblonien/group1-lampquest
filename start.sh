#!/bin/sh
mysql-ctl start &
nodemon index.js
wait
