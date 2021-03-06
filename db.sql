--DROP TABLE public.fiche_inscription;
--DROP TABLE public.adhesion;
--DROP TABLE public.formulaire_risque;
--DROP TABLE public.membre;
--DROP TABLE public.type_adhesion;

CREATE TABLE public.type_adhesion (
	numero_sequence serial NOT NULL,
	nom text NOT NULL,
	date_debut date NULL,
	date_fin date NULL,
	nombre_jour int2 NULL,
	montant int2 NULL,
	montant_etudiant int2 NULL,
	adresse_carte varchar NULL,
	CONSTRAINT type_adhesion_pkey PRIMARY KEY (numero_sequence)
);

INSERT INTO public.type_adhesion (numero_sequence,nom,date_debut,date_fin,nombre_jour,montant,montant_etudiant, adresse_carte) VALUES 
(1,'Saisonnier hiver','1971-01-01','1971-04-30',NULL,30,25, 'rectoCarteHiver.png'),
(2,'Saisonnier été','1971-05-01','1971-08-31',NULL,30,25, 'rectoCarteEte.png'),
(3,'Saisonnier automne','1971-09-01','1971-12-31',NULL,30,25, 'rectoCarteAutomne.png'),
(4,'Annuel',NULL,NULL,365,70,60, 'rectoCarteAnnuelle.png'),
(5,'Journalière',NULL,NULL,1,10,10, '');

ALTER SEQUENCE type_adhesion_numero_sequence_seq START WITH 6;


CREATE TABLE public.membre (
	numero_sequence serial NOT NULL,
	nom text NOT NULL,
	prenom text NOT NULL,
	adresse_courriel text NOT NULL,
	telephone text NOT NULL,
	"role" text NULL,
	date_creation date NOT NULL,
	date_naissance date NOT NULL,
	est_supprime bool NULL,
	passhash text NOT NULL,
	CONSTRAINT membre_pkey PRIMARY KEY (numero_sequence)
);


CREATE TABLE public.formulaire_risque (
	numero_sequence serial NOT NULL,
	nom text NOT NULL,
	prenom text NOT NULL,
	adresse_courriel text NOT NULL,
	telephone text NOT NULL,
	nom_prenom_contact text NOT NULL,
	adresse_contact text NOT NULL,
	telephone_contact text NOT NULL,
	lien_contact text NOT NULL,
	accepte_risque bool NOT NULL,
	date_acceptation date NOT NULL,
	numero_sequence_membre int4 NULL,
	date_expiration date NOT NULL,
	CONSTRAINT formulaire_risque_pkey PRIMARY KEY (numero_sequence)
);

-- public.formulaire_risque foreign keys
ALTER TABLE public.formulaire_risque ADD CONSTRAINT formulaire_risque_numero_sequence_membre_fkey FOREIGN KEY (numero_sequence_membre) REFERENCES membre(numero_sequence) ON DELETE SET NULL;


CREATE TABLE public.adhesion (
	numero_sequence serial NOT NULL,
	date_debut date NOT NULL,
	date_fin date NOT NULL,
	montant_paye int4,
	date_transaction date,
	type_transaction text NOT NULL,
	numero_sequence_membre int4 NOT NULL,
	etudiant bool NOT NULL,
	numero_sequence_type_adhesion int4 NOT NULL,
	numero_sequence_statut_demande int4 NOT NULL,
	commentaire varchar NULL,
	numero_membre varchar NULL,
	CONSTRAINT adhesion_pkey PRIMARY KEY (numero_sequence)
);

-- public.adhesion foreign keys
ALTER TABLE public.adhesion ADD CONSTRAINT adhesion_numero_sequence_membre_fkey FOREIGN KEY (numero_sequence_membre) REFERENCES membre(numero_sequence) ON DELETE SET NULL;
ALTER TABLE public.adhesion ADD CONSTRAINT adhesion_numero_sequence_type_adhesion_fkey FOREIGN KEY (numero_sequence_type_adhesion) REFERENCES type_adhesion(numero_sequence) ON DELETE SET NULL;

-- public.fiche_inscription definition
CREATE TABLE public.fiche_inscription (
	numero_sequence serial NOT NULL,
	nom_activite varchar NOT NULL,
	url varchar NOT NULL
);