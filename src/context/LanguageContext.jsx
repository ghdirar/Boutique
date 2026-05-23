import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  fr: {
    // Navbar
    nouveautes: "Nouveautés",
    sacs_main: "Sac à la main",
    collections: "Collections",
    rechercher: "Rechercher",
    rechercher_placeholder: "Rechercher un article... (Entrée pour valider)",
    chercher: "Chercher",
    caddie: "Panier",
    favoris: "Favoris",
    menu: "Menu",
    slogan: "Elle est déjà la vôtre",
    
    // Hero
    printemps_ete: "Printemps — Été 2026",
    nouvelle_collection: "Nouvelle Collection",
    hero_desc: "Maroquinerie parisienne, lignes pures et détails lumineux. Une ode à l'élégance algérienne contemporaine.",
    decouvrir_coll: "Découvrir la collection",
    sacs_main_btn: "Sacs à la main",
    defiler: "Défiler",
    
    // Marquee
    livraison_algerie: "Livraison Algérie",
    paiement_livraison: "Paiement à la livraison",
    qualite_premium: "Qualité premium",
    artisanat_luxe: "Artisanat de luxe",
    
    // Features
    feat_delivery_title: "Livraison dans toute l'Algérie",
    feat_delivery_sub: "Rapide & sécurisée",
    feat_payment_title: "Paiement à la livraison",
    feat_payment_sub: "Payez à la réception",
    feat_craft_title: "Artisanat premium",
    feat_craft_sub: "Fabriqué avec soin",
    feat_support_title: "Support client",
    feat_support_sub: "WhatsApp & Instagram",
    
    // Home sections
    derniers_arrivages: "Derniers arrivages",
    les_nouveautes: "Les Nouveautés",
    nouveautes_desc: "Une sélection méticuleuse de pièces aux finitions soignées — fraîchement arrivées.",
    voir_catalogue: "Voir tout le catalogue",
    selection_curatee: "Sélection curatée",
    les_essentiels: "Les Essentiels La Votre",
    essentiels_desc: "Des formes intemporelles, pensées pour accompagner votre quotidien avec une élégance discrète et raffinée.",
    voir_collection: "Voir la collection",
    note_moyenne: "Note moyenne",
    commandes_mois: "Commandes / mois",
    offre_exclusive: "Offre exclusive",
    livraison_offerte: "Livraison Offerte",
    livraison_offerte_desc: "Dès 3 articles achetés, profitez de la livraison gratuite partout en Algérie. Ne manquez pas cette occasion.",
    commander_maintenant: "Commander maintenant",
    vous_aimerez_aussi: "Vous aimerez aussi",
    
    // Cart
    panier_titre: "Votre Panier",
    panier_vide: "Votre panier est vide.",
    continuer_achats: "Continuer mes achats",
    recap_commande: "Résumé de la commande",
    sous_total: "Sous-total",
    livraison: "Livraison",
    gratuit: "Gratuit",
    offert_shipping: "Offerte 🎁",
    total: "Total",
    passer_commande: "Passer la commande",
    livraison_gratuite_alert: "Livraison gratuite offerte !",
    livraison_gratuite_progress: "Ajoutez {n} article(s) supplémentaire(s) pour obtenir la livraison gratuite !",
    retirer: "Retirer",
    taille: "Taille",
    couleur: "Couleur",
    
    // Checkout
    commande_titre: "Finaliser la commande",
    etape_commande: "Commande",
    etape_livraison: "Livraison",
    etape_paiement: "Paiement",
    infos_personnelles: "Informations personnelles",
    prenom: "Prénom",
    nom: "Nom",
    telephone: "Numéro de téléphone",
    email: "Adresse e-mail (optionnel)",
    adresse_complete: "Adresse complète (optionnel)",
    choisir_wilaya: "Choisir une wilaya",
    choisir_commune: "Choisir une commune",
    choisir_dabord_wilaya: "Choisir d'abord une wilaya",
    wilaya: "Wilaya",
    commune: "Commune",
    paiement_cash: "Paiement en espèces à la livraison",
    paiement_cash_desc: "Vous paierez le montant total en espèces directement au livreur lors de la réception de votre colis.",
    valider_commande_btn: "Valider ma commande",
    veuillez_remplir: "Veuillez remplir tous les champs requis.",
    chargement: "Chargement...",
    
    // Confirmation
    confirmation_titre: "Commande Confirmée",
    merci: "Merci pour votre confiance !",
    commande_reçue: "Votre commande a été reçue avec succès et est en cours de préparation.",
    etape_reception: "1. Réception",
    etape_reception_desc: "Notre équipe valide votre colis sous 24 heures.",
    etape_expedition: "2. Expédition",
    etape_expedition_desc: "Votre colis est remis à notre transporteur de confiance.",
    etape_remise: "3. Remise en main propre",
    etape_remise_desc: "Paiement à la livraison lors de la remise de votre colis.",
    retour_accueil: "Retour à l'accueil",
    
    // Product Detail
    ajouter_panier: "Ajouter au panier",
    quantite: "Quantité",
    guide_tailles: "Guide des tailles",
    histoire: "Notre histoire",
    savoir_faire: "Savoir-faire",
    cgu: "Conditions d'utilisation",
    
    // Footer
    maison_la_votre: "La Maison La Votre",
    footer_desc: "Maison de haute maroquinerie créant des pièces intemporelles qui allient l'excellence de l'artisanat de luxe et l'élégance moderne.",
    aide_services: "Aide & Services",
    suivi_commande: "Suivi de commande",
    livraison_retours: "Livraison & Tarifs",
    guide_tailles_footer: "Guide des tailles",
    comment_commander: "Comment commander ?",
    nous_contacter: "Nous contacter",
    a_propos: "À Propos",
    histoire_la_votre: "L'Histoire",
    savoir_faire_la_votre: "Le Savoir-faire",
    cgu_footer: "Conditions Générales",
    droits_reserves: "Tous droits réservés.",
    alg_craft: "Artisanat Algérien d'Excellence",
    
    // Miscellaneous
    no_results: "Aucun produit ne correspond à votre recherche.",
    filtres: "Filtres",
    trier_par: "Trier par",
    reinitialiser: "Réinitialiser",
    recherche_resultats: "Résultats pour",
    mes_favoris: "Mes Favoris",
    favoris_vide: "Vous n'avez aucun article dans vos favoris.",
    prix_croissant: "Prix : croissant",
    prix_decroissant: "Prix : décroissant"
  },
  ar: {
    // Navbar
    nouveautes: "وصلنا حديثًا",
    sacs_main: "حقائب يد",
    collections: "التشكيلات",
    rechercher: "بحث",
    rechercher_placeholder: "ابحث عن منتج... (اضغط Enter للتأكيد)",
    chercher: "بحث",
    caddie: "السلة",
    favoris: "المفضلة",
    menu: "القائمة",
    slogan: "إنها لكِ بالفعل",
    
    // Hero
    printemps_ete: "ربيع — صيف 2026",
    nouvelle_collection: "التشكيلة الجديدة",
    hero_desc: "مصنوعات جلدية باريسية، خطوط نقية وتفاصيل مضيئة. قصيدة للأنوثة والجمال الجزائري المعاصر.",
    decouvrir_coll: "اكتشفي التشكيلة",
    sacs_main_btn: "حقائب يد",
    defiler: "مرري للأسفل",
    
    // Marquee
    livraison_algerie: "توصيل لكامل الجزائر",
    paiement_livraison: "الدفع عند الاستلام",
    qualite_premium: "جودة عالية ممتازة",
    artisanat_luxe: "صناعة حرفية فاخرة",
    
    // Features
    feat_delivery_title: "التوصيل لكافة الولايات الجزائرية",
    feat_delivery_sub: "سريع وآمن للغاية",
    feat_payment_title: "الدفع عند الاستلام",
    feat_payment_sub: "ادفع عند استلام طلبك",
    feat_craft_title: "صناعة يدوية فاخرة",
    feat_craft_sub: "صُنعت بكل حب وعناية",
    feat_support_title: "خدمة العملاء",
    feat_support_sub: "واتساب وإنستغرام",
    
    // Home sections
    derniers_arrivages: "أحدث المنتجات",
    les_nouveautes: "جديدنا",
    nouveautes_desc: "مجموعة مختارة بعناية فائقة من القطع ذات التشطيبات المتقنة — وصلت للتو.",
    voir_catalogue: "عرض كامل الكتالوج",
    selection_curatee: "مجموعة مختارة",
    les_essentiels: "أساسيات La Votre",
    essentiels_desc: "تصاميم خالدة، مصممة لترافق يومياتك بأناقة هادئة وراقية للغاية.",
    voir_collection: "عرض التشكيلة",
    note_moyenne: "متوسط التقييم",
    commandes_mois: "طلب / شهر",
    offre_exclusive: "عرض حصري",
    livraison_offerte: "توصيل مجاني",
    livraison_offerte_desc: "عند شراء 3 قطع أو أكثر، استمتعي بتوصيل مجاني كامل إلى أي مكان في الجزائر.",
    commander_maintenant: "اطلبي الآن",
    vous_aimerez_aussi: "قد يعجبكِ أيضًا",
    
    // Cart
    panier_titre: "سلتكِ",
    panier_vide: "سلة التسوق الخاصة بكِ فارغة.",
    continuer_achats: "مواصلة التسوق",
    recap_commande: "ملخص الطلب",
    sous_total: "المجموع الفرعي",
    livraison: "التوصيل",
    gratuit: "مجاني",
    offert_shipping: "مجاني 🎁",
    total: "المجموع الكلي",
    passer_commande: "إتمام الطلب",
    livraison_gratuite_alert: "توصيل مجاني مهدي لكِ !",
    livraison_gratuite_progress: "أضيفي {n} قطعة إضافية للحصول على توصيل مجاني !",
    retirer: "حذف",
    taille: "المقاس",
    couleur: "اللون",
    
    // Checkout
    commande_titre: "إتمام عملية الشراء",
    etape_commande: "الطلب",
    etape_livraison: "الشحن",
    etape_paiement: "الدفع",
    infos_personnelles: "المعلومات الشخصية",
    prenom: "الاسم الأول",
    nom: "اللقب",
    telephone: "رقم الهاتف",
    email: "البريد الإلكتروني (اختياري)",
    adresse_complete: "العنوان الكامل (اختياري)",
    choisir_wilaya: "اختر الولاية",
    choisir_commune: "اختر البلدية",
    choisir_dabord_wilaya: "اختر الولاية أولاً",
    wilaya: "الولاية",
    commune: "البلدية",
    paiement_cash: "الدفع نقدًا عند الاستلام",
    paiement_cash_desc: "ستدفعين المبلغ الإجمالي نقدًا مباشرة للموزع عند استلام طردكِ.",
    valider_commande_btn: "تأكيد طلبي الآن",
    veuillez_remplir: "يرجى ملء جميع الحقول المطلوبة.",
    chargement: "جاري التحميل...",
    
    // Confirmation
    confirmation_titre: "تم تأكيد طلبكِ بنجاح",
    merci: "شكرًا لثقتكِ بنا !",
    commande_reçue: "لقد تم استلام طلبكِ بنجاح وهو الآن قيد التحضير والتجهيز.",
    etape_reception: "1. الاستلام وتأكيد الطلب",
    etape_reception_desc: "يقوم فريقنا بمراجعة وتأكيد طلبكِ خلال 24 ساعة.",
    etape_expedition: "2. الشحن والتسليم",
    etape_expedition_desc: "يتم تسليم طردكِ إلى شريك الشحن الموثوق لدينا.",
    etape_remise: "3. التسليم يدًا بيد",
    etape_remise_desc: "الدفع نقدًا عند استلام طردكِ من عامل التوصيل.",
    retour_accueil: "العودة للرئيسية",
    
    // Product Detail
    ajouter_panier: "إضافة إلى السلة",
    quantite: "الكمية",
    guide_tailles: "دليل المقاسات",
    histoire: "قصتنا",
    savoir_faire: "خبرتنا الحرفية",
    cgu: "شروط الاستخدام",
    
    // Footer
    maison_la_votre: "دار لا فوتر",
    footer_desc: "دار للمصنوعات الجلدية الراقية تصنع قطعًا خالدة تجمع بين التميز في الحرفية الفاخرة والأناقة العصرية.",
    aide_services: "المساعدة والخدمات",
    suivi_commande: "تتبع الطلبية",
    livraison_retours: "الشحن والأسعار",
    guide_tailles_footer: "دليل المقاسات",
    comment_commander: "كيفية الطلب ؟",
    nous_contacter: "اتصلي بنا",
    a_propos: "حول الدار",
    histoire_la_votre: "قصة الدار",
    savoir_faire_la_votre: "الخبرة الحرفية",
    cgu_footer: "الشروط العامة للبيع",
    droits_reserves: "جميع الحقوق محفوظة.",
    alg_craft: "حرفية جزائرية متميزة وفخمة",
    
    // Miscellaneous
    no_results: "لا توجد نتائج تطابق بحثكِ.",
    filtres: "تصفية",
    trier_par: "ترتيب حسب",
    reinitialiser: "إعادة ضبط",
    recherche_resultats: "نتائج البحث عن",
    mes_favoris: "مفضلتي",
    favoris_vide: "لا توجد أي عناصر في قائمتكِ المفضلة.",
    prix_croissant: "السعر: من الأقل إلى الأعلى",
    prix_decroissant: "السعر: من الأعلى إلى الأقل"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("la_votre_lang") || "fr");

  useEffect(() => {
    localStorage.setItem("la_votre_lang", lang);
    // Dynamic RTL support! Flips the layout naturally in modern browsers.
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "fr" ? "ar" : "fr"));
  };

  const t = (key, replacements = {}) => {
    let text = translations[lang]?.[key] || translations["fr"]?.[key] || key;
    
    // Support dynamic string templates, e.g. "Add {n} items"
    Object.keys(replacements).forEach((placeholder) => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    
    return text;
  };

  const p = (valueFr, valueAr) => {
    // Helper to return product fields which can be manually translated
    if (lang === "ar" && valueAr) return valueAr;
    return valueFr;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, p }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
