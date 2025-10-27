'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Scale } from 'lucide-react'

interface CGVModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CGVModal({ open, onOpenChange }: CGVModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Conditions Générales de Vente
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                XEILOM - SAS au capital de 70.000 €
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 text-justify pt-6">
          {/* GÉNÉRALITÉS */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">GÉNÉRALITÉS</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Dans les conditions générales ci-après, la Société XEILOM est désignée comme
              étant le « VENDEUR » ; « L&apos;ACHETEUR» désignant la personne morale ou
              physique qui passe commande auprès de XEILOM. L&apos;Acheteur peut passer
              ses ordres par courrier, télécopie, e-mail ou téléphone (dans ces deux
              derniers cas, il devra indiquer son numéro de commande et confirmer par
              courrier).
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Sauf stipulation contraire de notre part, nos propositions, quelle
              qu&apos;en soit la forme et notamment nos tarifs et catalogues ont un
              caractère purement indicatif et ne pourront pas être interprétés comme
              comportant un engagement quelconque de notre part. Seule notre confirmation
              expresse par écrit conformément aux dispositions ci-dessus vaudra engagement
              de notre part.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Les offres ne sont valables que dans la limite du délai d&apos;option qui
              est de TROIS mois, sauf stipulation contraire.
            </p>
          </section>

          {/* COMMANDES */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">COMMANDES</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Dans tous les cas où aucune spécification particulière n&apos;est demandée
              par l&apos;Acheteur et acceptée par le Vendeur, les caractéristiques des
              matériels vendus seront celles qui figurent dans les spécifications du
              Vendeur au moment de la notification de commande.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pas de minimum de facturation. Le vendeur se réserve le droit de modifier
              ces minima sans préavis.
            </p>
          </section>

          {/* ANNULATION DE COMMANDE */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              ANNULATION DE COMMANDE
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Une commande ne peut être annulée en tout ou partie sans l&apos;accord
              préalable écrit du Vendeur.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              En cas d&apos;annulation d&apos;une commande en cours d&apos;exécution,
              toutes les marchandises dont la fabrication est commencée seront cependant
              livrées et facturées.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dans le cas de commandes particulières pour lesquelles XEILOM a dû
              s&apos;approvisionner en matières premières ou produits spéciaux en vue de
              l&apos;exécution de la dite commande, le coût de ces approvisionnements est
              facturé sous déduction de leur valeur de réemploi.
            </p>
          </section>

          {/* REPRISES */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">REPRISES</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Les reprises ne peuvent être faites qu&apos;à titre exceptionnel, après
              accord préalable écrit, pour des marchandises à l&apos;état neuf et en
              emballage d&apos;origine, livrées depuis moins de 15 jours retournées franco
              de port et d&apos;emballage, avec indication des numéros et date de bon de
              livraison et accompagnées d&apos;une commande de compensation équivalente au
              montant de la commande Initiale ; les reprises acceptées seront créditées
              après déduction forfaitaire de 30%.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Les retours de marchandises effectués sans notre autorisation et hors des
              conditions ci-dessus, ne peuvent en aucun cas, même s&apos;ils sont
              réceptionnés par nous, être considérés comme traduisant cet accord.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Toutefois, aucune reprise ne sera effectuée pour des marchandises non tenues
              en stock ayant fait l&apos;objet d&apos;une commande spécifique de la part
              du Vendeur auprès de ses fournisseurs.
            </p>
          </section>

          {/* CONDITIONS DE PAIEMENT */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              CONDITIONS DE PAIEMENT
            </h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-3">
              <p className="text-gray-700 leading-relaxed mb-2">
                Le règlement des matériels s&apos;effectue à{' '}
                <strong>30 jours fin de mois</strong> selon les conditions convenues lors
                de la passation de commande et reportées sur la facture.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Dans le cas d&apos;une première affaire, le paiement s&apos;effectue au
                comptant et sera accompagné des pièces nécessaires à l&apos;ouverture de
                compte du nouveau client.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              Dans le cas d&apos;un règlement à terme, la mise à disposition des produits
              commandés constitue le fait générateur de la facturation. Le délai précité
              s&apos;entend à compter de cette date. Les échéances sont de rigueur et les
              réclamations éventuelles portant sur les prix ou la qualité des marchandises
              ne dispense pas l&apos;Acheteur de régler les factures à l&apos;échéance
              convenue.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Le défaut de paiement d&apos;une facture ou le non-retour dans les quinze
              jours d&apos;un effet envoyé pour acceptation autorise le Vendeur à
              suspendre toute livraison quelles que soient les conditions de la commande
              et ce jusqu&apos;à parfait règlement. Il fera courir les intérêts au taux de
              9% par an de plein droit et sans mise en demeure préalable. En outre,
              vingt-quatre heures après la mise en demeure, par lettre recommandée non
              suivie de paiement, la vente des produits non payés sera résolue en plein
              droit ; les produits revenant immédiatement la propriété du Vendeur qui se
              prévaut de la présente disposition.
            </p>
          </section>

          {/* DÉLAIS DE LIVRAISON */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">DÉLAIS DE LIVRAISON</h3>
            <p className="text-gray-700 leading-relaxed">
              Les délais de livraisons indiqués par le Vendeur s&apos;entendent à partir
              de la date de l&apos;accusé de réception de commande par le Vendeur. Leur
              dépassement ne peut entraîner ni annulation de la commande, ni indemnité
              sauf stipulation contraire. Même si le vendeur a accepté une clause
              sanctionnant d&apos;une pénalité le dépassement d&apos;un délai aucune
              pénalité ne sera applicable si les conditions de paiement n&apos;ont pas été
              respectées par l&apos;acheteur, si les renseignements à fournir par
              l&apos;Acheteur ne l&apos;ont pas été en temps voulu ou si, par suite
              d&apos;un événement de force majeure ou imprévisible, le Vendeur s&apos;est
              trouvé empêché de respecter ses engagements.
            </p>
          </section>

          {/* TRANSPORT ET ASSURANCE */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              TRANSPORT ET ASSURANCE
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Les marchandises voyagent toujours aux risques et périls de l&apos;Acheteur.
              Il lui appartient de vérifier les expéditions à l&apos;arrivée et
              d&apos;exercer s&apos;il y a lieu les recours contre les transporteurs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Les produits expédiés ne sont pas assurés par le Vendeur ; ils peuvent
              l&apos;être sur instruction particulière de l&apos;Acheteur. Celui-ci
              prendra alors en charge les frais d&apos;assurance.
            </p>
          </section>

          {/* RESPONSABILITÉS */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">RESPONSABILITÉS</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              L&apos;acheteur est le seul juge de l&apos;aptitude des marchandises à
              remplir l&apos;usage auquel il les emploie et des conditions de leur
              utilisation, et le Vendeur est déchargé dans tous les cas de toute garantie
              et responsabilité quelconque à ce sujet dès l&apos;instant où les
              marchandises livrées correspondent à la désignation qui en a été faite sur
              la proposition et l&apos;accusé réception de commande.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              En cas de contestation sur la qualité des marchandises et quel que soit le
              vice invoqué, la garantie est expressément limitée au remplacement pur et
              simple des marchandises reconnues défectueuses par les deux parties, sans
              encourir aucune espèce de responsabilité notamment relative à des frais de
              transports, frais de transformation, etc.…
            </p>
            <p className="text-gray-700 leading-relaxed">
              En aucun cas le Vendeur ne peut être déclaré responsable des conséquences
              directes ou indirectes tant sur les personnes que sur les biens, d&apos;une
              défaillance du produit vendu par lui.
            </p>
          </section>

          {/* CLAUSE DE RESERVE DE PROPRIÉTÉ */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              CLAUSE DE RESERVE DE PROPRIÉTÉ
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Le Vendeur conserve la propriété du matériel vendu jusqu&apos;à complet
              paiement du prix, des éventuels frais et des intérêts inclus.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cette clause est en conformité avec la loi n°8598 du 25 janvier 1985,
              article 121, et la loi n°80335 du 12 mai 1980.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              En cas de non-paiement, la restitution des marchandises pourra résulter soit
              d&apos;une mise en demeure recommandée, soit d&apos;un inventaire
              contradictoire, soit d&apos;une sommation d&apos;Huissier. L&apos;Acheteur
              ne pourra s&apos;y dérober.
            </p>
            <p className="text-gray-700 leading-relaxed">
              En cas de non-paiement partiel, la Société XEILOM gardera à titre
              d&apos;indemnité ce paiement, outre la restitution du matériel.
            </p>
          </section>

          {/* CLAUSE PÉNALE */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">CLAUSE PÉNALE</h3>
            <p className="text-gray-700 leading-relaxed">
              En cas d&apos;inexécution quelconque de ses obligations par l&apos;Acheteur
              et après une mise en demeure restée infructueuse soit par lettre recommandée
              avec accusé de réception, soit par acte d&apos;Huissier, le Vendeur majorera
              les sommes dues, et ce, à titre de dommages et intérêts, d&apos;une somme
              égale à 15% (quinze pour cent) du prix de vente hors taxes.
            </p>
          </section>

          {/* ACCEPTATION DES CGV */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              ACCEPTATION DE NOS CONDITIONS GÉNÉRALES DE VENTE
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              En cas de contestation le Tribunal de Commerce de Soissons est seul
              compétent quels que soient les conditions de vente, le lieu de livraison,
              les modes et lieu de paiement, même si celui-ci est effectué par traite
              domiciliée et même en cas d&apos;appel en garantie ou de pluralité de
              défendeurs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Les droits et obligations des parties sont régis exclusivement par le droit
              français.
            </p>
          </section>

          {/* PRIX */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">PRIX</h3>
            <p className="text-gray-700 leading-relaxed">
              Nos prix s&apos;entendent nets, hors taxes, emballés en conditionnement
              standard. Ils peuvent être révisés sans préavis par XEILOM, et communiqués
              rapidement à l&apos;Acheteur.
            </p>
          </section>

          {/* FRAIS DE PORT */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">FRAIS DE PORT</h3>
            <p className="text-gray-700 leading-relaxed">
              Franco de port, pour les livraisons France d&apos;un montant supérieur à 200€
              Hors Taxes en messagerie (48 à 96H). Hors baies et coffrets 19 pouces.
            </p>
          </section>

          {/* CONDITIONNEMENT */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">CONDITIONNEMENT</h3>
            <p className="text-gray-700 leading-relaxed">
              Nos marchandises sont livrées par unités ou en boite complète à votre
              convenance.
            </p>
          </section>

          {/* FRAIS DE GESTION */}
          <section className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">FRAIS DE GESTION</h3>
            <p className="text-gray-700 leading-relaxed">
              D&apos;un montant de 25€ pour les livraisons en France d&apos;un montant
              inférieur à 200€ Hors Taxes en messagerie (48 à 96H) ou pour toute livraison
              d&apos;une baie ou d&apos;un coffret 19 pouces de 4 à 42U.
            </p>
          </section>

          {/* EXPRESS */}
          <section className="pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">EXPRESS</h3>
            <p className="text-gray-700 leading-relaxed">
              A la demande de l&apos;acheteur, les produits pourront être envoyés en
              EXPRESS à sa charge.
            </p>
          </section>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t-2 border-blue-500 bg-blue-50 p-4 rounded">
            <p className="text-center text-gray-700 font-semibold text-sm">
              XEILOM - SAS au capital de 70.000 € - R.C.S SOISSONS - Siret 521 756 502
              00030 – APE 4652 Z – N° Intracom. FR 15521756502
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
