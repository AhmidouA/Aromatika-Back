const essentialOils = require("../data/HE_seed_database.json");

require("dotenv").config();
const { Client } = require("pg");
const client = new Client();

async () => {
  // 0. initialisation
  // 0.1 je me connecte à la BDD
  await client.connect();

  // 0.2 j'efface les données existantes
  await client.query("TRUNCATE oil");

  // 1. importer les catégories
  // 1.1 je déclare le début de ma requête
  let oilQuery = `INSERT INTO oil 
        (name, botanic_name, description, extraction, molecule, plant_family, scent, image) VALUES`;
  // 1.2 je déclare un tableau qui va contenir mes ($1,$2)...
  const oilParameters = [];
  // 1.3 je déclare un tableau qui va contenir les valeurs qui vont remplacer les $1,$2...
  const oilValues = [];
  // 1.4 je mets en place un compteur pour incrémenter mes $1,$2...
  let oilCounter = 1;
  // 1.5 je boucle sur mes catégories
  for (const essentialOil of essentialOils) {
    // 1.6 j'ajoute ($1,$2) dans mon tableau qui contient les ($1,$2)
    oilParameters.push(`($${oilCounter}, $${oilCounter + 1}, $${
      oilCounter + 2
    }, $${oilCounter + 3}, $${oilCounter + 4}
            $${oilCounter + 5}, $${oilCounter + 6}, $${oilCounter + 7})`);
    // 1.7 j'incrémente mon compteur pour respecter l'ordre d'insertion des valeurs
    oilCounter += 8;
    // 1.8 j'ajoute d'abord name qui va correspondre au $1,$9,$17...
    oilValues.push(essentialOil.name);
    // 1.9 j'ajoute ensuite botanic_name qui va correspondre au $2,$10,$18...
    oilValues.push(essentialOil.botanicName);
    oilValues.push(essentialOil.description);
    oilValues.push(essentialOil.molecule);
    oilValues.push(essentialOil.extraction);
    oilValues.push(essentialOil.scent);
    oilValues.push(essentialOil.plantFamily);
    oilValues.push(essentialOil.image);
  }

  oilQuery += oilParameters.join(",") + ";";
  await client.query(oilQuery, oilValues);

  // 2.2 j'insère le post en bdd
  // 3. je me déconnecte de la BDD
  client.end();
};
