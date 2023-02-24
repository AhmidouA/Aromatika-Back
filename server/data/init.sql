-- Je crèe le compte qui va gérer ma BDD
CREATE ROLE "admin_aromatika" WITH LOGIN PASSWORD 'aromatika';

-- Je crèe la base de données
CREATE DATABASE "aromatika" OWNER admin_aromatika;