const formulaireDB = require('../../db/formulaireDB');
const express = require('express');
const router = express.Router();
const gererConnexion = require('../../services/gererConnexion');

/*
 ** Permet de consulter un formulaire existant, sinon retourne a la page d'accueil
 */
router.get('/formulaire/consulter/:id', [gererConnexion.gererAdmin, (request, response) => {
    const id = request.params.id;
    ConsulterFormulaireRisque(request, response, id);
}]);

router.get('/formulaire/consulter', [gererConnexion.gererMembre, (request, response) => {
    const id = request.session.userConnected.formulaireRisqueActif.numero_sequence;
    ConsulterFormulaireRisque(request, response, id);
}]);

function ConsulterFormulaireRisque(request, response, id) {
    formulaireDB.getFormulaireByNumeroSequence(id, (result) => {
        if (result !== null) {
            response.render('espaceMembre/formulaireRisque/formulaire-lecture', {
                layout: 'template-membre',
                formulaire: result
            });
        } else {
            response.redirect('/');
        }
    });
}

/*
 ** Affichage de la page d'ajout d'un nouveau formulaire
 */
router.get('/formulaireRisque/ajouter', [gererConnexion.gererMembre, (request, response) => {
    var userConnected = request.session.userConnected;

    response.render('espaceMembre/formulaireRisque/formulaire-ajout', {
        layout: 'template-membre',
        numero_sequence: userConnected.numero_sequence,
        nom: userConnected.nom,
        prenom: userConnected.prenom,
        adresse_courriel: userConnected.adresse_courriel,
        telephone: userConnected.telephone
    });
}]);


/*
 ** Permet d'ajouter le formulaire 
 */
router.post('/formulaireRisque/ajouter', (request, response) => {
    formulaireDB.createFormulaire(request.body, (noSeqFormulaire) => {
        formulaireDB.getFormulaireByNumeroSequence(noSeqFormulaire, (formulaire) => {
            request.session.userConnected.formulaireRisqueActif = formulaire;
            response.redirect('/');
        });
    });
});


module.exports = router;