create database if not exists tienda_virtual;

create user if not exists root@'%' identified by 'root';
grant all on tienda_virtual.* to root@'%';