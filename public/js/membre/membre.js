$(function(window, $) {
    if ('undefined' == typeof(window.CL.View.membre)) { window.CL.View.membre = {}; }

    const SELECTOR_TYPE_ADHESION = '#type_adhesion';
    const SELECTOR_ROLE_MEMBRE = '#role';
    const SELECTOR_NO_SEQ_MEMBRE = '#numero_sequence_membre';
    const SELECTOR_BTN_ENR_ROLE = '#enregistrerRole';
    const SELECTOR_MODAL_CREER_ADH = '#modalCreerAdhesion';
    const SELECTOR_FRM_CREER_ADH = '#frmCreerAdhesion';
    const SELECTPR_SUP_ADHESION = '.supprimer-adhesion';
    const SELECTOR_TBL_ADHESION = '#tblAdhesions';

    initialiserPage();

    function initialiserPage() {
        $('#eventCreerAdhesion').click((e) => { $(SELECTOR_MODAL_CREER_ADH).modal(); });
        $(SELECTOR_TYPE_ADHESION).change((e) => { appliquerInformationsAdhesion(); });
        $(SELECTOR_BTN_ENR_ROLE).click((e) => { modifierRole(); });
        $(SELECTOR_FRM_CREER_ADH).submit(creerAdhesion);
        $(SELECTOR_TBL_ADHESION).click((e) => { e.preventDefault(); });
        $('input[name=etudiant]').change(appliquerInformationsEtudiant);

        initialiserDatatable();
    }

    function initialiserDatatable() {

        var configDatatable = {
            paging: false,
            searching: false,
            ordering: false,
            ajax: '/api/adhesion/' + $(SELECTOR_NO_SEQ_MEMBRE).val(),
            columns: [{
                render: function(data, type, row, meta) {
                    return `<a href="/api/adhesion/` + row.numero_sequence + `" class="cl-icons supprimer-adhesion">
                                <i class="far fa-trash-alt"></i>                   
                            </a>`;
                }
            }, {
                data: 'date_debut',
                title: 'Date début'
            }, {
                data: 'date_fin',
                title: 'Date fin'
            }, {
                data: 'nom',
                title: 'Adhésion'
            }, {
                data: 'etudiant_libelle',
                title: 'Étudiant'
            }, {
                data: 'montant_paye',
                title: 'Montant payé',
                render: function(data, type, row, meta) {
                    return data + ' $';
                }
            }, {
                data: 'type_transaction_libelle',
                title: 'Transaction'
            }],
            rowCallback: function(row, data) {
                if (data.adh_actif) {
                    $(row).addClass('alert-success');
                } else {
                    $(row).addClass('alert-danger');
                }
            }
        };
        jQuery.extend(configDatatable, window.CL.Configuration.DatatableOptionsBase);

        $(SELECTOR_TBL_ADHESION).DataTable(configDatatable);
    }


    function creerAdhesion(e) {
        e.preventDefault();

        var donnees = window.CL.Utilitaires.getFormData($(this));
        donnees.numero_sequence_membre = $(SELECTOR_NO_SEQ_MEMBRE).val();
        donnees.numero_sequence_type_adhesion = donnees.type_adhesion;

        $.ajax({
            url: '/api/adhesion/' + donnees.numero_sequence_membre,
            data: donnees,
            method: 'POST',
            success: function(result, statut) {
                $(SELECTOR_TBL_ADHESION).DataTable().ajax.reload();
                $(SELECTOR_MODAL_CREER_ADH).modal('hide');
            }
        });
    }

    function modifierRole() {
        var numeroSequenceMembre = $(SELECTOR_NO_SEQ_MEMBRE).val();
        var role = $(SELECTOR_ROLE_MEMBRE).val();

        $.ajax({
            url: '/api/membres/ModifierRole/' + numeroSequenceMembre,
            data: { role: role },
            method: 'PUT',
            success: function(result, statut) {
                $.ambiance({
                    message: "Modification enregistrée.",
                    type: "success"
                });
            }
        });
    }

    function appliquerInformationsEtudiant() {
        var option = $('#type_adhesion>option:selected');
        if (option.val() === '') {
            return;
        }

        var etudiant = $('input[name=etudiant]:checked').val()
        var montantPaye = 0;

        if (etudiant.toLowerCase() === 'true') {
            montantPaye = option.data('montant-etudiant');
        } else {
            montantPaye = option.data('montant');
        }

        $(SELECTOR_MODAL_CREER_ADH + ' #montant_paye').val(montantPaye);
    }

    function appliquerInformationsAdhesion() {
        var option = $('#type_adhesion>option:selected');
        var etudiant = $('input[name=etudiant]:checked').val()

        var anneeCourante = new Date().getFullYear();

        var dateDebut = option.data('debut');
        var dateFin = option.data('fin');
        var nbrJour = option.data('nbr-jour');
        var montantPaye = 0;

        if (etudiant.toLowerCase() === 'true') {
            montantPaye = option.data('montant-etudiant');
        } else {
            montantPaye = option.data('montant');
        }

        if (typeof nbrJour === 'undefined' || nbrJour === null || nbrJour === "") {
            dateDebut = moment(dateDebut, 'YYYY-MM-DD').year(anneeCourante).format('YYYY-MM-DD');
            dateFin = moment(dateFin, 'YYYY-MM-DD').year(anneeCourante).format('YYYY-MM-DD');
        } else {
            dateDebut = moment().format('YYYY-MM-DD');
            dateFin = moment().add(1, 'y').format('YYYY-MM-DD');
        }

        $(SELECTOR_MODAL_CREER_ADH + ' #date_debut').val(dateDebut);
        $(SELECTOR_MODAL_CREER_ADH + ' #date_fin').val(dateFin);
        $(SELECTOR_MODAL_CREER_ADH + ' #montant_paye').val(montantPaye);
    }

}(window, $));