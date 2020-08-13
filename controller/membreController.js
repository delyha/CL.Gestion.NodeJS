const formulaireDB = require('../db/formulaireDB')
const membreDB = require('../db/membreDB')
const typeAdhesionDB = require('../db/typeAdhesionDB');

const express = require('express');
const router = express.Router();
const async = require('async');
const json = require('../configs/enumerations.json');
const utilitaires = require('../utils/utilitaires');
var helpers = require('handlebars-helpers')();

/*
 ** Permet de consulter un formulaire existant, sinon retourne a la page d'accueil
 */
router.get('/membre/consulter/:id', function(request, response) {
    const id = parseInt(request.params.id);

    async.waterfall([
        //Obtention des informations du membre
        function(callback) {
            membreDB.getMembreByNumeroSequence(id, (infoMembre) => {
                callback(null, infoMembre);
            });
        },
        //Obtention de ces formulaires de risques
        function(infoMembre, callback) {
            formulaireDB.getFormulaireByNumeroSequenceMembre(id, (infoFormulairesMembre) => {
                callback(null, infoMembre, infoFormulairesMembre);
            });
        },
        //Obtention des énumérations pour l'affichage de la page
        function(infoMembre, infoFormulairesMembre, callback) {
            var listEnum = {
                ROLE: utilitaires.EnumToList(json.ROLE),
                TYPE_TRANSAC: utilitaires.EnumToList(json.TYPE_TRANSAC)
            };
            callback(null, infoMembre, infoFormulairesMembre, listEnum);
        },
        function(infoMembre, infoFormulairesMembre, listEnum, callback) {
            typeAdhesionDB.getTypeAdhesion((typeAdhesion) => {
                callback(null, infoMembre, infoFormulairesMembre, listEnum, typeAdhesion);
            });
        }
    ], function(err, infoMembre, infoFormulairesMembre, listEnum, typeAdhesion) {
        if (infoMembre.length == 1) {
            response.render('membre/membre-lecture', {
                membre: infoMembre[0],
                formulaires: infoFormulairesMembre,
                enumeration: listEnum,
                typeAdhesion: typeAdhesion
            });
        } else {
            response.redirect('./');
        }
    });
});

module.exports = router;