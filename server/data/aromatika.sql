BEGIN;

DROP TABLE IF EXISTS family,
category,
family_has_category,
oil,
oil_has_category,
part_of_plant,
property,
oil_has_property,
administration,
oil_has_administration,
"role",
"user",
oil_has_user;

CREATE TABLE family (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE category (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE family_has_category (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    family_id int NULL REFERENCES "family"("id"),
    category_id int NULL REFERENCES "category"("id"),
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE oil (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name text NOT NULL UNIQUE,
    botanic_name text NOT NULL UNIQUE,
    description text NOT NULL,
    extraction text NOT NULL,
    molecule text NOT NULL,
    plant_family text NOT NULL,
    scent text NOT NULL,
    image text,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE oil_has_category (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    oil_id int NULL REFERENCES "oil"("id"),
    category_id int NULL REFERENCES "category"("id"),
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE part_of_plant (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    oil_id int NULL REFERENCES "oil"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE property (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE oil_has_property (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
   oil_id int NULL REFERENCES "oil"("id"),
   property_id int NULL REFERENCES "property"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE administration (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE oil_has_administration (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    oil_id int NULL REFERENCES "oil"("id"),
    administration_id int NULL REFERENCES "administration"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "role" (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name text NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);
CREATE TABLE "user" (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	pseudo text NOT NULL UNIQUE,
    mail text NOT NULL UNIQUE,
    password text NOT NULL,
    role_id INTEGER REFERENCES role("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE oil_has_user (
	id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    oil_id int NULL REFERENCES "oil"("id"),
    "user_id" int NULL REFERENCES "user"("id"),
    favorite BOOLEAN NOT NULL,
    aromatheque BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);


INSERT INTO role(name) VALUES ('member');
INSERT INTO role(name) VALUES ('admin');

COMMIT;